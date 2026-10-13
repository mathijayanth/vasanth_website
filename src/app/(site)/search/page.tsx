import type { Metadata } from "next";
import { EmptyState } from "@/components/ui";

export const metadata: Metadata = {
  title: "Search",
  description: "Search medical articles and topics on VMed Research.",
};

export default function SearchPage() {
  return (
    <main className="mx-auto max-w-6xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-display">Search</h1>
      <p className="mt-3 max-w-2xl text-subtitle">
        Full-text search will connect to the API and database later. This page
        reserves the route and metadata shell.
      </p>
      <EmptyState
        className="mt-10"
        title="Search index not configured"
        description="Interactive search UI and filters arrive in the search phase."
      />
    </main>
  );
}
