import { PageLink as Link } from "@/components/ui/page-link";
import Image from "next/image";
import { Badge } from "@/components/ui";
import { ArticleMeta } from "./article-card";
import { formatReadingTime } from "@/lib/format";
import type { ArticleSummary } from "../article.types";

type FeaturedArticleProps = {
  article: ArticleSummary;
};

export function FeaturedArticle({ article }: FeaturedArticleProps) {
  return (
    <article className="overflow-hidden rounded-3xl border border-border bg-card shadow-card lg:grid lg:grid-cols-2">
      <Link
        href={`/articles/${article.slug}`}
        className="relative block min-h-[16rem] lg:min-h-full"
      >
        <Image
          src={article.imageUrl}
          alt={article.imageAlt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-foreground/10" />
      </Link>
      <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
        <p className="text-overline">Featured</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Badge variant="primary">{article.category}</Badge>
          <span className="text-caption">
            {formatReadingTime(article.readingTimeMinutes)}
          </span>
        </div>
        <h2 className="mt-4 font-serif text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
          <Link
            href={`/articles/${article.slug}`}
            className="hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            {article.title}
          </Link>
        </h2>
        <p className="mt-4 text-body text-muted">{article.excerpt}</p>
        <ArticleMeta author={article.author} publishedAt={article.publishedAt} />
        <Link
          href={`/articles/${article.slug}`}
          className="mt-6 inline-flex min-h-11 items-center text-sm font-semibold text-primary hover:underline"
        >
          Read featured article →
        </Link>
      </div>
    </article>
  );
}
