"use client";

import { useState } from "react";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import type { RecipeWithDetails } from "@/lib/database.types";

/**
 * Lets you check off ingredients as you gather them while cooking.
 * Local-only (not persisted) — this is a while-you-bake convenience,
 * not account data.
 */
export function IngredientChecklist({
  ingredients,
}: {
  ingredients: RecipeWithDetails["ingredients"];
}) {
  const [checked, setChecked] = useState<Set<number>>(new Set());

  function toggle(id: number) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  return (
    <ul className="flex flex-col gap-1">
      {ingredients.map((ri) => {
        const done = checked.has(ri.id);
        return (
          <li key={ri.id}>
            <button
              type="button"
              role="checkbox"
              aria-checked={done}
              onClick={() => toggle(ri.id)}
              className="group flex w-full items-start gap-2.5 rounded-md px-1 py-1.5 text-left text-sm transition-colors hover:bg-accent/40"
            >
              <span
                className={cn(
                  "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors duration-200",
                  done
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-input group-hover:border-primary"
                )}
              >
                {done && <Check className="checklist-pop h-3 w-3" />}
              </span>
              <span
                className={cn(
                  "transition-colors duration-200",
                  done && "text-muted-foreground line-through"
                )}
              >
                <span className="font-medium">
                  {ri.quantity}
                  {ri.unit ? ` ${ri.unit}` : ""}
                </span>{" "}
                <span>
                  {ri.ingredient.name}
                  {ri.notes ? `, ${ri.notes}` : ""}
                </span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
