# Sift — A Community Baking Cookbook

A recipe website built with **Next.js 16** (App Router), **shadcn/ui** components,
and **Supabase** (Postgres + Auth) for the "build and deploy a Vercel site"
assignment. Visitors can browse and search 20 seeded baking recipes; signed-up
users can save favorites, leave star ratings and reviews, and submit their own
recipes.

## What's here

- `src/app` — Next.js App Router pages (home, recipe browsing/search, recipe
  detail, login/signup, submit-a-recipe, account)
- `src/components` — UI, including hand-added `shadcn/ui` primitives in
  `src/components/ui` (see [Note on shadcn/ui](#note-on-shadcnui) below)
- `src/lib` — Supabase clients, data-fetching helpers, and Server Actions
- `supabase/schema.sql` — the full database schema, relationships, and Row
  Level Security policies
- `supabase/seed.sql` — 20 seed recipes with ingredients, steps, categories,
  and dietary tags
- `scripts/gen-placeholder-images.py` — generates the on-brand SVG recipe
  images in `public/recipes/` (already run; re-run only if you add recipes)

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com), sign in, and create a new
   project (any region/plan works, including the free tier).
2. Once it's ready, open **SQL Editor** in the left sidebar → **New query**.
3. Paste in the contents of `supabase/schema.sql` and run it. This creates all
   tables, the `recipe_stats` view, the auto-profile-on-signup trigger, and
   every Row Level Security policy.
4. Open a second new query, paste in `supabase/seed.sql`, and run it. This
   loads the 20 seed recipes (categories, dietary tags, ingredients, steps).
5. Go to **Project Settings → API**. You'll need two values from this page in
   the next step: the **Project URL** and the **`anon` `public`** API key.
6. (Recommended) Under **Authentication → Sign In / Providers → Email**, you
   can turn **Confirm email** off while testing locally so new accounts can
   sign in immediately — leave it on for a real deployment.

## 2. Configure environment variables

Copy the example file and fill in the two values from step 1.5:

```bash
cp .env.local.example .env.local
```

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```

## 3. Run it locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You should see the 20
seeded recipes on the home page and at `/recipes`. Sign up for an account to
try favoriting, rating, and submitting a recipe.

## 4. Push to GitHub

```bash
git init                     # if this folder isn't already a git repo
git add .
git commit -m "Initial commit"
gh repo create sift --source=. --public --push
# or create a repo on github.com and:
# git remote add origin https://github.com/<you>/sift.git
# git branch -M main
# git push -u origin main
```

`.env.local` is already gitignored, so your Supabase keys won't be committed.

## 5. Deploy on Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and sign in (connect your
   GitHub account if you haven't already).
2. Import the GitHub repo you just pushed.
3. In **Environment Variables**, add the same two variables from your
   `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click **Deploy**. Vercel auto-detects Next.js — no build settings to
   change.
5. Once deployed, open your `*.vercel.app` URL and confirm recipes load. If
   they don't, double check the environment variables are set for the
   **Production** environment (not just Preview/Development) and redeploy.

That deployed URL is what you submit for the assignment.

## Database design

- `profiles` — one row per signed-up user, created automatically by a trigger
  on `auth.users` insert (`handle_new_user`)
- `recipes` — core recipe data; `author_id` is `null` for the 20 seeded
  recipes and set to the submitter's profile for user-submitted ones
- `categories` / `dietary_tags` — small reference tables
- `recipe_categories` / `recipe_dietary_tags` — many-to-many join tables
- `ingredients` — a master ingredient list, reused across recipes
- `recipe_ingredients` — join table with per-recipe quantity/unit/notes
- `recipe_steps` — ordered instructions per recipe
- `ratings` — one rating + optional review per (recipe, user)
- `favorites` — a user's saved recipes
- `recipe_stats` — a view computing average rating and rating count per recipe

Every table has Row Level Security enabled: everything is publicly readable,
but writes are restricted to the signed-in owner (e.g. you can only edit your
own recipes, rate with your own account, and see your own favorites list).
See the comments in `supabase/schema.sql` for the exact policies.

## Note on shadcn/ui

This sandbox couldn't reach `ui.shadcn.com` to run the official `shadcn` CLI
(its registry endpoint was unreachable from this network), so the components
in `src/components/ui` were added by hand using the same standard shadcn
source and conventions — Tailwind v4, CSS variables for theming, Radix UI
primitives underneath. Functionally this is identical to what the CLI would
have generated. If you have CLI access locally and want to add more
components (e.g. `npx shadcn@latest add accordion`), it will work fine
alongside what's already here — just don't overwrite `components.json`'s
conventions (the `@/lib/utils` cn helper and the `--color-*` CSS variables in
`globals.css`).

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router, Server Actions, Turbopack)
- [shadcn/ui](https://ui.shadcn.com) + [Radix UI](https://www.radix-ui.com) + [Tailwind CSS v4](https://tailwindcss.com)
- [Supabase](https://supabase.com) (Postgres, Auth, Row Level Security)
- Fonts: [Inter](https://fonts.google.com/specimen/Inter) (body) and
  [Fraunces](https://fonts.google.com/specimen/Fraunces) (headings)
