import type { Metadata } from "next";
import { EmptyState } from "@/components/ui";

export const metadata: Metadata = {
  title: "Authors",
  description: "Meet the clinicians and writers behind VitalNotes.",
};

export default function AuthorsPage() {
  return (
    <main className="mx-auto max-w-6xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-display">Authors</h1>
      <p className="mt-3 max-w-2xl text-subtitle">
        Doctor and author profiles will be loaded from the database in a future
        phase.
      </p>
      <EmptyState
        className="mt-10"
        title="Profiles coming soon"
        description="Empty state placeholder for the authors directory and detail pages."
      />
    </main>
  );
}
