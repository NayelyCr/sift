"use client";

import { useOptimistic, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toggleFavorite } from "@/lib/actions/recipes";

// Angles for the little heart-burst particles that fly out when you favorite.
const BURST_ANGLES = [0, 72, 144, 216, 288];

export function FavoriteButton({
  recipeId,
  recipeSlug,
  initialFavorited,
  isSignedIn,
}: {
  recipeId: string;
  recipeSlug: string;
  initialFavorited: boolean;
  isSignedIn: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [favorited, setFavorited] = useOptimistic(
    initialFavorited,
    (_state: boolean, next: boolean) => next
  );
  // Incremented only when favoriting (not un-favoriting); remounting the
  // heart + burst particles on each bump replays their CSS animations.
  const [burstKey, setBurstKey] = useState(0);

  function handleClick() {
    if (!isSignedIn) {
      router.push(`/login?next=/recipes/${recipeSlug}`);
      return;
    }
    const willFavorite = !favorited;
    startTransition(async () => {
      setFavorited(willFavorite);
      if (willFavorite) {
        setBurstKey((k) => k + 1);
      }
      try {
        const result = await toggleFavorite(recipeId, recipeSlug);
        toast.success(result.favorited ? "Saved to your favorites" : "Removed from favorites");
      } catch {
        toast.error("Something went wrong. Try again.");
      }
    });
  }

  return (
    <Button
      type="button"
      variant={favorited ? "default" : "outline"}
      onClick={handleClick}
      disabled={isPending}
      className="gap-2"
    >
      <span className="relative inline-flex h-4 w-4">
        <Heart
          key={burstKey}
          className={cn(
            "h-4 w-4",
            favorited && "fill-current",
            burstKey > 0 && "heart-pop"
          )}
        />
        {burstKey > 0 && (
          <span
            key={`burst-${burstKey}`}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
          >
            {BURST_ANGLES.map((angle) => (
              <span
                key={angle}
                className="heart-burst-particle absolute left-1/2 top-1/2 block h-1 w-1 rounded-full bg-current"
                style={{ ["--angle" as string]: `${angle}deg` }}
              />
            ))}
          </span>
        )}
      </span>
      {favorited ? "Saved" : "Save recipe"}
    </Button>
  );
}
