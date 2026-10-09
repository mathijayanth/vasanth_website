import type { Metadata } from "next";
import { SectionHeader } from "@/components/layout";
import { TopicGrid } from "@/features/categories";
import { topics } from "@/features/home";

export const metadata: Metadata = {
  title: "Topics",
  description: "Browse health topics on VitalNotes.",
};

export default function TopicsPage() {
  return (
    <main className="mx-auto max-w-6xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeader
        title="Health topics"
        description="Explore editorial collections by specialty and wellness area."
      />
      <div className="mt-10">
        <TopicGrid topics={topics} />
      </div>
    </main>
  );
}
