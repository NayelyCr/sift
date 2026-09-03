"use client";

import { useActionState, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createRecipe, type RecipeFormState } from "@/lib/actions/recipes";
import type { Category, DietaryTag } from "@/lib/database.types";

type IngredientRow = { name: string; quantity: string; unit: string; notes: string };

export function RecipeForm({
  categories,
  dietaryTags,
}: {
  categories: Category[];
  dietaryTags: DietaryTag[];
}) {
  const [state, formAction, pending] = useActionState<RecipeFormState, FormData>(
    createRecipe,
    undefined
  );

  const [ingredients, setIngredients] = useState<IngredientRow[]>([
    { name: "", quantity: "", unit: "", notes: "" },
  ]);
  const [steps, setSteps] = useState<string[]>([""]);

  function updateIngredient(index: number, patch: Partial<IngredientRow>) {
    setIngredients((rows) => rows.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  function updateStep(index: number, value: string) {
    setSteps((rows) => rows.map((row, i) => (i === index ? value : row)));
  }

  return (
    <form action={formAction} className="flex flex-col gap-8">
      <input type="hidden" name="ingredients_json" value={JSON.stringify(ingredients)} />
      <input type="hidden" name="steps_json" value={JSON.stringify(steps)} />

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-xl font-semibold">The basics</h2>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="title">Recipe title</Label>
          <Input id="title" name="title" required placeholder="Grandma's Snickerdoodles" />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="description">Short description</Label>
          <Textarea
            id="description"
            name="description"
            required
            rows={2}
            placeholder="A one or two sentence description of what makes this recipe worth making."
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="image_url">Photo URL (optional)</Label>
          <Input id="image_url" name="image_url" type="url" placeholder="https://…" />
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="prep_minutes">Prep (min)</Label>
            <Input id="prep_minutes" name="prep_minutes" type="number" min={0} required defaultValue={15} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cook_minutes">Cook (min)</Label>
            <Input id="cook_minutes" name="cook_minutes" type="number" min={0} required defaultValue={20} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="servings">Servings</Label>
            <Input id="servings" name="servings" type="number" min={1} required defaultValue={8} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="difficulty">Difficulty</Label>
            <Select name="difficulty" defaultValue="easy">
              <SelectTrigger id="difficulty">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-xl font-semibold">Categories</h2>
        <div className="flex flex-wrap gap-3">
          {categories.map((c) => (
            <label key={c.id} className="flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm has-[:checked]:border-primary has-[:checked]:bg-accent">
              <input type="checkbox" name="categories" value={c.slug} className="accent-primary" />
              {c.name}
            </label>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-xl font-semibold">Dietary tags</h2>
        <div className="flex flex-wrap gap-3">
          {dietaryTags.map((t) => (
            <label key={t.id} className="flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm has-[:checked]:border-primary has-[:checked]:bg-accent">
              <input type="checkbox" name="dietary_tags" value={t.slug} className="accent-primary" />
              {t.name}
            </label>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-xl font-semibold">Ingredients</h2>
        {ingredients.map((row, i) => (
          <div key={i} className="grid grid-cols-[1fr_auto] gap-2 sm:grid-cols-[80px_80px_1fr_1fr_auto]">
            <Input
              placeholder="Qty"
              value={row.quantity}
              onChange={(e) => updateIngredient(i, { quantity: e.target.value })}
              className="col-span-1"
            />
            <Input
              placeholder="Unit"
              value={row.unit}
              onChange={(e) => updateIngredient(i, { unit: e.target.value })}
            />
            <Input
              placeholder="Ingredient (e.g. All-purpose flour)"
              value={row.name}
              onChange={(e) => updateIngredient(i, { name: e.target.value })}
            />
            <Input
              placeholder="Notes (optional)"
              value={row.notes}
              onChange={(e) => updateIngredient(i, { notes: e.target.value })}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setIngredients((rows) => rows.filter((_, idx) => idx !== i))}
              disabled={ingredients.length === 1}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="self-start gap-1.5"
          onClick={() =>
            setIngredients((rows) => [...rows, { name: "", quantity: "", unit: "", notes: "" }])
          }
        >
          <Plus className="h-4 w-4" />
          Add ingredient
        </Button>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-xl font-semibold">Instructions</h2>
        {steps.map((step, i) => (
          <div key={i} className="flex gap-2">
            <span className="flex h-9 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
              {i + 1}
            </span>
            <Textarea
              value={step}
              onChange={(e) => updateStep(i, e.target.value)}
              placeholder={`Step ${i + 1}…`}
              rows={2}
              className="flex-1"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setSteps((rows) => rows.filter((_, idx) => idx !== i))}
              disabled={steps.length === 1}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="ml-9 self-start gap-1.5"
          onClick={() => setSteps((rows) => [...rows, ""])}
        >
          <Plus className="h-4 w-4" />
          Add step
        </Button>
      </section>

      {state?.error && (
        <p className="text-sm font-medium text-destructive">{state.error}</p>
      )}

      <Button type="submit" size="lg" disabled={pending} className="self-start">
        {pending ? "Publishing…" : "Publish recipe"}
      </Button>
    </form>
  );
}
