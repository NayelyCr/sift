// A template.tsx at this segment level remounts on every navigation between
// /recipes, /recipes/[slug], and /recipes/new (child-segment changes don't
// remount the root template, so this one covers the site's most common
// browsing flow: recipe list <-> recipe detail).
export default function RecipesTemplate({ children }: { children: React.ReactNode }) {
  return <div className="page-transition">{children}</div>;
}
