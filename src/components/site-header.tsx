import Link from "next/link";
import { ChefHat } from "lucide-react";

import { getCurrentUser } from "@/lib/data";
import { HeaderClient } from "@/components/header-client";

export async function SiteHeader() {
  const session = await getCurrentUser();

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-display text-xl font-semibold tracking-tight">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <ChefHat className="h-4 w-4" />
          </span>
          Sift
        </Link>

        <HeaderClient
          user={
            session
              ? {
                  email: session.user.email ?? "",
                  displayName: session.profile?.display_name ?? session.profile?.username ?? "Baker",
                  username: session.profile?.username ?? "",
                }
              : null
          }
        />
      </div>
    </header>
  );
}
