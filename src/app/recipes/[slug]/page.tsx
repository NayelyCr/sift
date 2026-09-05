import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, Star, Users, ChefHat } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { FavoriteButton } from "@/components/favorite-button";
import { RatingForm } from "@/components/rating-form";
import { IngredientChecklist } from "@/components/ingredient-checklist";
import { StepChecklist } from "@/components/step-checklist";
import {
  getCurrentUser,
  getRatingsForRecipe,
  getRecipeBySlug,
  getUserFavoriteSlugs,
  getUserRatingForRecipe,
} from "@/lib/data";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const recipe = await getRecipeBySlug(slug);
  if (!recipe) return {};
  return {
    title: recipe.title,
    description: recipe.description,
  };
}

const DIFFICULTY_LABEL: Record<string, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

export default async function RecipeDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const recipe = await getRecipeBySlug(slug);
  if (!recipe) notFound();

  const session = await getCurrentUser();
  const [favoriteSlugs, myRating, reviews] = await Promise.all([
    session ? getUserFavoriteSlugs(session.user.id) : Promise.resolve(new Set<string>()),
    session ? getUserRatingForRecipe(session.user.id, recipe.id) : Promise.resolve(null),
    getRatingsForRecipe(recipe.id),
  ]);

  const rating = recipe.stats?.avg_rating ?? 0;
  const ratingCount = recipe.stats?.rating_count ?? 0;
  const authorName = recipe.author?.display_name || recipe.author?.username;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="relative mb-6 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-muted">
        {recipe.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={recipe.image_url}
            alt={recipe.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : null}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {recipe.categories.map((c) => (
          <Badge key={c.id} variant="secondary">
            {c.name}
          </Badge>
        ))}
        {recipe.dietary_tags.map((t) => (
          <Badge key={t.id} variant="outline">
            {t.name}
          </Badge>
        ))}
      </div>

      <h1 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
        {recipe.title}
      </h1>
      <p className="mt-2 text-lg text-muted-foreground">{recipe.description}</p>

      <div className="mt-4 flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Clock className="h-4 w-4" />
          {recipe.prep_minutes} min prep · {recipe.cook_minutes} min cook
        </span>
        <span className="flex items-center gap-1.5">
          <Users className="h-4 w-4" />
          Serves {recipe.servings}
        </span>
        <span className="flex items-center gap-1.5">
          <ChefHat className="h-4 w-4" />
          {DIFFICULTY_LABEL[recipe.difficulty]}
        </span>
        <span className="flex items-center gap-1.5">
          <Star className="h-4 w-4 fill-accent-foreground/80 text-accent-foreground/80" />
          {rating > 0 ? `${rating.toFixed(1)} (${ratingCount} rating${ratingCount === 1 ? "" : "s"})` : "No ratings yet"}
        </span>
        {authorName && <span>By {authorName}</span>}
      </div>

      <div className="mt-6">
        <FavoriteButton
          recipeId={recipe.id}
          recipeSlug={recipe.slug}
          initialFavorited={favoriteSlugs.has(recipe.slug)}
          isSignedIn={!!session}
        />
      </div>

      <Separator className="my-10" />

      <div className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_1.5fr]">
        <div>
          <h2 className="mb-4 font-display text-xl font-semibold">Ingredients</h2>
          <p className="mb-2 text-xs text-muted-foreground">
            Tap an ingredient to check it off as you gather it.
          </p>
          <IngredientChecklist ingredients={recipe.ingredients} />
        </div>

        <div>
          <h2 className="mb-4 font-display text-xl font-semibold">Instructions</h2>
          <p className="mb-2 text-xs text-muted-foreground">
            Tap a step to check it off as you go.
          </p>
          <StepChecklist steps={recipe.steps} />
        </div>
      </div>

      <Separator className="my-10" />

      <div>
        <h2 className="mb-4 font-display text-xl font-semibold">Ratings & Reviews</h2>

        {session ? (
          <div className="mb-8">
            <RatingForm
              recipeId={recipe.id}
              recipeSlug={recipe.slug}
              existingRating={myRating?.rating}
              existingReview={myRating?.review}
            />
          </div>
        ) : (
          <p className="mb-8 text-sm text-muted-foreground">
            <Link href={`/login?next=/recipes/${recipe.slug}`} className="text-primary underline underline-offset-2">
              Log in
            </Link>{" "}
            to rate this recipe.
          </p>
        )}

        {reviews.length === 0 ? (
          <p className="text-sm text-muted-foreground">No reviews yet — be the first!</p>
        ) : (
          <ul className="flex flex-col gap-5">
            {reviews.map((r) => {
              const name = r.author?.display_name || r.author?.username || "A baker";
              return (
                <li key={r.id} className="flex gap-3 border-t pt-5 first:border-t-0 first:pt-0">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-accent text-xs text-accent-foreground">
                      {name.slice(0, 1).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{name}</span>
                      <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                        <Star className="h-3 w-3 fill-accent-foreground/80 text-accent-foreground/80" />
                        {r.rating}
                      </span>
                    </div>
                    {r.review && <p className="mt-1 text-sm text-muted-foreground">{r.review}</p>}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
