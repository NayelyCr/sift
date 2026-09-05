"use client";

import { useState } from "react";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import type { RecipeWithDetails } from "@/lib/database.types";

/**
 * Lets you check off instructions as you go while cooking.
 * Local-only (not persisted) — this is a while-you-bake convenience,
 * not account data.
 */
export function StepChecklist({ steps }: { steps: RecipeWithDetails["steps"] }) {
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
    <ol className="flex flex-col gap-1">
      {steps.map((step) => {
        const done = checked.has(step.id);
        return (
          <li key={step.id}>
            <button
              type="button"
              role="checkbox"
              aria-checked={done}
              onClick={() => toggle(step.id)}
              className="group flex w-full gap-3 rounded-md px-1 py-2 text-left text-sm leading-relaxed transition-colors hover:bg-accent/40"
            >
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors duration-200",
                  done
                    ? "bg-primary text-primary-foreground"
                    : "bg-accent text-accent-foreground"
                )}
              >
                {done ? (
                  <Check className="checklist-pop h-3.5 w-3.5" />
                ) : (
                  step.step_number
                )}
              </span>
              <span
                className={cn(
                  "pt-0.5 transition-colors duration-200",
                  done && "text-muted-foreground line-through decoration-2"
                )}
              >
                {step.instruction}
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
