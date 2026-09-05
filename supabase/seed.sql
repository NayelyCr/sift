-- ============================================================================
-- Sift — seed data (20 baking recipes)
-- Run this AFTER schema.sql, in the Supabase SQL Editor.
-- Safe to re-run: reference data uses ON CONFLICT DO NOTHING, and the
-- recipe-level inserts use fixed UUIDs with ON CONFLICT DO NOTHING too.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- categories
-- ---------------------------------------------------------------------------
insert into public.categories (name, slug) values
  ('Cookies', 'cookies'),
  ('Cakes & Cupcakes', 'cakes-cupcakes'),
  ('Bread & Rolls', 'bread-rolls'),
  ('Pies & Tarts', 'pies-tarts'),
  ('Brownies & Bars', 'brownies-bars'),
  ('Breakfast Bakes', 'breakfast-bakes'),
  ('Pastries', 'pastries'),
  ('No-Bake', 'no-bake')
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- dietary tags
-- ---------------------------------------------------------------------------
insert into public.dietary_tags (name, slug) values
  ('Vegetarian', 'vegetarian'),
  ('Vegan', 'vegan'),
  ('Gluten-Free', 'gluten-free'),
  ('Dairy-Free', 'dairy-free'),
  ('Egg-Free', 'egg-free')
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- ingredients (master list, reused across recipes)
-- ---------------------------------------------------------------------------
insert into public.ingredients (name) values
  ('All-purpose flour'), ('Bread flour'), ('Whole wheat flour'),
  ('Granulated sugar'), ('Brown sugar'), ('Powdered sugar'),
  ('Unsalted butter'), ('Vegetable oil'), ('Coconut oil'),
  ('Large eggs'), ('Egg yolks'), ('Egg whites'),
  ('Vanilla extract'), ('Vanilla bean paste'),
  ('Baking soda'), ('Baking powder'), ('Salt'), ('Fine sea salt'),
  ('Ground cinnamon'), ('Ground nutmeg'), ('Ground cloves'), ('Ground ginger'),
  ('Buttermilk'), ('Whole milk'), ('Heavy cream'), ('Sour cream'),
  ('Cream cheese'), ('Mascarpone cheese'),
  ('Semisweet chocolate chips'), ('Bittersweet chocolate'), ('Dark chocolate'),
  ('Cocoa powder'), ('Rolled oats'), ('Raisins'),
  ('Creamy peanut butter'), ('Ripe bananas'), ('Zucchini'), ('Carrots'),
  ('Walnuts'), ('Pecans'), ('Crushed pineapple'),
  ('Lemon juice'), ('Lemon zest'), ('Apples'), ('Cornstarch'),
  ('Active dry yeast'), ('Instant yeast'), ('Warm water'),
  ('Mini marshmallows'), ('Crisp rice cereal'),
  ('Fresh blueberries'), ('Graham crackers'), ('Melted butter'),
  ('Red food coloring'), ('White vinegar'), ('Cider vinegar'),
  ('Espresso powder'), ('Flax seed meal'), ('Almond milk'),
  ('Cold water')
on conflict (name) do nothing;

-- ---------------------------------------------------------------------------
-- recipes (fixed UUIDs so later inserts can reference them directly)
-- ---------------------------------------------------------------------------
insert into public.recipes
  (id, slug, title, description, image_url, prep_minutes, cook_minutes, servings, difficulty)
values
  ('00000000-0000-0000-0000-000000000001', 'classic-chocolate-chip-cookies', 'Classic Chocolate Chip Cookies',
    'Crisp edges, chewy centers, and pools of melted chocolate — the cookie every other cookie is judged against.',
    '/recipes/classic-chocolate-chip-cookies.jpg', 20, 12, 24, 'easy'),

  ('00000000-0000-0000-0000-000000000002', 'fudgy-brownies', 'Fudgy Brownies',
    'Dense, glossy-topped brownies with a deep chocolate flavor. No mixer required.',
    '/recipes/fudgy-brownies.jpg', 15, 30, 16, 'easy'),

  ('00000000-0000-0000-0000-000000000003', 'vanilla-bean-cupcakes', 'Vanilla Bean Cupcakes',
    'Light, tender cupcakes flecked with real vanilla bean, topped with a simple buttercream.',
    '/recipes/vanilla-bean-cupcakes.jpg', 25, 20, 12, 'medium'),

  ('00000000-0000-0000-0000-000000000004', 'cinnamon-banana-bread', 'Cinnamon Sugar Banana Bread',
    'A moist, one-bowl banana bread with a crackly cinnamon-sugar crust. The best use for spotty bananas.',
    '/recipes/cinnamon-banana-bread.jpg', 15, 60, 10, 'easy'),

  ('00000000-0000-0000-0000-000000000005', 'no-knead-artisan-bread', 'No-Knead Artisan Bread',
    'A crackly-crusted, open-crumb loaf that needs almost no hands-on effort — just time. Start it the night before.',
    '/recipes/no-knead-artisan-bread.jpg', 20, 45, 8, 'easy'),

  ('00000000-0000-0000-0000-000000000006', 'flaky-buttermilk-biscuits', 'Flaky Buttermilk Biscuits',
    'Tall, buttery layers that pull apart in sheets. Best eaten warm with a little more butter.',
    '/recipes/flaky-buttermilk-biscuits.jpg', 20, 15, 8, 'medium'),

  ('00000000-0000-0000-0000-000000000007', 'classic-apple-pie', 'Classic Apple Pie',
    'A double-crust pie packed with cinnamon-spiced apples under a golden, flaky crust.',
    '/recipes/classic-apple-pie.jpg', 45, 55, 8, 'hard'),

  ('00000000-0000-0000-0000-000000000008', 'lemon-tart', 'Lemon Tart',
    'A buttery shortcrust shell filled with bright, silky lemon curd. Sharp, sweet, and simple.',
    '/recipes/lemon-tart.jpg', 30, 35, 8, 'medium'),

  ('00000000-0000-0000-0000-000000000009', 'oatmeal-raisin-cookies', 'Oatmeal Raisin Cookies',
    'Chewy, spiced, and studded with plump raisins — a lunchbox classic.',
    '/recipes/oatmeal-raisin-cookies.jpg', 15, 12, 24, 'easy'),

  ('00000000-0000-0000-0000-000000000010', 'red-velvet-cupcakes', 'Red Velvet Cupcakes',
    'Cocoa-tinted cupcakes with a hint of tang, finished with cream cheese frosting.',
    '/recipes/red-velvet-cupcakes.jpg', 25, 20, 12, 'medium'),

  ('00000000-0000-0000-0000-000000000011', 'cinnamon-rolls', 'Cinnamon Rolls',
    'Soft, pillowy rolls swirled with cinnamon-brown sugar filling and finished with cream cheese icing.',
    '/recipes/cinnamon-rolls.jpg', 30, 25, 12, 'hard'),

  ('00000000-0000-0000-0000-000000000012', 'blueberry-muffins', 'Blueberry Muffins',
    'Bakery-style muffins with domed, sugar-crusted tops and bursts of fresh blueberry in every bite.',
    '/recipes/blueberry-muffins.jpg', 15, 22, 12, 'easy'),

  ('00000000-0000-0000-0000-000000000013', 'peanut-butter-cookies', 'Peanut Butter Cookies',
    'Just a handful of ingredients — no flour needed — for a rich, fork-marked peanut butter cookie.',
    '/recipes/peanut-butter-cookies.jpg', 15, 10, 24, 'easy'),

  ('00000000-0000-0000-0000-000000000014', 'classic-carrot-cake', 'Classic Carrot Cake',
    'A spiced, ultra-moist carrot cake with walnuts and pineapple, topped with cream cheese frosting.',
    '/recipes/classic-carrot-cake.jpg', 30, 35, 12, 'medium'),

  ('00000000-0000-0000-0000-000000000015', 'flourless-chocolate-cake', 'Flourless Chocolate Cake',
    'A dense, brownie-like cake made from just chocolate, butter, eggs, and sugar. Naturally gluten-free.',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Chocolate_fudge_cake.jpg/500px-Chocolate_fudge_cake.jpg', 20, 35, 10, 'medium'),

  ('00000000-0000-0000-0000-000000000016', 'vegan-chocolate-chip-cookies', 'Vegan Chocolate Chip Cookies',
    'Crisp-edged, chewy-centered chocolate chip cookies made with no butter, dairy, or eggs.',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Vegan_oatmeal_chocolate_chip_cookies%2C_April_2009.jpg/500px-Vegan_oatmeal_chocolate_chip_cookies%2C_April_2009.jpg', 15, 12, 20, 'easy'),

  ('00000000-0000-0000-0000-000000000017', 'no-bake-cheesecake', 'No-Bake Cheesecake',
    'A creamy, tangy cheesecake set in the fridge instead of the oven, on a graham cracker crust.',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Japanese_no-bake_cheesecake.jpg/500px-Japanese_no-bake_cheesecake.jpg', 25, 0, 10, 'easy'),

  ('00000000-0000-0000-0000-000000000018', 'rice-krispie-treats', 'Rice Krispie Treats',
    'Gooey, marshmallowy, ready in fifteen minutes flat. A stovetop classic.',
    '/recipes/rice-krispie-treats.jpg', 10, 5, 16, 'easy'),

  ('00000000-0000-0000-0000-000000000019', 'homemade-croissants', 'Homemade Croissants',
    'Laminated, buttery, and flaky in a hundred layers. A weekend project worth every fold.',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Croissant.jpg/500px-Croissant.jpg', 60, 20, 8, 'hard'),

  ('00000000-0000-0000-0000-000000000020', 'zucchini-bread', 'Zucchini Bread',
    'A moist, cinnamon-spiced quick bread that sneaks in a whole cup of grated zucchini.',
    '/recipes/zucchini-bread.jpg', 15, 55, 10, 'easy')
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- recipe_categories
-- ---------------------------------------------------------------------------
insert into public.recipe_categories (recipe_id, category_id)
select v.recipe_id, c.id
from (values
  ('00000000-0000-0000-0000-000000000001'::uuid, 'cookies'),
  ('00000000-0000-0000-0000-000000000002'::uuid, 'brownies-bars'),
  ('00000000-0000-0000-0000-000000000003'::uuid, 'cakes-cupcakes'),
  ('00000000-0000-0000-0000-000000000004'::uuid, 'bread-rolls'),
  ('00000000-0000-0000-0000-000000000004'::uuid, 'breakfast-bakes'),
  ('00000000-0000-0000-0000-000000000005'::uuid, 'bread-rolls'),
  ('00000000-0000-0000-0000-000000000006'::uuid, 'bread-rolls'),
  ('00000000-0000-0000-0000-000000000006'::uuid, 'breakfast-bakes'),
  ('00000000-0000-0000-0000-000000000007'::uuid, 'pies-tarts'),
  ('00000000-0000-0000-0000-000000000008'::uuid, 'pies-tarts'),
  ('00000000-0000-0000-0000-000000000009'::uuid, 'cookies'),
  ('00000000-0000-0000-0000-000000000010'::uuid, 'cakes-cupcakes'),
  ('00000000-0000-0000-0000-000000000011'::uuid, 'pastries'),
  ('00000000-0000-0000-0000-000000000011'::uuid, 'breakfast-bakes'),
  ('00000000-0000-0000-0000-000000000012'::uuid, 'breakfast-bakes'),
  ('00000000-0000-0000-0000-000000000013'::uuid, 'cookies'),
  ('00000000-0000-0000-0000-000000000014'::uuid, 'cakes-cupcakes'),
  ('00000000-0000-0000-0000-000000000015'::uuid, 'cakes-cupcakes'),
  ('00000000-0000-0000-0000-000000000016'::uuid, 'cookies'),
  ('00000000-0000-0000-0000-000000000017'::uuid, 'no-bake'),
  ('00000000-0000-0000-0000-000000000018'::uuid, 'no-bake'),
  ('00000000-0000-0000-0000-000000000019'::uuid, 'pastries'),
  ('00000000-0000-0000-0000-000000000019'::uuid, 'breakfast-bakes'),
  ('00000000-0000-0000-0000-000000000020'::uuid, 'bread-rolls')
) as v(recipe_id, slug)
join public.categories c on c.slug = v.slug
on conflict do nothing;

-- ---------------------------------------------------------------------------
-- recipe_dietary_tags
-- ---------------------------------------------------------------------------
insert into public.recipe_dietary_tags (recipe_id, tag_id)
select v.recipe_id, t.id
from (values
  ('00000000-0000-0000-0000-000000000001'::uuid, 'vegetarian'),
  ('00000000-0000-0000-0000-000000000002'::uuid, 'vegetarian'),
  ('00000000-0000-0000-0000-000000000003'::uuid, 'vegetarian'),
  ('00000000-0000-0000-0000-000000000004'::uuid, 'vegetarian'),
  ('00000000-0000-0000-0000-000000000005'::uuid, 'vegan'),
  ('00000000-0000-0000-0000-000000000005'::uuid, 'dairy-free'),
  ('00000000-0000-0000-0000-000000000005'::uuid, 'egg-free'),
  ('00000000-0000-0000-0000-000000000006'::uuid, 'vegetarian'),
  ('00000000-0000-0000-0000-000000000007'::uuid, 'vegetarian'),
  ('00000000-0000-0000-0000-000000000008'::uuid, 'vegetarian'),
  ('00000000-0000-0000-0000-000000000009'::uuid, 'vegetarian'),
  ('00000000-0000-0000-0000-000000000010'::uuid, 'vegetarian'),
  ('00000000-0000-0000-0000-000000000011'::uuid, 'vegetarian'),
  ('00000000-0000-0000-0000-000000000012'::uuid, 'vegetarian'),
  ('00000000-0000-0000-0000-000000000013'::uuid, 'vegetarian'),
  ('00000000-0000-0000-0000-000000000013'::uuid, 'gluten-free'),
  ('00000000-0000-0000-0000-000000000014'::uuid, 'vegetarian'),
  ('00000000-0000-0000-0000-000000000015'::uuid, 'vegetarian'),
  ('00000000-0000-0000-0000-000000000015'::uuid, 'gluten-free'),
  ('00000000-0000-0000-0000-000000000016'::uuid, 'vegan'),
  ('00000000-0000-0000-0000-000000000016'::uuid, 'dairy-free'),
  ('00000000-0000-0000-0000-000000000016'::uuid, 'egg-free'),
  ('00000000-0000-0000-0000-000000000017'::uuid, 'vegetarian'),
  ('00000000-0000-0000-0000-000000000019'::uuid, 'vegetarian'),
  ('00000000-0000-0000-0000-000000000020'::uuid, 'vegetarian')
) as v(recipe_id, slug)
join public.dietary_tags t on t.slug = v.slug
on conflict do nothing;

-- ---------------------------------------------------------------------------
-- recipe_ingredients
-- ---------------------------------------------------------------------------
insert into public.recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes, sort_order)
select v.recipe_id, i.id, v.quantity, v.unit, v.notes, v.sort_order
from (values
  -- Classic Chocolate Chip Cookies
  ('00000000-0000-0000-0000-000000000001'::uuid, 'All-purpose flour', '2 1/4', 'cups', null::text, 1),
  ('00000000-0000-0000-0000-000000000001'::uuid, 'Baking soda', '1', 'tsp', null, 2),
  ('00000000-0000-0000-0000-000000000001'::uuid, 'Salt', '1', 'tsp', null, 3),
  ('00000000-0000-0000-0000-000000000001'::uuid, 'Unsalted butter', '1', 'cup', 'softened', 4),
  ('00000000-0000-0000-0000-000000000001'::uuid, 'Brown sugar', '3/4', 'cup', 'packed', 5),
  ('00000000-0000-0000-0000-000000000001'::uuid, 'Granulated sugar', '3/4', 'cup', null, 6),
  ('00000000-0000-0000-0000-000000000001'::uuid, 'Large eggs', '2', null, null, 7),
  ('00000000-0000-0000-0000-000000000001'::uuid, 'Vanilla extract', '1', 'tsp', null, 8),
  ('00000000-0000-0000-0000-000000000001'::uuid, 'Semisweet chocolate chips', '2', 'cups', null, 9),

  -- Fudgy Brownies
  ('00000000-0000-0000-0000-000000000002'::uuid, 'Unsalted butter', '1/2', 'cup', 'melted', 1),
  ('00000000-0000-0000-0000-000000000002'::uuid, 'Granulated sugar', '1', 'cup', null, 2),
  ('00000000-0000-0000-0000-000000000002'::uuid, 'Large eggs', '2', null, null, 3),
  ('00000000-0000-0000-0000-000000000002'::uuid, 'Vanilla extract', '1', 'tsp', null, 4),
  ('00000000-0000-0000-0000-000000000002'::uuid, 'Cocoa powder', '1/3', 'cup', null, 5),
  ('00000000-0000-0000-0000-000000000002'::uuid, 'All-purpose flour', '1/2', 'cup', null, 6),
  ('00000000-0000-0000-0000-000000000002'::uuid, 'Salt', '1/4', 'tsp', null, 7),
  ('00000000-0000-0000-0000-000000000002'::uuid, 'Bittersweet chocolate', '1/2', 'cup', 'chopped', 8),

  -- Vanilla Bean Cupcakes
  ('00000000-0000-0000-0000-000000000003'::uuid, 'All-purpose flour', '1 1/2', 'cups', null, 1),
  ('00000000-0000-0000-0000-000000000003'::uuid, 'Baking powder', '1 1/2', 'tsp', null, 2),
  ('00000000-0000-0000-0000-000000000003'::uuid, 'Salt', '1/4', 'tsp', null, 3),
  ('00000000-0000-0000-0000-000000000003'::uuid, 'Unsalted butter', '1/2', 'cup', 'softened', 4),
  ('00000000-0000-0000-0000-000000000003'::uuid, 'Granulated sugar', '1', 'cup', null, 5),
  ('00000000-0000-0000-0000-000000000003'::uuid, 'Large eggs', '2', null, null, 6),
  ('00000000-0000-0000-0000-000000000003'::uuid, 'Vanilla bean paste', '1', 'tbsp', null, 7),
  ('00000000-0000-0000-0000-000000000003'::uuid, 'Whole milk', '1/2', 'cup', null, 8),
  ('00000000-0000-0000-0000-000000000003'::uuid, 'Powdered sugar', '2', 'cups', 'for frosting', 9),

  -- Cinnamon Sugar Banana Bread
  ('00000000-0000-0000-0000-000000000004'::uuid, 'Ripe bananas', '3', null, 'mashed', 1),
  ('00000000-0000-0000-0000-000000000004'::uuid, 'Unsalted butter', '1/3', 'cup', 'melted', 2),
  ('00000000-0000-0000-0000-000000000004'::uuid, 'Brown sugar', '3/4', 'cup', null, 3),
  ('00000000-0000-0000-0000-000000000004'::uuid, 'Large eggs', '1', null, null, 4),
  ('00000000-0000-0000-0000-000000000004'::uuid, 'Vanilla extract', '1', 'tsp', null, 5),
  ('00000000-0000-0000-0000-000000000004'::uuid, 'Baking soda', '1', 'tsp', null, 6),
  ('00000000-0000-0000-0000-000000000004'::uuid, 'Salt', '1/4', 'tsp', null, 7),
  ('00000000-0000-0000-0000-000000000004'::uuid, 'All-purpose flour', '1 1/2', 'cups', null, 8),
  ('00000000-0000-0000-0000-000000000004'::uuid, 'Ground cinnamon', '2', 'tsp', 'divided', 9),
  ('00000000-0000-0000-0000-000000000004'::uuid, 'Granulated sugar', '2', 'tbsp', 'for topping', 10),

  -- No-Knead Artisan Bread
  ('00000000-0000-0000-0000-000000000005'::uuid, 'Bread flour', '3', 'cups', null, 1),
  ('00000000-0000-0000-0000-000000000005'::uuid, 'Instant yeast', '1/4', 'tsp', null, 2),
  ('00000000-0000-0000-0000-000000000005'::uuid, 'Fine sea salt', '1 1/2', 'tsp', null, 3),
  ('00000000-0000-0000-0000-000000000005'::uuid, 'Cold water', '1 1/2', 'cups', null, 4),

  -- Flaky Buttermilk Biscuits
  ('00000000-0000-0000-0000-000000000006'::uuid, 'All-purpose flour', '2', 'cups', null, 1),
  ('00000000-0000-0000-0000-000000000006'::uuid, 'Baking powder', '1', 'tbsp', null, 2),
  ('00000000-0000-0000-0000-000000000006'::uuid, 'Baking soda', '1/4', 'tsp', null, 3),
  ('00000000-0000-0000-0000-000000000006'::uuid, 'Salt', '3/4', 'tsp', null, 4),
  ('00000000-0000-0000-0000-000000000006'::uuid, 'Unsalted butter', '1/2', 'cup', 'cold, cubed', 5),
  ('00000000-0000-0000-0000-000000000006'::uuid, 'Buttermilk', '3/4', 'cup', 'cold', 6),

  -- Classic Apple Pie
  ('00000000-0000-0000-0000-000000000007'::uuid, 'All-purpose flour', '2 1/2', 'cups', 'for the crust', 1),
  ('00000000-0000-0000-0000-000000000007'::uuid, 'Unsalted butter', '1', 'cup', 'cold, cubed', 2),
  ('00000000-0000-0000-0000-000000000007'::uuid, 'Cold water', '1/2', 'cup', null, 3),
  ('00000000-0000-0000-0000-000000000007'::uuid, 'Apples', '6', null, 'peeled and sliced', 4),
  ('00000000-0000-0000-0000-000000000007'::uuid, 'Granulated sugar', '3/4', 'cup', null, 5),
  ('00000000-0000-0000-0000-000000000007'::uuid, 'Ground cinnamon', '1', 'tsp', null, 6),
  ('00000000-0000-0000-0000-000000000007'::uuid, 'Cornstarch', '2', 'tbsp', null, 7),
  ('00000000-0000-0000-0000-000000000007'::uuid, 'Lemon juice', '1', 'tbsp', null, 8),

  -- Lemon Tart
  ('00000000-0000-0000-0000-000000000008'::uuid, 'All-purpose flour', '1 1/4', 'cups', 'for the crust', 1),
  ('00000000-0000-0000-0000-000000000008'::uuid, 'Unsalted butter', '1/2', 'cup', 'cold, cubed', 2),
  ('00000000-0000-0000-0000-000000000008'::uuid, 'Powdered sugar', '1/4', 'cup', null, 3),
  ('00000000-0000-0000-0000-000000000008'::uuid, 'Large eggs', '4', null, null, 4),
  ('00000000-0000-0000-0000-000000000008'::uuid, 'Granulated sugar', '1', 'cup', null, 5),
  ('00000000-0000-0000-0000-000000000008'::uuid, 'Lemon juice', '2/3', 'cup', 'fresh', 6),
  ('00000000-0000-0000-0000-000000000008'::uuid, 'Lemon zest', '1', 'tbsp', null, 7),
  ('00000000-0000-0000-0000-000000000008'::uuid, 'Unsalted butter', '1/2', 'cup', 'for curd', 8),

  -- Oatmeal Raisin Cookies
  ('00000000-0000-0000-0000-000000000009'::uuid, 'All-purpose flour', '1 1/2', 'cups', null, 1),
  ('00000000-0000-0000-0000-000000000009'::uuid, 'Baking soda', '1', 'tsp', null, 2),
  ('00000000-0000-0000-0000-000000000009'::uuid, 'Ground cinnamon', '1', 'tsp', null, 3),
  ('00000000-0000-0000-0000-000000000009'::uuid, 'Unsalted butter', '3/4', 'cup', 'softened', 4),
  ('00000000-0000-0000-0000-000000000009'::uuid, 'Brown sugar', '1', 'cup', 'packed', 5),
  ('00000000-0000-0000-0000-000000000009'::uuid, 'Large eggs', '2', null, null, 6),
  ('00000000-0000-0000-0000-000000000009'::uuid, 'Rolled oats', '3', 'cups', null, 7),
  ('00000000-0000-0000-0000-000000000009'::uuid, 'Raisins', '1', 'cup', null, 8),

  -- Red Velvet Cupcakes
  ('00000000-0000-0000-0000-000000000010'::uuid, 'All-purpose flour', '1 1/4', 'cups', null, 1),
  ('00000000-0000-0000-0000-000000000010'::uuid, 'Cocoa powder', '1', 'tbsp', null, 2),
  ('00000000-0000-0000-0000-000000000010'::uuid, 'Baking soda', '1/2', 'tsp', null, 3),
  ('00000000-0000-0000-0000-000000000010'::uuid, 'Unsalted butter', '1/2', 'cup', 'softened', 4),
  ('00000000-0000-0000-0000-000000000010'::uuid, 'Granulated sugar', '1', 'cup', null, 5),
  ('00000000-0000-0000-0000-000000000010'::uuid, 'Large eggs', '2', null, null, 6),
  ('00000000-0000-0000-0000-000000000010'::uuid, 'Buttermilk', '1/2', 'cup', null, 7),
  ('00000000-0000-0000-0000-000000000010'::uuid, 'Red food coloring', '1', 'tbsp', null, 8),
  ('00000000-0000-0000-0000-000000000010'::uuid, 'White vinegar', '1', 'tsp', null, 9),
  ('00000000-0000-0000-0000-000000000010'::uuid, 'Cream cheese', '8', 'oz', 'for frosting', 10),

  -- Cinnamon Rolls
  ('00000000-0000-0000-0000-000000000011'::uuid, 'All-purpose flour', '4', 'cups', null, 1),
  ('00000000-0000-0000-0000-000000000011'::uuid, 'Whole milk', '1', 'cup', 'warm', 2),
  ('00000000-0000-0000-0000-000000000011'::uuid, 'Active dry yeast', '2 1/4', 'tsp', null, 3),
  ('00000000-0000-0000-0000-000000000011'::uuid, 'Granulated sugar', '1/3', 'cup', null, 4),
  ('00000000-0000-0000-0000-000000000011'::uuid, 'Unsalted butter', '1/3', 'cup', 'melted, divided', 5),
  ('00000000-0000-0000-0000-000000000011'::uuid, 'Large eggs', '1', null, null, 6),
  ('00000000-0000-0000-0000-000000000011'::uuid, 'Brown sugar', '1', 'cup', 'for filling', 7),
  ('00000000-0000-0000-0000-000000000011'::uuid, 'Ground cinnamon', '2', 'tbsp', 'for filling', 8),
  ('00000000-0000-0000-0000-000000000011'::uuid, 'Cream cheese', '4', 'oz', 'for icing', 9),

  -- Blueberry Muffins
  ('00000000-0000-0000-0000-000000000012'::uuid, 'All-purpose flour', '2', 'cups', null, 1),
  ('00000000-0000-0000-0000-000000000012'::uuid, 'Baking powder', '2', 'tsp', null, 2),
  ('00000000-0000-0000-0000-000000000012'::uuid, 'Salt', '1/2', 'tsp', null, 3),
  ('00000000-0000-0000-0000-000000000012'::uuid, 'Unsalted butter', '1/2', 'cup', 'softened', 4),
  ('00000000-0000-0000-0000-000000000012'::uuid, 'Granulated sugar', '3/4', 'cup', null, 5),
  ('00000000-0000-0000-0000-000000000012'::uuid, 'Large eggs', '2', null, null, 6),
  ('00000000-0000-0000-0000-000000000012'::uuid, 'Whole milk', '1/2', 'cup', null, 7),
  ('00000000-0000-0000-0000-000000000012'::uuid, 'Fresh blueberries', '1 1/2', 'cups', null, 8),

  -- Peanut Butter Cookies
  ('00000000-0000-0000-0000-000000000013'::uuid, 'Creamy peanut butter', '1', 'cup', null, 1),
  ('00000000-0000-0000-0000-000000000013'::uuid, 'Granulated sugar', '1', 'cup', null, 2),
  ('00000000-0000-0000-0000-000000000013'::uuid, 'Large eggs', '1', null, null, 3),
  ('00000000-0000-0000-0000-000000000013'::uuid, 'Baking soda', '1/2', 'tsp', null, 4),
  ('00000000-0000-0000-0000-000000000013'::uuid, 'Vanilla extract', '1/2', 'tsp', null, 5),

  -- Classic Carrot Cake
  ('00000000-0000-0000-0000-000000000014'::uuid, 'All-purpose flour', '2', 'cups', null, 1),
  ('00000000-0000-0000-0000-000000000014'::uuid, 'Baking soda', '2', 'tsp', null, 2),
  ('00000000-0000-0000-0000-000000000014'::uuid, 'Ground cinnamon', '2', 'tsp', null, 3),
  ('00000000-0000-0000-0000-000000000014'::uuid, 'Vegetable oil', '1', 'cup', null, 4),
  ('00000000-0000-0000-0000-000000000014'::uuid, 'Brown sugar', '1', 'cup', null, 5),
  ('00000000-0000-0000-0000-000000000014'::uuid, 'Large eggs', '4', null, null, 6),
  ('00000000-0000-0000-0000-000000000014'::uuid, 'Carrots', '3', 'cups', 'grated', 7),
  ('00000000-0000-0000-0000-000000000014'::uuid, 'Crushed pineapple', '1/2', 'cup', 'drained', 8),
  ('00000000-0000-0000-0000-000000000014'::uuid, 'Walnuts', '1', 'cup', 'chopped', 9),
  ('00000000-0000-0000-0000-000000000014'::uuid, 'Cream cheese', '8', 'oz', 'for frosting', 10),

  -- Flourless Chocolate Cake
  ('00000000-0000-0000-0000-000000000015'::uuid, 'Bittersweet chocolate', '8', 'oz', 'chopped', 1),
  ('00000000-0000-0000-0000-000000000015'::uuid, 'Unsalted butter', '1/2', 'cup', null, 2),
  ('00000000-0000-0000-0000-000000000015'::uuid, 'Granulated sugar', '3/4', 'cup', null, 3),
  ('00000000-0000-0000-0000-000000000015'::uuid, 'Large eggs', '4', null, null, 4),
  ('00000000-0000-0000-0000-000000000015'::uuid, 'Cocoa powder', '1/2', 'cup', null, 5),
  ('00000000-0000-0000-0000-000000000015'::uuid, 'Salt', '1/4', 'tsp', null, 6),

  -- Vegan Chocolate Chip Cookies
  ('00000000-0000-0000-0000-000000000016'::uuid, 'All-purpose flour', '2', 'cups', null, 1),
  ('00000000-0000-0000-0000-000000000016'::uuid, 'Baking soda', '1', 'tsp', null, 2),
  ('00000000-0000-0000-0000-000000000016'::uuid, 'Salt', '1/2', 'tsp', null, 3),
  ('00000000-0000-0000-0000-000000000016'::uuid, 'Coconut oil', '3/4', 'cup', 'melted', 4),
  ('00000000-0000-0000-0000-000000000016'::uuid, 'Brown sugar', '3/4', 'cup', null, 5),
  ('00000000-0000-0000-0000-000000000016'::uuid, 'Flax seed meal', '2', 'tbsp', 'mixed with water', 6),
  ('00000000-0000-0000-0000-000000000016'::uuid, 'Vanilla extract', '1', 'tsp', null, 7),
  ('00000000-0000-0000-0000-000000000016'::uuid, 'Semisweet chocolate chips', '1', 'cup', 'dairy-free', 8),

  -- No-Bake Cheesecake
  ('00000000-0000-0000-0000-000000000017'::uuid, 'Graham crackers', '2', 'cups', 'crushed', 1),
  ('00000000-0000-0000-0000-000000000017'::uuid, 'Melted butter', '1/2', 'cup', null, 2),
  ('00000000-0000-0000-0000-000000000017'::uuid, 'Cream cheese', '24', 'oz', 'softened', 3),
  ('00000000-0000-0000-0000-000000000017'::uuid, 'Powdered sugar', '1', 'cup', null, 4),
  ('00000000-0000-0000-0000-000000000017'::uuid, 'Vanilla extract', '1', 'tsp', null, 5),
  ('00000000-0000-0000-0000-000000000017'::uuid, 'Heavy cream', '1 1/2', 'cups', 'whipped', 6),

  -- Rice Krispie Treats
  ('00000000-0000-0000-0000-000000000018'::uuid, 'Unsalted butter', '3', 'tbsp', null, 1),
  ('00000000-0000-0000-0000-000000000018'::uuid, 'Mini marshmallows', '4', 'cups', null, 2),
  ('00000000-0000-0000-0000-000000000018'::uuid, 'Crisp rice cereal', '6', 'cups', null, 3),

  -- Homemade Croissants
  ('00000000-0000-0000-0000-000000000019'::uuid, 'Bread flour', '4', 'cups', null, 1),
  ('00000000-0000-0000-0000-000000000019'::uuid, 'Granulated sugar', '1/4', 'cup', null, 2),
  ('00000000-0000-0000-0000-000000000019'::uuid, 'Fine sea salt', '2', 'tsp', null, 3),
  ('00000000-0000-0000-0000-000000000019'::uuid, 'Active dry yeast', '2 1/4', 'tsp', null, 4),
  ('00000000-0000-0000-0000-000000000019'::uuid, 'Whole milk', '1 1/4', 'cups', 'cold', 5),
  ('00000000-0000-0000-0000-000000000019'::uuid, 'Unsalted butter', '1 1/2', 'cups', 'cold, for laminating', 6),

  -- Zucchini Bread
  ('00000000-0000-0000-0000-000000000020'::uuid, 'All-purpose flour', '2', 'cups', null, 1),
  ('00000000-0000-0000-0000-000000000020'::uuid, 'Baking soda', '1', 'tsp', null, 2),
  ('00000000-0000-0000-0000-000000000020'::uuid, 'Ground cinnamon', '1', 'tsp', null, 3),
  ('00000000-0000-0000-0000-000000000020'::uuid, 'Vegetable oil', '1/2', 'cup', null, 4),
  ('00000000-0000-0000-0000-000000000020'::uuid, 'Brown sugar', '1', 'cup', null, 5),
  ('00000000-0000-0000-0000-000000000020'::uuid, 'Large eggs', '2', null, null, 6),
  ('00000000-0000-0000-0000-000000000020'::uuid, 'Zucchini', '1', 'cup', 'grated and squeezed dry', 7),
  ('00000000-0000-0000-0000-000000000020'::uuid, 'Walnuts', '1/2', 'cup', 'chopped, optional', 8)
) as v(recipe_id, ingredient_name, quantity, unit, notes, sort_order)
join public.ingredients i on i.name = v.ingredient_name;

-- ---------------------------------------------------------------------------
-- recipe_steps
-- ---------------------------------------------------------------------------
insert into public.recipe_steps (recipe_id, step_number, instruction) values
  ('00000000-0000-0000-0000-000000000001', 1, 'Preheat oven to 375°F (190°C) and line two baking sheets with parchment.'),
  ('00000000-0000-0000-0000-000000000001', 2, 'Whisk together the flour, baking soda, and salt in a bowl; set aside.'),
  ('00000000-0000-0000-0000-000000000001', 3, 'Cream the butter with both sugars until light and fluffy, about 2 minutes.'),
  ('00000000-0000-0000-0000-000000000001', 4, 'Beat in the eggs one at a time, then the vanilla.'),
  ('00000000-0000-0000-0000-000000000001', 5, 'Mix in the dry ingredients until just combined, then fold in the chocolate chips.'),
  ('00000000-0000-0000-0000-000000000001', 6, 'Scoop rounded tablespoons onto the sheets and bake 10-12 minutes until the edges are golden. Cool on the sheet for 5 minutes before transferring.'),

  ('00000000-0000-0000-0000-000000000002', 1, 'Preheat oven to 350°F (175°C) and line an 8x8-inch pan with parchment.'),
  ('00000000-0000-0000-0000-000000000002', 2, 'Whisk the melted butter and sugar together until glossy.'),
  ('00000000-0000-0000-0000-000000000002', 3, 'Whisk in the eggs and vanilla.'),
  ('00000000-0000-0000-0000-000000000002', 4, 'Fold in the cocoa powder, flour, and salt until just combined — do not overmix.'),
  ('00000000-0000-0000-0000-000000000002', 5, 'Stir in the chopped chocolate and spread the batter into the pan.'),
  ('00000000-0000-0000-0000-000000000002', 6, 'Bake 28-32 minutes until a toothpick comes out with a few moist crumbs. Cool completely before slicing.'),

  ('00000000-0000-0000-0000-000000000003', 1, 'Preheat oven to 350°F (175°C) and line a muffin tin with liners.'),
  ('00000000-0000-0000-0000-000000000003', 2, 'Whisk together the flour, baking powder, and salt.'),
  ('00000000-0000-0000-0000-000000000003', 3, 'Cream the butter and sugar until fluffy, then beat in the eggs and vanilla bean paste.'),
  ('00000000-0000-0000-0000-000000000003', 4, 'Alternate adding the dry ingredients and milk, mixing just until smooth.'),
  ('00000000-0000-0000-0000-000000000003', 5, 'Divide batter among the liners and bake 18-20 minutes until a toothpick comes out clean.'),
  ('00000000-0000-0000-0000-000000000003', 6, 'Cool completely, then pipe with your favorite buttercream made from the powdered sugar.'),

  ('00000000-0000-0000-0000-000000000004', 1, 'Preheat oven to 350°F (175°C) and grease a loaf pan.'),
  ('00000000-0000-0000-0000-000000000004', 2, 'Mash the bananas in a large bowl, then whisk in the melted butter, brown sugar, egg, and vanilla.'),
  ('00000000-0000-0000-0000-000000000004', 3, 'Sprinkle the baking soda, salt, and 1 tsp cinnamon over the top and stir in.'),
  ('00000000-0000-0000-0000-000000000004', 4, 'Fold in the flour just until no streaks remain.'),
  ('00000000-0000-0000-0000-000000000004', 5, 'Pour into the pan, sprinkle with the remaining cinnamon mixed with the granulated sugar.'),
  ('00000000-0000-0000-0000-000000000004', 6, 'Bake 55-65 minutes until a toothpick comes out clean. Cool in the pan 10 minutes, then turn out.'),

  ('00000000-0000-0000-0000-000000000005', 1, 'Whisk the flour, yeast, and salt together in a large bowl.'),
  ('00000000-0000-0000-0000-000000000005', 2, 'Stir in the water until a shaggy, sticky dough forms — do not knead.'),
  ('00000000-0000-0000-0000-000000000005', 3, 'Cover and let rest at room temperature for 12-18 hours, until doubled and bubbly.'),
  ('00000000-0000-0000-0000-000000000005', 4, 'Turn the dough onto a floured surface, fold it over itself a few times, and shape into a ball.'),
  ('00000000-0000-0000-0000-000000000005', 5, 'Rest 30 minutes while you preheat the oven with a covered Dutch oven inside to 450°F (230°C).'),
  ('00000000-0000-0000-0000-000000000005', 6, 'Carefully drop the dough into the hot pot, cover, and bake 30 minutes; uncover and bake 10-15 more minutes until deep golden.'),

  ('00000000-0000-0000-0000-000000000006', 1, 'Preheat oven to 425°F (220°C) and line a baking sheet.'),
  ('00000000-0000-0000-0000-000000000006', 2, 'Whisk together the flour, baking powder, baking soda, and salt.'),
  ('00000000-0000-0000-0000-000000000006', 3, 'Cut the cold butter into the flour until pea-sized crumbs remain.'),
  ('00000000-0000-0000-0000-000000000006', 4, 'Stir in the buttermilk just until a shaggy dough comes together.'),
  ('00000000-0000-0000-0000-000000000006', 5, 'Pat the dough into a 1-inch-thick rectangle, fold it in thirds, and pat out again to build layers.'),
  ('00000000-0000-0000-0000-000000000006', 6, 'Cut into rounds and bake 12-15 minutes until golden and risen.'),

  ('00000000-0000-0000-0000-000000000007', 1, 'Pulse the flour and cold butter with a pinch of salt until pea-sized, then add water until the dough just comes together. Chill 1 hour.'),
  ('00000000-0000-0000-0000-000000000007', 2, 'Toss the sliced apples with sugar, cinnamon, cornstarch, and lemon juice.'),
  ('00000000-0000-0000-0000-000000000007', 3, 'Roll out half the dough and line a 9-inch pie plate.'),
  ('00000000-0000-0000-0000-000000000007', 4, 'Fill with the apple mixture, then roll out the second half of dough for the top crust.'),
  ('00000000-0000-0000-0000-000000000007', 5, 'Seal and crimp the edges, cut a few vents in the top, and chill 20 minutes.'),
  ('00000000-0000-0000-0000-000000000007', 6, 'Bake at 425°F (220°C) for 20 minutes, then reduce to 375°F (190°C) and bake 35-40 more minutes until golden and bubbling.'),

  ('00000000-0000-0000-0000-000000000008', 1, 'Pulse the flour, cold butter, and powdered sugar until it resembles coarse crumbs, then press into a tart pan.'),
  ('00000000-0000-0000-0000-000000000008', 2, 'Blind-bake the crust at 375°F (190°C) for 15-18 minutes until lightly golden. Cool slightly.'),
  ('00000000-0000-0000-0000-000000000008', 3, 'Whisk the eggs and sugar together, then whisk in the lemon juice and zest.'),
  ('00000000-0000-0000-0000-000000000008', 4, 'Cook the mixture over low heat, stirring constantly, until thickened, about 8-10 minutes.'),
  ('00000000-0000-0000-0000-000000000008', 5, 'Remove from heat and whisk in the butter until glossy and smooth.'),
  ('00000000-0000-0000-0000-000000000008', 6, 'Pour the curd into the crust and chill at least 3 hours before slicing.'),

  ('00000000-0000-0000-0000-000000000009', 1, 'Preheat oven to 350°F (175°C) and line baking sheets.'),
  ('00000000-0000-0000-0000-000000000009', 2, 'Whisk together the flour, baking soda, and cinnamon.'),
  ('00000000-0000-0000-0000-000000000009', 3, 'Cream the butter and brown sugar until fluffy, then beat in the eggs.'),
  ('00000000-0000-0000-0000-000000000009', 4, 'Mix in the dry ingredients, then stir in the oats and raisins.'),
  ('00000000-0000-0000-0000-000000000009', 5, 'Drop rounded tablespoons onto the sheets, spacing well apart.'),
  ('00000000-0000-0000-0000-000000000009', 6, 'Bake 10-12 minutes until the edges are set. Cool on the sheet briefly before moving.'),

  ('00000000-0000-0000-0000-000000000010', 1, 'Preheat oven to 350°F (175°C) and line a muffin tin.'),
  ('00000000-0000-0000-0000-000000000010', 2, 'Whisk together the flour, cocoa powder, and baking soda.'),
  ('00000000-0000-0000-0000-000000000010', 3, 'Cream the butter and sugar, then beat in the eggs one at a time.'),
  ('00000000-0000-0000-0000-000000000010', 4, 'Mix the food coloring into the buttermilk, then alternate adding it and the dry ingredients to the batter.'),
  ('00000000-0000-0000-0000-000000000010', 5, 'Stir in the vinegar, divide among liners, and bake 18-20 minutes.'),
  ('00000000-0000-0000-0000-000000000010', 6, 'Cool completely, then top with cream cheese frosting.'),

  ('00000000-0000-0000-0000-000000000011', 1, 'Warm the milk to about 110°F (43°C) and stir in the yeast and a pinch of the sugar; let stand until foamy.'),
  ('00000000-0000-0000-0000-000000000011', 2, 'Mix in the remaining sugar, half the melted butter, the egg, and flour to form a soft dough. Knead 6-8 minutes.'),
  ('00000000-0000-0000-0000-000000000011', 3, 'Cover and let rise in a warm spot until doubled, about 1 hour.'),
  ('00000000-0000-0000-0000-000000000011', 4, 'Roll the dough into a large rectangle, brush with remaining butter, and sprinkle with the brown sugar and cinnamon.'),
  ('00000000-0000-0000-0000-000000000011', 5, 'Roll up tightly from the long edge, slice into 12 rolls, and arrange in a greased pan. Let rise 30-45 minutes.'),
  ('00000000-0000-0000-0000-000000000011', 6, 'Bake at 350°F (175°C) for 22-25 minutes until golden, then top with cream cheese icing while warm.'),

  ('00000000-0000-0000-0000-000000000012', 1, 'Preheat oven to 400°F (205°C) and line a muffin tin.'),
  ('00000000-0000-0000-0000-000000000012', 2, 'Whisk together the flour, baking powder, and salt.'),
  ('00000000-0000-0000-0000-000000000012', 3, 'Cream the butter and sugar, then beat in the eggs.'),
  ('00000000-0000-0000-0000-000000000012', 4, 'Alternate adding the dry ingredients and milk, mixing just until combined.'),
  ('00000000-0000-0000-0000-000000000012', 5, 'Gently fold in the blueberries, then divide the batter among the liners, filling nearly to the top.'),
  ('00000000-0000-0000-0000-000000000012', 6, 'Bake 20-22 minutes until domed and golden. Cool 5 minutes before removing from the tin.'),

  ('00000000-0000-0000-0000-000000000013', 1, 'Preheat oven to 350°F (175°C) and line a baking sheet.'),
  ('00000000-0000-0000-0000-000000000013', 2, 'Stir together the peanut butter, sugar, egg, baking soda, and vanilla until smooth.'),
  ('00000000-0000-0000-0000-000000000013', 3, 'Roll into tablespoon-sized balls and place on the sheet.'),
  ('00000000-0000-0000-0000-000000000013', 4, 'Press each ball flat with a fork in a crosshatch pattern.'),
  ('00000000-0000-0000-0000-000000000013', 5, 'Bake 8-10 minutes until just set. Cool on the sheet a few minutes before moving.'),

  ('00000000-0000-0000-0000-000000000014', 1, 'Preheat oven to 350°F (175°C) and grease two 9-inch round pans.'),
  ('00000000-0000-0000-0000-000000000014', 2, 'Whisk together the flour, baking soda, and cinnamon.'),
  ('00000000-0000-0000-0000-000000000014', 3, 'Whisk together the oil, brown sugar, and eggs until smooth.'),
  ('00000000-0000-0000-0000-000000000014', 4, 'Fold the dry ingredients into the wet, then stir in the carrots, pineapple, and walnuts.'),
  ('00000000-0000-0000-0000-000000000014', 5, 'Divide between the pans and bake 30-35 minutes until a toothpick comes out clean.'),
  ('00000000-0000-0000-0000-000000000014', 6, 'Cool completely, then frost with cream cheese frosting between layers and on top.'),

  ('00000000-0000-0000-0000-000000000015', 1, 'Preheat oven to 375°F (190°C) and line the bottom of a springform pan with parchment.'),
  ('00000000-0000-0000-0000-000000000015', 2, 'Melt the chocolate and butter together, stirring until smooth.'),
  ('00000000-0000-0000-0000-000000000015', 3, 'Whisk in the sugar, then the eggs one at a time.'),
  ('00000000-0000-0000-0000-000000000015', 4, 'Fold in the cocoa powder and salt until just combined.'),
  ('00000000-0000-0000-0000-000000000015', 5, 'Pour into the pan and bake 30-35 minutes until the top is set but the center still jiggles slightly.'),
  ('00000000-0000-0000-0000-000000000015', 6, 'Cool completely in the pan before releasing — the cake will sink slightly, which is expected.'),

  ('00000000-0000-0000-0000-000000000016', 1, 'Preheat oven to 350°F (175°C) and line baking sheets.'),
  ('00000000-0000-0000-0000-000000000016', 2, 'Mix the flax seed meal with 5 tbsp water and let sit 5 minutes to gel.'),
  ('00000000-0000-0000-0000-000000000016', 3, 'Whisk together the flour, baking soda, and salt.'),
  ('00000000-0000-0000-0000-000000000016', 4, 'Whisk the melted coconut oil and brown sugar together, then whisk in the flax mixture and vanilla.'),
  ('00000000-0000-0000-0000-000000000016', 5, 'Stir in the dry ingredients and chocolate chips until just combined.'),
  ('00000000-0000-0000-0000-000000000016', 6, 'Scoop onto the sheets and bake 10-12 minutes until the edges are set. Cool on the sheet before moving.'),

  ('00000000-0000-0000-0000-000000000017', 1, 'Stir the crushed graham crackers with the melted butter and press into the bottom of a springform pan. Chill.'),
  ('00000000-0000-0000-0000-000000000017', 2, 'Beat the cream cheese, powdered sugar, and vanilla until smooth.'),
  ('00000000-0000-0000-0000-000000000017', 3, 'Whip the heavy cream to stiff peaks in a separate bowl.'),
  ('00000000-0000-0000-0000-000000000017', 4, 'Fold the whipped cream into the cream cheese mixture until no streaks remain.'),
  ('00000000-0000-0000-0000-000000000017', 5, 'Spread over the crust and smooth the top.'),
  ('00000000-0000-0000-0000-000000000017', 6, 'Chill at least 6 hours, or overnight, before slicing.'),

  ('00000000-0000-0000-0000-000000000018', 1, 'Melt the butter in a large pot over low heat.'),
  ('00000000-0000-0000-0000-000000000018', 2, 'Add the marshmallows and stir until completely melted and smooth.'),
  ('00000000-0000-0000-0000-000000000018', 3, 'Remove from heat and fold in the rice cereal until evenly coated.'),
  ('00000000-0000-0000-0000-000000000018', 4, 'Press into a greased 9x13-inch pan without compacting too much.'),
  ('00000000-0000-0000-0000-000000000018', 5, 'Cool at least 20 minutes before cutting into squares.'),

  ('00000000-0000-0000-0000-000000000019', 1, 'Mix the flour, sugar, salt, yeast, and cold milk into a smooth dough. Chill 1 hour.'),
  ('00000000-0000-0000-0000-000000000019', 2, 'Pound the cold butter into a flat rectangle between sheets of parchment.'),
  ('00000000-0000-0000-0000-000000000019', 3, 'Roll the dough out, encase the butter block, and fold like a letter. Chill 30 minutes.'),
  ('00000000-0000-0000-0000-000000000019', 4, 'Repeat the roll-and-fold two more times, chilling between each, to build the layers.'),
  ('00000000-0000-0000-0000-000000000019', 5, 'Roll the dough out, cut into triangles, and roll each one up from the wide end. Let rise 2 hours.'),
  ('00000000-0000-0000-0000-000000000019', 6, 'Brush with egg wash and bake at 400°F (205°C) for 18-20 minutes until deeply golden and flaky.'),

  ('00000000-0000-0000-0000-000000000020', 1, 'Preheat oven to 350°F (175°C) and grease a loaf pan.'),
  ('00000000-0000-0000-0000-000000000020', 2, 'Whisk together the flour, baking soda, and cinnamon.'),
  ('00000000-0000-0000-0000-000000000020', 3, 'Whisk the oil, brown sugar, and eggs together until smooth.'),
  ('00000000-0000-0000-0000-000000000020', 4, 'Fold the dry ingredients into the wet, then stir in the zucchini and walnuts.'),
  ('00000000-0000-0000-0000-000000000020', 5, 'Pour into the pan and bake 55-60 minutes until a toothpick comes out clean.'),
  ('00000000-0000-0000-0000-000000000020', 6, 'Cool in the pan 10 minutes, then turn out onto a rack to cool completely.')
on conflict (recipe_id, step_number) do nothing;
