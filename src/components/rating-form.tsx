"use client";

import { useState, useTransition } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { submitRating } from "@/lib/actions/recipes";

export function RatingForm({
  recipeId,
  recipeSlug,
  existingRating,
  existingReview,
}: {
  recipeId: string;
  recipeSlug: string;
  existingRating?: number;
  existingReview?: string | null;
}) {
  const [rating, setRating] = useState(existingRating ?? 0);
  const [hovered, setHovered] = useState(0);
  const [review, setReview] = useState(existingReview ?? "");
  const [isPending, startTransition] = useTransition();

  function handleSubmit() {
    if (rating < 1) {
      toast.error("Pick a star rating first.");
      return;
    }
    startTransition(async () => {
      const result = await submitRating(recipeId, recipeSlug, rating, review);
      if (result && "error" in result) {
        toast.error(result.error);
      } else {
        toast.success(existingRating ? "Rating updated" : "Thanks for rating this recipe!");
      }
    });
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-card p-4">
      <p className="text-sm font-medium">
        {existingRating ? "Update your rating" : "Rate this recipe"}
      </p>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className="p-0.5"
            aria-label={`${star} star${star > 1 ? "s" : ""}`}
          >
            <Star
              className={cn(
                "h-6 w-6 text-muted-foreground transition-colors",
                (hovered || rating) >= star && "fill-accent-foreground text-accent-foreground"
              )}
            />
          </button>
        ))}
      </div>
      <Textarea
        placeholder="Optional: share how it turned out, swaps you made, tips…"
        value={review}
        onChange={(e) => setReview(e.target.value)}
        rows={3}
      />
      <Button
        type="button"
        onClick={handleSubmit}
        disabled={isPending}
        className="self-start"
      >
        {existingRating ? "Update rating" : "Submit rating"}
      </Button>
    </div>
  );
}
