// Next.js remounts template.tsx on every navigation (unlike layout.tsx),
// so a plain CSS animation here gives every page a soft fade/slide-in
// transition without needing a client-side animation library.
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-transition">{children}</div>;
}
