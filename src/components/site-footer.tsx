import Link from "next/link";
import { ChefHat } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/70 bg-secondary/40">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-2 font-display text-lg font-semibold">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <ChefHat className="h-3.5 w-3.5" />
          </span>
          Sift
        </div>
        <p className="text-sm text-muted-foreground">
          A community baking cookbook. Built with Next.js, shadcn/ui, and Supabase.
        </p>
        <nav className="flex gap-4 text-sm text-muted-foreground">
          <Link href="/recipes" className="hover:text-foreground">
            Recipes
          </Link>
          <Link href="/recipes/new" className="hover:text-foreground">
            Submit
          </Link>
        </nav>
      </div>
    </footer>
  );
}
