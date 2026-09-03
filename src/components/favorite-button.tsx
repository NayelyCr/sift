"use client";

import { useOptimistic, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toggleFavorite } from "@/lib/actions/recipes";

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

  function handleClick() {
    if (!isSignedIn) {
      router.push(`/login?next=/recipes/${recipeSlug}`);
      return;
    }
    startTransition(async () => {
      setFavorited(!favorited);
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
      <Heart className={cn("h-4 w-4", favorited && "fill-current")} />
      {favorited ? "Saved" : "Save recipe"}
    </Button>
  );
}
