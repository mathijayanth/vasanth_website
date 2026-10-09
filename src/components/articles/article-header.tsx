import Link from "next/link";
import Image from "next/image";
import { Avatar, Badge } from "@/components/ui";
import { formatArticleDate, formatReadingTime } from "@/lib/format";
import type { ArticleDetail } from "@/types/article-content";
import { ArticleShareBar } from "./article-share";

type ArticleHeaderProps = {
  article: ArticleDetail;
  shareUrl: string;
};

export function ArticleHeader({ article, shareUrl }: ArticleHeaderProps) {
  return (
    <header className="max-w-3xl">
      <Link
        href={`/topics/${article.categorySlug}`}
        className="inline-flex focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <Badge variant="secondary">{article.category}</Badge>
      </Link>
      <h1 className="text-display mt-4">{article.title}</h1>
      <p className="text-subtitle mt-4">{article.excerpt}</p>

      <div className="mt-6 flex flex-col gap-4 border-y border-border py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Avatar
            src={article.author.avatarUrl}
            alt={article.author.name}
            fallback={article.author.name}
            size="md"
          />
          <div>
            <Link
              href={`/authors/${article.author.slug}`}
              className="font-semibold text-foreground hover:text-primary"
            >
              {article.author.name}
            </Link>
            {article.author.title ? (
              <p className="text-caption">{article.author.title}</p>
            ) : null}
          </div>
        </div>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:text-right">
          <div>
            <dt className="text-caption">Published</dt>
            <dd className="font-medium">{formatArticleDate(article.publishedAt)}</dd>
          </div>
          <div>
            <dt className="text-caption">Updated</dt>
            <dd className="font-medium">{formatArticleDate(article.updatedAt)}</dd>
          </div>
          <div className="col-span-2 sm:col-span-1 sm:col-start-2">
            <dt className="text-caption">Reading time</dt>
            <dd className="font-medium">
              {formatReadingTime(article.readingTimeMinutes)}
            </dd>
          </div>
        </dl>
      </div>

      <ArticleShareBar
        className="mt-6"
        url={shareUrl}
        title={article.title}
      />
    </header>
  );
}

type ArticleHeroImageProps = {
  src: string;
  alt: string;
  priority?: boolean;
};

export function ArticleHeroImage({ src, alt, priority }: ArticleHeroImageProps) {
  return (
    <figure className="relative mt-8 aspect-[16/9] overflow-hidden rounded-3xl border border-border bg-card shadow-card">
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="(max-width: 1024px) 100vw, 896px"
        className="object-cover"
      />
    </figure>
  );
}
