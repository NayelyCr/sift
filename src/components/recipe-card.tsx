import Link from "next/link";
import { Clock, Star, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { RecipeCardData } from "@/lib/database.types";

const DIFFICULTY_LABEL: Record<string, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

export function RecipeCard({ recipe }: { recipe: RecipeCardData }) {
  const totalMinutes = recipe.prep_minutes + recipe.cook_minutes;
  const rating = recipe.stats?.avg_rating ?? 0;
  const ratingCount = recipe.stats?.rating_count ?? 0;

  return (
    <Link href={`/recipes/${recipe.slug}`} className="group block">
      <Card className="h-full overflow-hidden py-0 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
          {recipe.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element -- arbitrary user-submitted URLs, so we skip next/image's domain allowlist
            <img
              src={recipe.image_url}
              alt={recipe.title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : null}
        </div>
        <div className="flex flex-col gap-2 p-4">
          <div className="flex flex-wrap gap-1.5">
            {recipe.categories.slice(0, 2).map((c) => (
              <Badge key={c.id} variant="secondary" className="font-normal">
                {c.name}
              </Badge>
            ))}
          </div>
          <h3 className="font-display text-lg font-semibold leading-snug">
            {recipe.title}
          </h3>
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {recipe.description}
          </p>
          <div className="mt-1 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {totalMinutes} min
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {recipe.servings}
            </span>
            <span className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-accent-foreground/80 text-accent-foreground/80" />
              {rating > 0 ? rating.toFixed(1) : "New"}
              {ratingCount > 0 && <span>({ratingCount})</span>}
            </span>
            <Badge variant="outline" className="ml-auto font-normal">
              {DIFFICULTY_LABEL[recipe.difficulty]}
            </Badge>
          </div>
        </div>
      </Card>
    </Link>
  );
}
