import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RecipeCard } from "@/components/recipe-card";
import { getCurrentUser, getUserFavorites, getUserRecipes } from "@/lib/data";

export const metadata: Metadata = { title: "My Account" };

export default async function AccountPage() {
  const session = await getCurrentUser();
  if (!session) {
    redirect("/login?next=/account");
  }

  const [myRecipes, myFavorites] = await Promise.all([
    getUserRecipes(session.user.id),
    getUserFavorites(session.user.id),
  ]);

  const name = session.profile?.display_name || session.profile?.username || "Baker";

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex items-center gap-4">
        <Avatar className="h-14 w-14">
          <AvatarFallback className="bg-accent text-lg text-accent-foreground">
            {name.slice(0, 1).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="font-display text-2xl font-semibold">{name}</h1>
          <p className="text-sm text-muted-foreground">{session.user.email}</p>
        </div>
        <Button asChild className="ml-auto">
          <Link href="/recipes/new">Submit a recipe</Link>
        </Button>
      </div>

      <Tabs defaultValue="recipes">
        <TabsList>
          <TabsTrigger value="recipes">My Recipes ({myRecipes.length})</TabsTrigger>
          <TabsTrigger value="favorites">Favorites ({myFavorites.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="recipes" className="pt-6">
          {myRecipes.length === 0 ? (
            <p className="text-muted-foreground">
              You haven&apos;t submitted any recipes yet.{" "}
              <Link href="/recipes/new" className="text-primary underline underline-offset-2">
                Submit your first one
              </Link>
              .
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {myRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="favorites" className="pt-6">
          {myFavorites.length === 0 ? (
            <p className="text-muted-foreground">
              You haven&apos;t saved any favorites yet.{" "}
              <Link href="/recipes" className="text-primary underline underline-offset-2">
                Browse recipes
              </Link>
              .
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {myFavorites.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
