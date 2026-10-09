import type { Metadata } from "next";
import { SectionHeader } from "@/components/layout";
import { ArticleGrid } from "@/features/articles";
import { latestArticles } from "@/features/home";

export const metadata: Metadata = {
  title: "Research",
  description: "Research summaries and evidence-based articles.",
};

export default function ResearchPage() {
  return (
    <main className="mx-auto max-w-6xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeader
        title="Research & evidence"
        description="Placeholder listing — research-tagged articles will be filtered from the CMS later."
      />
      <div className="mt-10">
        <ArticleGrid articles={latestArticles.slice(0, 3)} />
      </div>
    </main>
  );
}
