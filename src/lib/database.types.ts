// Hand-written to mirror supabase/schema.sql. If you change the schema,
// update this file to match (or regenerate with the Supabase CLI:
// `supabase gen types typescript --project-id <id> > src/lib/database.types.ts`).
//
// Every table/view below carries a `Relationships: []` field even though we
// don't populate it with real foreign-key metadata — the supabase-js /
// postgrest-js generics require that shape to be present to infer row types
// correctly (its GenericTable/GenericView types require it); omitting it
// silently degrades every query's inferred type to `never`.

type Relationships = never[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          display_name: string | null;
          bio: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          username: string;
          display_name?: string | null;
          bio?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          display_name?: string | null;
          bio?: string | null;
          created_at?: string;
        };
        Relationships: Relationships;
      };
      categories: {
        Row: { id: number; name: string; slug: string };
        Insert: { id?: number; name: string; slug: string };
        Update: { id?: number; name?: string; slug?: string };
        Relationships: Relationships;
      };
      dietary_tags: {
        Row: { id: number; name: string; slug: string };
        Insert: { id?: number; name: string; slug: string };
        Update: { id?: number; name?: string; slug?: string };
        Relationships: Relationships;
      };
      ingredients: {
        Row: { id: number; name: string };
        Insert: { id?: number; name: string };
        Update: { id?: number; name?: string };
        Relationships: Relationships;
      };
      recipes: {
        Row: {
          id: string;
          slug: string;
          title: string;
          description: string;
          image_url: string | null;
          prep_minutes: number;
          cook_minutes: number;
          servings: number;
          difficulty: "easy" | "medium" | "hard";
          author_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          description: string;
          image_url?: string | null;
          prep_minutes: number;
          cook_minutes: number;
          servings: number;
          difficulty: "easy" | "medium" | "hard";
          author_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["recipes"]["Insert"]>;
        Relationships: Relationships;
      };
      recipe_categories: {
        Row: { recipe_id: string; category_id: number };
        Insert: { recipe_id: string; category_id: number };
        Update: { recipe_id?: string; category_id?: number };
        Relationships: Relationships;
      };
      recipe_dietary_tags: {
        Row: { recipe_id: string; tag_id: number };
        Insert: { recipe_id: string; tag_id: number };
        Update: { recipe_id?: string; tag_id?: number };
        Relationships: Relationships;
      };
      recipe_ingredients: {
        Row: {
          id: number;
          recipe_id: string;
          ingredient_id: number;
          quantity: string;
          unit: string | null;
          notes: string | null;
          sort_order: number;
        };
        Insert: {
          id?: number;
          recipe_id: string;
          ingredient_id: number;
          quantity: string;
          unit?: string | null;
          notes?: string | null;
          sort_order?: number;
        };
        Update: Partial<
          Database["public"]["Tables"]["recipe_ingredients"]["Insert"]
        >;
        Relationships: Relationships;
      };
      recipe_steps: {
        Row: {
          id: number;
          recipe_id: string;
          step_number: number;
          instruction: string;
        };
        Insert: {
          id?: number;
          recipe_id: string;
          step_number: number;
          instruction: string;
        };
        Update: Partial<Database["public"]["Tables"]["recipe_steps"]["Insert"]>;
        Relationships: Relationships;
      };
      ratings: {
        Row: {
          id: string;
          recipe_id: string;
          user_id: string;
          rating: number;
          review: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          recipe_id: string;
          user_id: string;
          rating: number;
          review?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["ratings"]["Insert"]>;
        Relationships: Relationships;
      };
      favorites: {
        Row: { user_id: string; recipe_id: string; created_at: string };
        Insert: { user_id: string; recipe_id: string; created_at?: string };
        Update: { user_id?: string; recipe_id?: string; created_at?: string };
        Relationships: Relationships;
      };
    };
    Views: {
      recipe_stats: {
        Row: {
          recipe_id: string;
          avg_rating: number;
          rating_count: number;
        };
        Relationships: Relationships;
      };
    };
    Functions: Record<string, never>;
  };
};

export type Recipe = Database["public"]["Tables"]["recipes"]["Row"];
export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type DietaryTag = Database["public"]["Tables"]["dietary_tags"]["Row"];
export type Ingredient = Database["public"]["Tables"]["ingredients"]["Row"];
export type RecipeIngredient =
  Database["public"]["Tables"]["recipe_ingredients"]["Row"];
export type RecipeStep = Database["public"]["Tables"]["recipe_steps"]["Row"];
export type Rating = Database["public"]["Tables"]["ratings"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type RecipeStats = Database["public"]["Views"]["recipe_stats"]["Row"];

export type RecipeWithDetails = Recipe & {
  author: Pick<Profile, "id" | "username" | "display_name"> | null;
  categories: Category[];
  dietary_tags: DietaryTag[];
  ingredients: (RecipeIngredient & { ingredient: Ingredient })[];
  steps: RecipeStep[];
  stats: RecipeStats | null;
};

export type RecipeCardData = Recipe & {
  categories: Category[];
  dietary_tags: DietaryTag[];
  stats: RecipeStats | null;
};
