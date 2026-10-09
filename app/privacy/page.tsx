import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-display">Privacy Policy</h1>
      <p className="text-body mt-6 text-muted">
        Placeholder privacy policy content. A full policy will be published before
        production launch.
      </p>
    </main>
  );
}
