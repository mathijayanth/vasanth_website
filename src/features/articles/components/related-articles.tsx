import { ArticleGrid } from "./article-card";
import { SectionHeader } from "@/components/layout/section-header";
import type { ArticleSummary } from "../article.types";

type RelatedArticlesSectionProps = {
  articles: ArticleSummary[];
};

export function RelatedArticlesSection({ articles }: RelatedArticlesSectionProps) {
  if (articles.length === 0) return null;

  return (
    <section
      aria-labelledby="related-articles-heading"
      className="border-t border-border bg-card/40"
    >
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <SectionHeader
          title="Related articles"
          description="More placeholder stories in this topic area."
          href="/articles"
          linkLabel="Browse all"
        />
        <div className="mt-8">
          <ArticleGrid articles={articles} />
        </div>
      </div>
    </section>
  );
}
