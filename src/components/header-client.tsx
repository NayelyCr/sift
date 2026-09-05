"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { signOut } from "@/lib/actions/auth";

type NavUser = { email: string; displayName: string; username: string } | null;

const NAV_LINKS = [
  { href: "/recipes", label: "All Recipes" },
  { href: "/recipes/new", label: "Submit a Recipe" },
];

export function HeaderClient({ user }: { user: NavUser }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="hidden items-center gap-6 md:flex">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`group relative text-sm font-medium transition-colors hover:text-primary ${
              pathname === link.href ? "text-primary" : "text-foreground/80"
            }`}
          >
            {link.label}
            <span
              aria-hidden="true"
              className={`absolute inset-x-0 -bottom-1 h-0.5 origin-left scale-x-0 rounded-full bg-primary transition-transform duration-300 ease-out group-hover:scale-x-100 ${
                pathname === link.href ? "scale-x-100" : ""
              }`}
            />
          </Link>
        ))}
      </nav>

      <div className="hidden items-center gap-3 md:flex">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 px-2">
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="bg-accent text-accent-foreground text-xs">
                    {user.displayName.slice(0, 1).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{user.displayName}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/account">My account</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/recipes/new">Submit a recipe</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => signOut()}>
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <>
            <Button variant="ghost" asChild>
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Sign up</Link>
            </Button>
          </>
        )}
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="flex flex-col gap-6">
          <SheetHeader>
            <SheetTitle className="font-display">Sift</SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <SheetClose asChild key={link.href}>
                <Link href={link.href} className="text-base font-medium">
                  {link.label}
                </Link>
              </SheetClose>
            ))}
            {user && (
              <SheetClose asChild>
                <Link href="/account" className="text-base font-medium">
                  My account
                </Link>
              </SheetClose>
            )}
          </nav>
          <div className="mt-auto flex flex-col gap-2">
            {user ? (
              <form action={signOut}>
                <Button type="submit" variant="outline" className="w-full">
                  Sign out
                </Button>
              </form>
            ) : (
              <>
                <SheetClose asChild>
                  <Button variant="outline" asChild>
                    <Link href="/login">Log in</Link>
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button asChild>
                    <Link href="/signup">Sign up</Link>
                  </Button>
                </SheetClose>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
