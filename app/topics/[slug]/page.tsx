import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleGrid } from "@/components/articles";
import { SectionHeader } from "@/components/home";
import { latestArticles, topics } from "@/lib/mock/homepage-data";

type TopicPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: TopicPageProps): Promise<Metadata> {
  const { slug } = await params;
  const topic = topics.find((item) => item.slug === slug);
  return { title: topic?.name ?? "Topic" };
}

export default async function TopicDetailPage({ params }: TopicPageProps) {
  const { slug } = await params;
  const topic = topics.find((item) => item.slug === slug);
  if (!topic) notFound();

  const articles = latestArticles.filter(
    (article) => article.categorySlug === slug,
  );

  return (
    <main className="mx-auto max-w-6xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeader title={topic.name} description={topic.description} />
      {articles.length > 0 ? (
        <div className="mt-10">
          <ArticleGrid articles={articles} />
        </div>
      ) : (
        <p className="mt-8 text-muted">
          Placeholder topic page — articles for this topic will load from the API
          later.
        </p>
      )}
    </main>
  );
}
