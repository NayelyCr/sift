"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);
}

function randomSuffix() {
  return Math.random().toString(36).slice(2, 7);
}

export type RecipeFormState = { error: string } | undefined;

type IngredientInput = {
  name: string;
  quantity: string;
  unit?: string;
  notes?: string;
};

export async function createRecipe(
  _prevState: RecipeFormState,
  formData: FormData
): Promise<RecipeFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/recipes/new");
  }

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const prepMinutes = Number(formData.get("prep_minutes"));
  const cookMinutes = Number(formData.get("cook_minutes"));
  const servings = Number(formData.get("servings"));
  const difficulty = String(formData.get("difficulty") ?? "easy");
  const imageUrl = String(formData.get("image_url") ?? "").trim() || null;
  const categorySlugs = formData.getAll("categories").map(String);
  const dietSlugs = formData.getAll("dietary_tags").map(String);

  let ingredients: IngredientInput[] = [];
  let steps: string[] = [];
  try {
    ingredients = JSON.parse(String(formData.get("ingredients_json") ?? "[]"));
    steps = JSON.parse(String(formData.get("steps_json") ?? "[]"));
  } catch {
    return { error: "Something went wrong reading the ingredients or steps." };
  }

  if (!title || !description) {
    return { error: "Title and description are required." };
  }
  if (!Number.isFinite(prepMinutes) || !Number.isFinite(cookMinutes) || !Number.isFinite(servings)) {
    return { error: "Prep time, cook time, and servings must be numbers." };
  }
  if (!["easy", "medium", "hard"].includes(difficulty)) {
    return { error: "Invalid difficulty." };
  }
  const cleanIngredients = ingredients
    .map((i) => ({
      name: (i.name ?? "").trim(),
      quantity: (i.quantity ?? "").trim(),
      unit: (i.unit ?? "").trim() || null,
      notes: (i.notes ?? "").trim() || null,
    }))
    .filter((i) => i.name && i.quantity);
  const cleanSteps = steps.map((s) => s.trim()).filter(Boolean);

  if (cleanIngredients.length === 0) {
    return { error: "Add at least one ingredient." };
  }
  if (cleanSteps.length === 0) {
    return { error: "Add at least one step." };
  }

  const slug = `${slugify(title)}-${randomSuffix()}`;

  const { data: recipe, error: recipeError } = await supabase
    .from("recipes")
    .insert({
      slug,
      title,
      description,
      image_url: imageUrl,
      prep_minutes: prepMinutes,
      cook_minutes: cookMinutes,
      servings,
      difficulty: difficulty as "easy" | "medium" | "hard",
      author_id: user.id,
    })
    .select()
    .single();

  if (recipeError || !recipe) {
    return { error: recipeError?.message ?? "Could not create the recipe." };
  }

  const recipeId = recipe.id;

  if (categorySlugs.length > 0) {
    const { data: cats } = await supabase
      .from("categories")
      .select("id, slug")
      .in("slug", categorySlugs);
    if (cats && cats.length > 0) {
      await supabase
        .from("recipe_categories")
        .insert(cats.map((c) => ({ recipe_id: recipeId, category_id: c.id })));
    }
  }

  if (dietSlugs.length > 0) {
    const { data: tags } = await supabase
      .from("dietary_tags")
      .select("id, slug")
      .in("slug", dietSlugs);
    if (tags && tags.length > 0) {
      await supabase
        .from("recipe_dietary_tags")
        .insert(tags.map((t) => ({ recipe_id: recipeId, tag_id: t.id })));
    }
  }

  for (let i = 0; i < cleanIngredients.length; i++) {
    const ing = cleanIngredients[i];
    const { data: ingredientRow, error: ingredientError } = await supabase
      .from("ingredients")
      .upsert({ name: ing.name }, { onConflict: "name" })
      .select()
      .single();

    if (ingredientError || !ingredientRow) continue;

    await supabase.from("recipe_ingredients").insert({
      recipe_id: recipeId,
      ingredient_id: ingredientRow.id,
      quantity: ing.quantity,
      unit: ing.unit,
      notes: ing.notes,
      sort_order: i,
    });
  }

  await supabase.from("recipe_steps").insert(
    cleanSteps.map((instruction, i) => ({
      recipe_id: recipeId,
      step_number: i + 1,
      instruction,
    }))
  );

  revalidatePath("/recipes");
  revalidatePath("/account");
  redirect(`/recipes/${slug}`);
}

export async function toggleFavorite(recipeId: string, recipeSlug: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=/recipes/${recipeSlug}`);
  }

  const { data: existing } = await supabase
    .from("favorites")
    .select("*")
    .eq("user_id", user.id)
    .eq("recipe_id", recipeId)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("favorites")
      .delete()
      .eq("user_id", user.id)
      .eq("recipe_id", recipeId);
  } else {
    await supabase.from("favorites").insert({ user_id: user.id, recipe_id: recipeId });
  }

  revalidatePath(`/recipes/${recipeSlug}`);
  revalidatePath("/account");

  return { favorited: !existing };
}

export async function submitRating(
  recipeId: string,
  recipeSlug: string,
  rating: number,
  review: string
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=/recipes/${recipeSlug}`);
  }

  if (rating < 1 || rating > 5) {
    return { error: "Rating must be between 1 and 5." };
  }

  const { error } = await supabase.from("ratings").upsert(
    {
      recipe_id: recipeId,
      user_id: user.id,
      rating,
      review: review.trim() || null,
    },
    { onConflict: "recipe_id,user_id" }
  );

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/recipes/${recipeSlug}`);
  return { success: true };
}

export async function deleteRecipe(recipeId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  await supabase.from("recipes").delete().eq("id", recipeId).eq("author_id", user.id);

  revalidatePath("/recipes");
  revalidatePath("/account");
  redirect("/account");
}
