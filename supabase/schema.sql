-- ============================================================================
-- Sift — Supabase schema
-- Run this once in your Supabase project's SQL Editor (Project > SQL Editor
-- > New query), then run seed.sql. Safe to re-run: it drops and recreates
-- everything below so you can iterate while you're setting this up.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Clean slate (only affects the objects this schema creates)
-- ---------------------------------------------------------------------------
drop view if exists public.recipe_stats;
drop table if exists public.favorites;
drop table if exists public.ratings;
drop table if exists public.recipe_steps;
drop table if exists public.recipe_ingredients;
drop table if exists public.recipe_dietary_tags;
drop table if exists public.recipe_categories;
drop table if exists public.recipes;
drop table if exists public.ingredients;
drop table if exists public.dietary_tags;
drop table if exists public.categories;
drop table if exists public.profiles;
drop function if exists public.handle_new_user cascade;
drop function if exists public.set_updated_at cascade;

-- ---------------------------------------------------------------------------
-- profiles — one row per auth.users row, created automatically on sign-up
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text unique not null,
  display_name text,
  bio text,
  created_at timestamptz not null default now()
);

comment on table public.profiles is 'Public profile data for each signed-up baker.';

-- ---------------------------------------------------------------------------
-- categories & dietary_tags — small reference tables, seeded once
-- ---------------------------------------------------------------------------
create table public.categories (
  id serial primary key,
  name text unique not null,
  slug text unique not null
);

create table public.dietary_tags (
  id serial primary key,
  name text unique not null,
  slug text unique not null
);

-- ---------------------------------------------------------------------------
-- ingredients — a master ingredient list, grown organically as recipes are
-- added ("flour", "unsalted butter", ...) so the same ingredient reuses one row
-- ---------------------------------------------------------------------------
create table public.ingredients (
  id serial primary key,
  name text unique not null
);

-- ---------------------------------------------------------------------------
-- recipes
-- ---------------------------------------------------------------------------
create table public.recipes (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text not null,
  image_url text,
  prep_minutes int not null check (prep_minutes >= 0),
  cook_minutes int not null check (cook_minutes >= 0),
  servings int not null check (servings > 0),
  difficulty text not null check (difficulty in ('easy', 'medium', 'hard')),
  -- null author_id = one of the seeded "Sift Kitchen" recipes
  author_id uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index recipes_author_id_idx on public.recipes (author_id);
create index recipes_created_at_idx on public.recipes (created_at desc);

-- ---------------------------------------------------------------------------
-- join tables
-- ---------------------------------------------------------------------------
create table public.recipe_categories (
  recipe_id uuid not null references public.recipes (id) on delete cascade,
  category_id int not null references public.categories (id) on delete cascade,
  primary key (recipe_id, category_id)
);

create table public.recipe_dietary_tags (
  recipe_id uuid not null references public.recipes (id) on delete cascade,
  tag_id int not null references public.dietary_tags (id) on delete cascade,
  primary key (recipe_id, tag_id)
);

create table public.recipe_ingredients (
  id serial primary key,
  recipe_id uuid not null references public.recipes (id) on delete cascade,
  ingredient_id int not null references public.ingredients (id) on delete restrict,
  quantity text not null, -- free text on purpose: "1 1/2", "a pinch", "2-3"
  unit text,              -- "cups", "g", "tsp"... nullable ("2 eggs")
  notes text,             -- "melted", "room temperature"
  sort_order int not null default 0
);

create index recipe_ingredients_recipe_id_idx on public.recipe_ingredients (recipe_id);

create table public.recipe_steps (
  id serial primary key,
  recipe_id uuid not null references public.recipes (id) on delete cascade,
  step_number int not null,
  instruction text not null,
  unique (recipe_id, step_number)
);

create index recipe_steps_recipe_id_idx on public.recipe_steps (recipe_id);

-- ---------------------------------------------------------------------------
-- ratings — one rating+review per (recipe, user)
-- ---------------------------------------------------------------------------
create table public.ratings (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references public.recipes (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  review text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (recipe_id, user_id)
);

create index ratings_recipe_id_idx on public.ratings (recipe_id);

-- ---------------------------------------------------------------------------
-- favorites — a user's saved recipes
-- ---------------------------------------------------------------------------
create table public.favorites (
  user_id uuid not null references public.profiles (id) on delete cascade,
  recipe_id uuid not null references public.recipes (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, recipe_id)
);

-- ---------------------------------------------------------------------------
-- recipe_stats — average rating & rating count per recipe
-- security_invoker means the view respects the RLS policies of whoever
-- queries it; safe here since ratings are publicly readable below.
-- ---------------------------------------------------------------------------
create view public.recipe_stats
with (security_invoker = true) as
select
  r.id as recipe_id,
  coalesce(round(avg(rt.rating)::numeric, 1), 0) as avg_rating,
  count(rt.id) as rating_count
from public.recipes r
left join public.ratings rt on rt.recipe_id = r.id
group by r.id;

-- ---------------------------------------------------------------------------
-- keep updated_at fresh
-- ---------------------------------------------------------------------------
create function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger recipes_set_updated_at
  before update on public.recipes
  for each row execute function public.set_updated_at();

create trigger ratings_set_updated_at
  before update on public.ratings
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- auto-create a profile row whenever someone signs up via Supabase Auth
-- ---------------------------------------------------------------------------
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'username', split_part(new.email, '@', 1) || '_' || substr(new.id::text, 1, 4)),
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================================
-- Row Level Security
-- ============================================================================
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.dietary_tags enable row level security;
alter table public.ingredients enable row level security;
alter table public.recipes enable row level security;
alter table public.recipe_categories enable row level security;
alter table public.recipe_dietary_tags enable row level security;
alter table public.recipe_ingredients enable row level security;
alter table public.recipe_steps enable row level security;
alter table public.ratings enable row level security;
alter table public.favorites enable row level security;

-- profiles: readable by everyone, editable only by the owner
create policy "profiles are publicly readable"
  on public.profiles for select using (true);

create policy "users can update their own profile"
  on public.profiles for update using (auth.uid() = id);

-- categories / dietary_tags: public read; signed-in users may add new tags
-- (e.g. a brand-new ingredient name) but not edit/remove existing ones
create policy "categories are publicly readable"
  on public.categories for select using (true);

create policy "dietary tags are publicly readable"
  on public.dietary_tags for select using (true);

-- ingredients: public read; signed-in users can add new ingredients
create policy "ingredients are publicly readable"
  on public.ingredients for select using (true);

create policy "authenticated users can add ingredients"
  on public.ingredients for insert to authenticated with check (true);

-- recipes: public read; authenticated users manage their own
create policy "recipes are publicly readable"
  on public.recipes for select using (true);

create policy "authenticated users can create recipes"
  on public.recipes for insert to authenticated
  with check (auth.uid() = author_id);

create policy "authors can update their own recipes"
  on public.recipes for update using (auth.uid() = author_id);

create policy "authors can delete their own recipes"
  on public.recipes for delete using (auth.uid() = author_id);

-- recipe_categories / recipe_dietary_tags / recipe_ingredients / recipe_steps:
-- public read; write only if the caller owns the parent recipe
create policy "recipe categories are publicly readable"
  on public.recipe_categories for select using (true);

create policy "authors manage their recipe's categories"
  on public.recipe_categories for all using (
    exists (select 1 from public.recipes r where r.id = recipe_id and r.author_id = auth.uid())
  ) with check (
    exists (select 1 from public.recipes r where r.id = recipe_id and r.author_id = auth.uid())
  );

create policy "recipe dietary tags are publicly readable"
  on public.recipe_dietary_tags for select using (true);

create policy "authors manage their recipe's dietary tags"
  on public.recipe_dietary_tags for all using (
    exists (select 1 from public.recipes r where r.id = recipe_id and r.author_id = auth.uid())
  ) with check (
    exists (select 1 from public.recipes r where r.id = recipe_id and r.author_id = auth.uid())
  );

create policy "recipe ingredients are publicly readable"
  on public.recipe_ingredients for select using (true);

create policy "authors manage their recipe's ingredients"
  on public.recipe_ingredients for all using (
    exists (select 1 from public.recipes r where r.id = recipe_id and r.author_id = auth.uid())
  ) with check (
    exists (select 1 from public.recipes r where r.id = recipe_id and r.author_id = auth.uid())
  );

create policy "recipe steps are publicly readable"
  on public.recipe_steps for select using (true);

create policy "authors manage their recipe's steps"
  on public.recipe_steps for all using (
    exists (select 1 from public.recipes r where r.id = recipe_id and r.author_id = auth.uid())
  ) with check (
    exists (select 1 from public.recipes r where r.id = recipe_id and r.author_id = auth.uid())
  );

-- ratings: public read; a user manages only their own rating
create policy "ratings are publicly readable"
  on public.ratings for select using (true);

create policy "authenticated users can rate recipes"
  on public.ratings for insert to authenticated with check (auth.uid() = user_id);

create policy "users can update their own rating"
  on public.ratings for update using (auth.uid() = user_id);

create policy "users can delete their own rating"
  on public.ratings for delete using (auth.uid() = user_id);

-- favorites: private to the owner
create policy "users can view their own favorites"
  on public.favorites for select using (auth.uid() = user_id);

create policy "users can favorite recipes"
  on public.favorites for insert to authenticated with check (auth.uid() = user_id);

create policy "users can unfavorite recipes"
  on public.favorites for delete using (auth.uid() = user_id);
