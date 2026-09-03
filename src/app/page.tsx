import Link from "next/link";
import { ArrowRight, Search, Users, PenLine } from "lucide-react";

import { Button } from "@/components/ui/button";
import { RecipeCard } from "@/components/recipe-card";
import { getCategories, getFeaturedRecipes } from "@/lib/data";

// Recipe data changes whenever someone submits or rates a recipe, and this
// page has no dynamic segment or search params of its own, so render it on
// each request rather than trying to prerender it against the database.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [recipes, categories] = await Promise.all([
    getFeaturedRecipes(6),
    getCategories(),
  ]);

  return (
    <div>
      <section className="border-b bg-secondary/40">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-16 sm:px-6 sm:py-24">
          <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent-foreground">
            A community baking cookbook
          </span>
          <h1 className="max-w-2xl font-display text-4xl font-semibold leading-tight sm:text-5xl">
            Recipes worth flouring your counter for.
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            Browse tested cookie, bread, cake, and pastry recipes, save your favorites,
            and share your own with a community of home bakers.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" asChild>
              <Link href="/recipes">
                Browse recipes
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/recipes/new">Submit a recipe</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/recipes?category=${c.slug}`}
              className="rounded-full border bg-card px-4 py-1.5 text-sm font-medium transition-colors hover:border-primary hover:text-primary"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-display text-2xl font-semibold">Latest recipes</h2>
          <Link
            href="/recipes"
            className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            View all
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </section>

      <section className="border-t bg-secondary/40">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 md:grid-cols-3">
          <div className="flex flex-col gap-2">
            <Search className="h-6 w-6 text-primary" />
            <h3 className="font-display text-lg font-semibold">Find your next bake</h3>
            <p className="text-sm text-muted-foreground">
              Filter by category, dietary need, or how quick it is — from
              15-minute cookies to weekend croissant projects.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <PenLine className="h-6 w-6 text-primary" />
            <h3 className="font-display text-lg font-semibold">Share your own</h3>
            <p className="text-sm text-muted-foreground">
              Create an account and submit your own recipes, complete with
              ingredients, steps, and dietary tags.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Users className="h-6 w-6 text-primary" />
            <h3 className="font-display text-lg font-semibold">Rate and review</h3>
            <p className="text-sm text-muted-foreground">
              Leave star ratings and notes on recipes you&apos;ve tried, and save
              favorites to come back to later.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
