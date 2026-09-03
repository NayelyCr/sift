import type { Metadata } from "next";
import Link from "next/link";

import { RecipeCard } from "@/components/recipe-card";
import { RecipeFilters } from "@/components/recipe-filters";
import { getCategories, getDietaryTags, getRecipes } from "@/lib/data";

export const metadata: Metadata = {
  title: "All Recipes",
};

type SearchParams = Promise<{
  q?: string;
  category?: string;
  diet?: string;
  sort?: string;
}>;

export default async function RecipesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const category = params.category && params.category !== "all" ? params.category : undefined;
  const diet = params.diet && params.diet !== "all" ? params.diet : undefined;
  const sort = (params.sort as "newest" | "rating" | "quickest") || "newest";

  const [recipes, categories, dietaryTags] = await Promise.all([
    getRecipes({ query: params.q, category, diet, sort }),
    getCategories(),
    getDietaryTags(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="font-display text-3xl font-semibold">All Recipes</h1>
        <p className="text-muted-foreground">
          {recipes.length} recipe{recipes.length === 1 ? "" : "s"}
          {category ? ` in ${categories.find((c) => c.slug === category)?.name ?? category}` : ""}
        </p>
      </div>

      <div className="mb-8">
        <RecipeFilters
          categories={categories}
          dietaryTags={dietaryTags}
          defaultValues={{ query: params.q, category, diet, sort }}
        />
      </div>

      {recipes.length === 0 ? (
        <div className="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
          No recipes match those filters yet. Try broadening your search, or{" "}
          <Link href="/recipes/new" className="text-primary underline underline-offset-2">
            submit one yourself
          </Link>
          .
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
}
