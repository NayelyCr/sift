import type { Metadata } from "next";

import { AuthForm } from "@/components/auth-form";

export const metadata: Metadata = { title: "Log in" };

type SearchParams = Promise<{ next?: string; checkEmail?: string }>;

export default async function LoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { next, checkEmail } = await searchParams;

  return (
    <div className="mx-auto max-w-sm px-4 py-16 sm:px-6">
      {checkEmail && (
        <p className="mb-6 rounded-lg border bg-accent p-3 text-center text-sm text-accent-foreground">
          Check your email to confirm your account, then log in below.
        </p>
      )}
      <AuthForm mode="login" next={next} />
    </div>
  );
}
