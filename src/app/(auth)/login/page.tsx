import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthForm } from "@/features/auth";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-16 sm:px-6">
      <h1 className="text-title">Sign in</h1>
      <p className="text-subtitle mt-2">
        Access the editorial admin area with your VMed Research account.
      </p>
      <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-soft">
        <Suspense fallback={<p className="text-sm text-muted">Loading…</p>}>
          <AuthForm mode="login" />
        </Suspense>
      </div>
    </main>
  );
}
