import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Category, DietaryTag } from "@/lib/database.types";

export function RecipeFilters({
  categories,
  dietaryTags,
  defaultValues,
}: {
  categories: Category[];
  dietaryTags: DietaryTag[];
  defaultValues: {
    query?: string;
    category?: string;
    diet?: string;
    sort?: string;
  };
}) {
  return (
    <form
      action="/recipes"
      className="flex flex-col gap-3 rounded-xl border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:flex-wrap"
    >
      <div className="relative flex-1 min-w-[200px]">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          name="q"
          placeholder="Search recipes…"
          defaultValue={defaultValues.query}
          className="pl-9"
        />
      </div>

      <Select name="category" defaultValue={defaultValues.category ?? "all"}>
        <SelectTrigger className="sm:w-[180px]">
          <SelectValue placeholder="All categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All categories</SelectItem>
          {categories.map((c) => (
            <SelectItem key={c.id} value={c.slug}>
              {c.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select name="diet" defaultValue={defaultValues.diet ?? "all"}>
        <SelectTrigger className="sm:w-[170px]">
          <SelectValue placeholder="Any diet" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Any diet</SelectItem>
          {dietaryTags.map((t) => (
            <SelectItem key={t.id} value={t.slug}>
              {t.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select name="sort" defaultValue={defaultValues.sort ?? "newest"}>
        <SelectTrigger className="sm:w-[160px]">
          <SelectValue placeholder="Sort" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest</SelectItem>
          <SelectItem value="rating">Top rated</SelectItem>
          <SelectItem value="quickest">Quickest</SelectItem>
        </SelectContent>
      </Select>

      <Button type="submit" className="sm:ml-auto">
        Apply
      </Button>
    </form>
  );
}
