import type { ArticleDetail } from "@/types/article-content";
import { env } from "@/lib/env";

export function buildArticleJsonLd(article: ArticleDetail, canonicalUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: article.title,
    description: article.excerpt,
    url: canonicalUrl,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    image: [article.imageUrl],
    isAccessibleForFree: true,
    medicalAudience: {
      "@type": "MedicalAudience",
      audienceType: "Patient",
    },
    author: {
      "@type": "Person",
      name: article.author.name,
      url: `${env.appUrl}/authors/${article.author.slug}`,
    },
    publisher: {
      "@type": "Organization",
      name: "VitalNotes",
      url: env.appUrl,
    },
    mainEntityOfPage: canonicalUrl,
    about: {
      "@type": "Thing",
      name: article.category,
    },
  };
}
