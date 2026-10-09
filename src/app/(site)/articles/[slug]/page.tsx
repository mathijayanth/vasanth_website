import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ArticleBreadcrumb,
  ArticleContent,
  ArticleHeader,
  ArticleHeroImage,
  ArticleMedicalDisclaimer,
  ArticleReferencesSection,
  ArticlePlaceholderBanner,
  KeyTakeawayBox,
  MedicalReviewSection,
  RelatedArticlesSection,
  TableOfContents,
} from "@/components/articles";
import { buildArticleJsonLd } from "@/lib/articles/article-json-ld";
import {
  getAllArticleSlugs,
  getArticleBySlug,
  getFallbackRelatedArticles,
} from "@/lib/articles/get-article-by-slug";
import { env } from "@/lib/env";
import { extractHeadings } from "@/types/article-content";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getAllArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) {
    return { title: "Article not found" };
  }

  const canonical = `${env.appUrl}/articles/${article.slug}`;

  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt,
      url: canonical,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: [article.author.name],
      images: [
        {
          url: article.imageUrl,
          alt: article.imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [article.imageUrl],
    },
  };
}

export default async function ArticleDetailPage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const headings = extractHeadings(article.content);
  const related = await getFallbackRelatedArticles(article);
  const canonicalUrl = `${env.appUrl}/articles/${article.slug}`;
  const jsonLd = buildArticleJsonLd(article, canonicalUrl);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
          <ArticleBreadcrumb
            category={article.category}
            categorySlug={article.categorySlug}
            title={article.title}
          />

          {article.isPlaceholder ? (
            <ArticlePlaceholderBanner className="mt-6" />
          ) : null}

          <ArticleHeader article={article} shareUrl={canonicalUrl} />

          <ArticleHeroImage
            src={article.imageUrl}
            alt={article.imageAlt}
            priority
          />

          <div className="mt-10 lg:grid lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] lg:gap-12 xl:grid-cols-[minmax(0,16rem)_minmax(0,1fr)]">
            <aside className="mb-8 lg:mb-0">
              <TableOfContents headings={headings} />
            </aside>

            <div className="min-w-0 max-w-3xl">
              <KeyTakeawayBox items={article.keyTakeaways} />

              <div className="mt-8">
                <ArticleContent blocks={article.content} />
              </div>

              {article.medicalReview ? (
                <div className="mt-10">
                  <MedicalReviewSection review={article.medicalReview} />
                </div>
              ) : null}

              <div className="mt-10">
                <ArticleReferencesSection references={article.references} />
              </div>

              <div className="mt-10">
                <ArticleMedicalDisclaimer />
              </div>
            </div>
          </div>
        </div>

        <RelatedArticlesSection articles={related} />
      </div>
    </>
  );
}
