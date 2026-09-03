import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { RecipeForm } from "@/components/recipe-form";
import { getCategories, getCurrentUser, getDietaryTags } from "@/lib/data";

export const metadata: Metadata = { title: "Submit a Recipe" };

export default async function NewRecipePage() {
  const session = await getCurrentUser();
  if (!session) {
    redirect("/login?next=/recipes/new");
  }

  const [categories, dietaryTags] = await Promise.all([
    getCategories(),
    getDietaryTags(),
  ]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="mb-2 font-display text-3xl font-semibold">Submit a Recipe</h1>
      <p className="mb-8 text-muted-foreground">
        Share one of your own bakes with the Sift community.
      </p>
      <RecipeForm categories={categories} dietaryTags={dietaryTags} />
    </div>
  );
}
