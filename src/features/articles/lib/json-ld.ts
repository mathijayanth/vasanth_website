import type { ArticleDetail } from "../article.types";
import { siteConfig } from "@/config/site";

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
      url: `${siteConfig.url}/authors/${article.author.slug}`,
    },
    publisher: {
      "@type": "Organization",
      name: "VMed Research",
      url: siteConfig.url,
    },
    mainEntityOfPage: canonicalUrl,
    about: {
      "@type": "Thing",
      name: article.category,
    },
  };
}
