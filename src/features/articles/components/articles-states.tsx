import type { ReactNode } from "react";
import Link from "next/link";
import { ButtonLink, EmptyState } from "@/components/ui";
import { buildArticlesUrl } from "../lib/search-params";

type ArticlesEmptySearchProps = {
  className?: string;
};

/** Shown when the user has not entered a search query yet. */
export function ArticlesEmptySearchPrompt({ className }: ArticlesEmptySearchProps) {
  return (
    <EmptyState
      className={className}
      title="Search the article library"
      description="Enter a keyword above to find placeholder articles by title, summary, author, or category."
      icon={<span className="text-2xl">⌕</span>}
    />
  );
}

type ArticlesNoResultsProps = {
  search: string;
  category: string;
  categoryLabel?: string;
};

export function ArticlesNoResults({
  search,
  category,
  categoryLabel,
}: ArticlesNoResultsProps) {
  const parts = [
    search ? `“${search}”` : null,
    category ? categoryLabel ?? category : null,
  ].filter(Boolean);

  return (
    <EmptyState
      title="No articles found"
      description={
        parts.length > 0
          ? `We couldn't find placeholder articles matching ${parts.join(" in ")}. Try another keyword or category.`
          : "Try adjusting your filters to see more placeholder articles."
      }
      action={
        <ButtonLink href={buildArticlesUrl()} variant="secondary">
          Clear filters
        </ButtonLink>
      }
    />
  );
}

type ArticlesResultsSummaryProps = {
  total: number;
  search: string;
  categoryLabel?: string;
};

export function ArticlesResultsSummary({
  total,
  search,
  categoryLabel,
}: ArticlesResultsSummaryProps) {
  if (total === 0) return null;

  return (
    <p className="text-caption" role="status">
      Showing {total} article{total === 1 ? "" : "s"}
      {search ? (
        <>
          {" "}
          for <span className="font-medium text-foreground">“{search}”</span>
        </>
      ) : null}
      {categoryLabel ? (
        <>
          {" "}
          in <span className="font-medium text-foreground">{categoryLabel}</span>
        </>
      ) : null}
    </p>
  );
}

export function ArticlesFeaturedSection({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <section aria-labelledby="featured-articles-heading" className="mt-10">
      <div className="flex items-end justify-between gap-4">
        <h2 id="featured-articles-heading" className="text-title">
          Featured articles
        </h2>
        <Link
          href="/articles"
          className="text-sm font-semibold text-primary hover:underline"
        >
          View all
        </Link>
      </div>
      <div className="mt-6 space-y-6">{children}</div>
    </section>
  );
}
