import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { BackgroundSprinkles } from "@/components/background-sprinkles";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz"],
});

export const metadata: Metadata = {
  title: {
    default: "Sift — A Community Baking Cookbook",
    template: "%s · Sift",
  },
  description:
    "Browse, save, and share baking recipes — cookies, breads, cakes, and more — in a community cookbook built with Next.js and Supabase.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col antialiased">
        <BackgroundSprinkles />
        <div className="relative z-10 flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
