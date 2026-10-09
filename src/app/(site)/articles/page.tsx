import type { Metadata } from "next";
import {
  ArticleCard,
  ArticleGrid,
  ArticlesFilters,
  ArticlesNoResults,
  ArticlesEmptySearchPrompt,
  ArticlesFeaturedSection,
  ArticlesResultsSummary,
  FeaturedArticle,
} from "@/components/articles";
import { Pagination } from "@/components/ui";
import { buildArticlesPaginationLinks } from "@/lib/articles/pagination";
import { loadArticleCategories } from "@/lib/articles/load-categories";
import { countPublishedArticles, queryArticles } from "@/lib/articles/query-articles";
import {
  parseArticlesQuery,
  type ArticlesSearchParams,
} from "@/lib/articles/search-params";

export const metadata: Metadata = {
  title: "Health Articles",
  description:
    "Evidence-based information to help you understand your health.",
};

type ArticlesPageProps = {
  searchParams: Promise<ArticlesSearchParams>;
};

export default async function ArticlesPage({ searchParams }: ArticlesPageProps) {
  const rawParams = await searchParams;
  const query = parseArticlesQuery(rawParams);
  const [result, articleCategories, publishedCount] = await Promise.all([
    queryArticles(query),
    loadArticleCategories(),
    countPublishedArticles(),
  ]);
  const categoryLabel = articleCategories.find(
    (item) => item.slug === query.category,
  )?.label;

  const emptySearchSubmitted =
    rawParams.search !== undefined && query.search.length === 0;
  const hasActiveFilters = Boolean(query.search || query.category);
  const noResults = result.total === 0 && hasActiveFilters;

  const pagination = buildArticlesPaginationLinks({
    page: result.page,
    totalPages: result.totalPages,
    search: query.search,
    category: query.category,
    sort: query.sort,
  });

  return (
    <main className="mx-auto max-w-6xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
      <header className="max-w-3xl">
        <h1 className="text-display">Health Articles</h1>
        <p className="text-subtitle mt-3">
          Evidence-based information to help you understand your health.
        </p>
      </header>

      <div className="mt-8">
        <ArticlesFilters
          search={query.search}
          category={query.category}
          sort={query.sort}
          categories={articleCategories}
        />
      </div>

      {emptySearchSubmitted ? (
        <div className="mt-8">
          <ArticlesEmptySearchPrompt />
        </div>
      ) : null}

      {!emptySearchSubmitted && result.featured.length > 0 ? (
        <ArticlesFeaturedSection>
          <FeaturedArticle article={result.featured[0]!} />
          {result.featured.length > 1 ? (
            <ul className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {result.featured.slice(1).map((article) => (
                <li key={article.id}>
                  <ArticleCard article={article} highlight />
                </li>
              ))}
            </ul>
          ) : null}
        </ArticlesFeaturedSection>
      ) : null}

      <section className="mt-10" aria-labelledby="articles-grid-heading">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <h2 id="articles-grid-heading" className="text-title">
            All articles
          </h2>
          <ArticlesResultsSummary
            total={result.total}
            search={query.search}
            categoryLabel={categoryLabel}
          />
        </div>

        {noResults ? (
          <div className="mt-8">
            <ArticlesNoResults
              search={query.search}
              category={query.category}
              categoryLabel={categoryLabel}
            />
          </div>
        ) : (
          <>
            <div className="mt-6">
              <ArticleGrid articles={result.items} />
            </div>
            {result.totalPages > 1 ? (
              <Pagination
                className="mt-10"
                prev={pagination.prev}
                next={pagination.next}
                pages={pagination.pages}
                aria-label="Articles pagination"
              />
            ) : null}
          </>
        )}
      </section>

      {!hasActiveFilters && publishedCount === 0 ? (
        <ArticlesEmptySearchPrompt className="mt-10" />
      ) : null}
    </main>
  );
}
