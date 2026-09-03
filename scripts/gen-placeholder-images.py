#!/usr/bin/env python3
"""Generate warm, on-brand SVG placeholder images for each seed recipe.

Real food photography needs a licensed source or an upload step the app
doesn't have here, so each recipe gets a simple illustrated card instead:
a soft gradient in the site's bakery palette, a category icon, and the
recipe title. Output goes to public/recipes/<slug>.svg and is referenced
directly by supabase/seed.sql's image_url column.
"""
import os

OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "recipes")

# (slug, title, icon-key, gradient-key)
RECIPES = [
    ("classic-chocolate-chip-cookies", "Classic Chocolate Chip Cookies", "cookie", "a"),
    ("fudgy-brownies", "Fudgy Brownies", "brownie", "b"),
    ("vanilla-bean-cupcakes", "Vanilla Bean Cupcakes", "cupcake", "c"),
    ("cinnamon-banana-bread", "Cinnamon Sugar Banana Bread", "loaf", "a"),
    ("no-knead-artisan-bread", "No-Knead Artisan Bread", "loaf", "d"),
    ("flaky-buttermilk-biscuits", "Flaky Buttermilk Biscuits", "biscuit", "b"),
    ("classic-apple-pie", "Classic Apple Pie", "pie", "c"),
    ("lemon-tart", "Lemon Tart", "tart", "e"),
    ("oatmeal-raisin-cookies", "Oatmeal Raisin Cookies", "cookie", "d"),
    ("red-velvet-cupcakes", "Red Velvet Cupcakes", "cupcake", "f"),
    ("cinnamon-rolls", "Cinnamon Rolls", "roll", "a"),
    ("blueberry-muffins", "Blueberry Muffins", "muffin", "e"),
    ("peanut-butter-cookies", "Peanut Butter Cookies", "cookie", "b"),
    ("classic-carrot-cake", "Classic Carrot Cake", "cake", "d"),
    ("flourless-chocolate-cake", "Flourless Chocolate Cake", "cake", "g"),
    ("vegan-chocolate-chip-cookies", "Vegan Chocolate Chip Cookies", "cookie", "c"),
    ("no-bake-cheesecake", "No-Bake Cheesecake", "cheesecake", "e"),
    ("rice-krispie-treats", "Rice Krispie Treats", "bar", "f"),
    ("homemade-croissants", "Homemade Croissants", "croissant", "a"),
    ("zucchini-bread", "Zucchini Bread", "loaf", "g"),
]

GRADIENTS = {
    "a": ("#f6c9a0", "#bf5330"),
    "b": ("#f4e1b8", "#c9793f"),
    "c": ("#f2c9c2", "#b3543f"),
    "d": ("#e9d6b8", "#8a5a34"),
    "e": ("#f8dfa0", "#c47a2c"),
    "f": ("#f0b8ab", "#a8443a"),
    "g": ("#d9c3a5", "#6b4226"),
}

# Simple, friendly icon paths drawn on a 0..100 viewbox, centered around (50,42)
ICONS = {
    "cookie": '<circle cx="50" cy="42" r="24" fill="#fff8ee" opacity="0.95"/>'
              '<circle cx="41" cy="34" r="2.6" fill="#8a5a34"/>'
              '<circle cx="58" cy="33" r="2.2" fill="#8a5a34"/>'
              '<circle cx="50" cy="45" r="2.8" fill="#8a5a34"/>'
              '<circle cx="40" cy="48" r="2.1" fill="#8a5a34"/>'
              '<circle cx="61" cy="46" r="2.4" fill="#8a5a34"/>'
              '<circle cx="50" cy="30" r="2" fill="#8a5a34"/>',
    "brownie": '<rect x="27" y="27" width="46" height="30" rx="3" fill="#fff8ee" opacity="0.95"/>'
               '<rect x="27" y="27" width="46" height="30" rx="3" fill="none" stroke="#6b4226" stroke-width="1.5" opacity="0.4"/>'
               '<line x1="42" y1="27" x2="42" y2="57" stroke="#6b4226" stroke-width="1.2" opacity="0.35"/>'
               '<line x1="58" y1="27" x2="58" y2="57" stroke="#6b4226" stroke-width="1.2" opacity="0.35"/>'
               '<line x1="27" y1="42" x2="73" y2="42" stroke="#6b4226" stroke-width="1.2" opacity="0.35"/>',
    "cupcake": '<path d="M35 40 h30 l-4 22 a2 2 0 0 1 -2 2 h-18 a2 2 0 0 1 -2 -2 z" fill="#fff8ee" opacity="0.95"/>'
               '<path d="M33 40 q17 -14 34 0 z" fill="#fff8ee" opacity="0.95"/>'
               '<circle cx="50" cy="22" r="3" fill="#fff8ee" opacity="0.95"/>',
    "loaf": '<path d="M26 52 q0 -22 24 -22 q24 0 24 22 z" fill="#fff8ee" opacity="0.95"/>'
            '<path d="M34 52 q2 -14 16 -16 q14 2 16 16" fill="none" stroke="#8a5a34" stroke-width="1.4" opacity="0.4"/>',
    "biscuit": '<circle cx="50" cy="42" r="22" fill="#fff8ee" opacity="0.95"/>'
               '<circle cx="50" cy="42" r="22" fill="none" stroke="#8a5a34" stroke-width="1.4" opacity="0.35"/>'
               '<path d="M32 42 h36 M50 24 v36" stroke="#8a5a34" stroke-width="1" opacity="0.25"/>',
    "pie": '<path d="M24 54 L50 22 L76 54 Z" fill="#fff8ee" opacity="0.95"/>'
           '<path d="M28 54 q22 10 44 0" fill="none" stroke="#8a5a34" stroke-width="1.4" opacity="0.4"/>'
           '<path d="M50 22 L50 54 M38 36 L38 54 M62 36 L62 54" stroke="#8a5a34" stroke-width="1" opacity="0.3"/>',
    "tart": '<circle cx="50" cy="44" r="23" fill="#fff8ee" opacity="0.95"/>'
            '<circle cx="50" cy="44" r="15" fill="#f8dfa0"/>'
            '<circle cx="50" cy="44" r="23" fill="none" stroke="#8a5a34" stroke-width="1.5" opacity="0.35"/>',
    "cupcake2": '',
    "roll": '<circle cx="38" cy="46" r="13" fill="#fff8ee" opacity="0.95"/>'
            '<circle cx="56" cy="46" r="13" fill="#fff8ee" opacity="0.95"/>'
            '<circle cx="47" cy="32" r="13" fill="#fff8ee" opacity="0.95"/>'
            '<path d="M38 46 q9 -9 18 0 M38 46 q4.5 -14 9 -14 M56 46 q-4.5 -14 -9 -14" stroke="#8a5a34" stroke-width="1.2" fill="none" opacity="0.35"/>',
    "muffin": '<path d="M32 44 h36 l-3 18 a3 3 0 0 1 -3 3 h-24 a3 3 0 0 1 -3 -3 z" fill="#fff8ee" opacity="0.95"/>'
              '<path d="M29 44 q21 -16 42 0 q-21 8 -42 0" fill="#fff8ee" opacity="0.95"/>'
              '<circle cx="40" cy="38" r="1.6" fill="#3f5aa3"/>'
              '<circle cx="52" cy="34" r="1.6" fill="#3f5aa3"/>'
              '<circle cx="60" cy="40" r="1.6" fill="#3f5aa3"/>',
    "cake": '<rect x="26" y="38" width="48" height="18" rx="2" fill="#fff8ee" opacity="0.95"/>'
            '<rect x="30" y="26" width="40" height="14" rx="2" fill="#fff8ee" opacity="0.85"/>'
            '<rect x="26" y="38" width="48" height="4" fill="#f2c9c2" opacity="0.6"/>'
            '<line x1="50" y1="18" x2="50" y2="26" stroke="#8a5a34" stroke-width="1.5"/>'
            '<circle cx="50" cy="16" r="2.2" fill="#f4b942"/>',
    "cheesecake": '<path d="M25 52 L75 52 L68 34 L32 34 Z" fill="#fff8ee" opacity="0.95"/>'
                  '<rect x="25" y="52" width="50" height="6" rx="1.5" fill="#c9793f" opacity="0.6"/>'
                  '<circle cx="42" cy="30" r="2" fill="#8a3b3b" opacity="0.7"/>'
                  '<circle cx="52" cy="28" r="2" fill="#8a3b3b" opacity="0.7"/>'
                  '<circle cx="60" cy="31" r="2" fill="#8a3b3b" opacity="0.7"/>',
    "bar": '<rect x="26" y="34" width="48" height="20" rx="2" fill="#fff8ee" opacity="0.95"/>'
           '<circle cx="35" cy="40" r="2.4" fill="#f6efe0"/>'
           '<circle cx="47" cy="46" r="2.6" fill="#f6efe0"/>'
           '<circle cx="59" cy="39" r="2.2" fill="#f6efe0"/>'
           '<circle cx="65" cy="48" r="2.3" fill="#f6efe0"/>'
           '<circle cx="40" cy="49" r="1.8" fill="#f6efe0"/>',
    "croissant": '<path d="M22 48 q6 -22 28 -22 q22 0 28 22 q-8 -6 -14 2 q-6 -10 -14 0 q-8 -10 -14 0 q-6 -8 -14 -2 Z" fill="#fff8ee" opacity="0.95"/>',
}


def make_svg(title: str, icon_key: str, grad_key: str) -> str:
    c1, c2 = GRADIENTS[grad_key]
    icon = ICONS.get(icon_key, ICONS["cookie"])
    # Escape XML-sensitive characters in the title (none expected, but be safe)
    safe_title = (
        title.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    )
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="800" height="600">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="{c1}"/>
      <stop offset="100%" stop-color="{c2}"/>
    </linearGradient>
  </defs>
  <rect width="400" height="300" fill="url(#bg)"/>
  <g transform="translate(60,10) scale(2.8)">
    {icon}
  </g>
  <rect x="0" y="248" width="400" height="52" fill="#241a12" opacity="0.32"/>
  <text x="200" y="280" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif"
        font-size="22" fill="#fff8ee" font-weight="600">{safe_title}</text>
</svg>'''


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    for slug, title, icon_key, grad_key in RECIPES:
        svg = make_svg(title, icon_key, grad_key)
        path = os.path.join(OUT_DIR, f"{slug}.svg")
        with open(path, "w") as f:
            f.write(svg)
        print(f"wrote {path}")


if __name__ == "__main__":
    main()
