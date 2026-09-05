import "server-only";

import { createClient } from "@/lib/supabase/server";
import type {
  Category,
  DietaryTag,
  Profile,
  Rating,
  RecipeCardData,
  RecipeWithDetails,
} from "@/lib/database.types";

// Shared select string for the "card" shape used on grids everywhere.
//
// NOTE: `recipe_stats` is a plain SQL view (an aggregate over `ratings`), not
// a table with a real foreign key to `recipes`, so PostgREST can't embed it
// with `stats:recipe_stats(*)` — that fails at request time with PGRST200
// ("Could not find a relationship between 'recipes' and 'recipe_stats'").
// We fetch it separately instead (see `attachStats` below) and merge it in.
const RECIPE_CARD_SELECT = `
  *,
  categories:recipe_categories(category:categories(*)),
  dietary_tags:recipe_dietary_tags(tag:dietary_tags(*))
`;

type RawCardRow = Record<string, unknown> & {
  categories?: { category: Category }[] | null;
  dietary_tags?: { tag: DietaryTag }[] | null;
};

function normalizeCard(row: RawCardRow): RecipeCardData {
  return {
    ...(row as unknown as RecipeCardData),
    categories: (row.categories ?? []).map((c) => c.category).filter(Boolean),
    dietary_tags: (row.dietary_tags ?? []).map((d) => d.tag).filter(Boolean),
    stats: null,
  };
}

// Fetches recipe_stats for a batch of recipes and merges it in, since it
// can't be embedded directly in the main select (see note above).
async function attachStats<T extends { id: string; stats: RecipeCardData["stats"] }>(
  supabase: Awaited<ReturnType<typeof createClient>>,
  recipes: T[]
): Promise<T[]> {
  if (recipes.length === 0) return recipes;
  const ids = recipes.map((r) => r.id);
  const { data, error } = await supabase
    .from("recipe_stats")
    .select("*")
    .in("recipe_id", ids);
  if (error) throw error;
  const statsById = new Map(
    (data ?? []).map((s) => [(s as { recipe_id: string }).recipe_id, s])
  );
  return recipes.map((r) => ({
    ...r,
    stats: (statsById.get(r.id) as RecipeCardData["stats"]) ?? null,
  }));
}

export type RecipeFilters = {
  query?: string;
  category?: string; // category slug
  diet?: string; // dietary tag slug
  sort?: "newest" | "rating" | "quickest";
};

export async function getRecipes(filters: RecipeFilters = {}) {
  const supabase = await createClient();

  let query = supabase.from("recipes").select(RECIPE_CARD_SELECT);

  if (filters.query) {
    query = query.or(
      `title.ilike.%${filters.query}%,description.ilike.%${filters.query}%`
    );
  }

  switch (filters.sort) {
    case "quickest":
      query = query.order("prep_minutes", { ascending: true });
      break;
    case "newest":
    default:
      query = query.order("created_at", { ascending: false });
      break;
  }

  const { data, error } = await query;
  if (error) throw error;

  let recipes = await attachStats(
    supabase,
    (data ?? []).map((row) => normalizeCard(row as unknown as RawCardRow))
  );

  // Category / diet filters and rating sort are applied in memory since they
  // depend on the joined rows above — simplest correct approach at this scale.
  if (filters.category) {
    recipes = recipes.filter((r) =>
      r.categories.some((c) => c.slug === filters.category)
    );
  }
  if (filters.diet) {
    recipes = recipes.filter((r) =>
      r.dietary_tags.some((d) => d.slug === filters.diet)
    );
  }
  if (filters.sort === "rating") {
    recipes = recipes.sort(
      (a, b) => (b.stats?.avg_rating ?? 0) - (a.stats?.avg_rating ?? 0)
    );
  }

  return recipes;
}

export async function getFeaturedRecipes(limit = 6) {
  const recipes = await getRecipes({ sort: "newest" });
  return recipes.slice(0, limit);
}

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name");
  if (error) throw error;
  return data ?? [];
}

export async function getDietaryTags(): Promise<DietaryTag[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("dietary_tags")
    .select("*")
    .order("name");
  if (error) throw error;
  return data ?? [];
}

export async function getRecipeBySlug(
  slug: string
): Promise<RecipeWithDetails | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("recipes")
    .select(
      `
      *,
      author:profiles(id, username, display_name),
      categories:recipe_categories(category:categories(*)),
      dietary_tags:recipe_dietary_tags(tag:dietary_tags(*)),
      ingredients:recipe_ingredients(*, ingredient:ingredients(*)),
      steps:recipe_steps(*)
    `
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const row = data as unknown as RawCardRow & {
    author: RecipeWithDetails["author"];
    ingredients: RecipeWithDetails["ingredients"];
    steps: RecipeWithDetails["steps"];
  };

  const { data: statsRow, error: statsError } = await supabase
    .from("recipe_stats")
    .select("*")
    .eq("recipe_id", row.id as string)
    .maybeSingle();
  if (statsError) throw statsError;

  return {
    ...(row as unknown as RecipeWithDetails),
    categories: (row.categories ?? []).map((c) => c.category).filter(Boolean),
    dietary_tags: (row.dietary_tags ?? []).map((d) => d.tag).filter(Boolean),
    ingredients: [...row.ingredients].sort((a, b) => a.sort_order - b.sort_order),
    steps: [...row.steps].sort((a, b) => a.step_number - b.step_number),
    stats: (statsRow as RecipeWithDetails["stats"]) ?? null,
  };
}

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  return { user, profile };
}

export async function getUserFavoriteSlugs(userId: string): Promise<Set<string>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("favorites")
    .select("recipe:recipes(slug)")
    .eq("user_id", userId);
  if (error) throw error;
  const rows = (data ?? []) as unknown as { recipe: { slug: string } | null }[];
  return new Set(rows.map((r) => r.recipe?.slug).filter(Boolean) as string[]);
}

export async function getUserFavorites(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("favorites")
    .select(`recipe:recipes(${RECIPE_CARD_SELECT})`)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  const rows = (data ?? []) as unknown as { recipe: RawCardRow | null }[];
  const recipes = rows
    .map((r) => r.recipe)
    .filter(Boolean)
    .map((r) => normalizeCard(r as RawCardRow));
  return attachStats(supabase, recipes);
}

export async function getUserRecipes(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("recipes")
    .select(RECIPE_CARD_SELECT)
    .eq("author_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  const recipes = (data ?? []).map((row) => normalizeCard(row as unknown as RawCardRow));
  return attachStats(supabase, recipes);
}

export async function getUserRatingForRecipe(userId: string, recipeId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("ratings")
    .select("*")
    .eq("user_id", userId)
    .eq("recipe_id", recipeId)
    .maybeSingle();
  return data ?? null;
}

export type RatingWithAuthor = Rating & {
  author: Pick<Profile, "username" | "display_name"> | null;
};

export async function getRatingsForRecipe(
  recipeId: string
): Promise<RatingWithAuthor[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("ratings")
    .select("*, author:profiles(username, display_name)")
    .eq("recipe_id", recipeId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as RatingWithAuthor[];
}
