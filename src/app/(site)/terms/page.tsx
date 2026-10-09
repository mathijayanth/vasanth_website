import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Use" };

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-display">Terms of Use</h1>
      <p className="text-body mt-6 text-muted">
        Placeholder terms of use. Legal copy will be added before production
        launch.
      </p>
    </main>
  );
}
