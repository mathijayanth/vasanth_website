import { PageLink as Link } from "@/components/ui/page-link";
import Image from "next/image";
import { Avatar, Badge } from "@/components/ui";
import { formatArticleDate, formatReadingTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { ArticleSummary } from "../article.types";

type ArticleCardProps = {
  article: ArticleSummary;
  className?: string;
  priority?: boolean;
  highlight?: boolean;
};

export function ArticleCard({
  article,
  className,
  priority = false,
  highlight = false,
}: ArticleCardProps) {
  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-[box-shadow,border-color] duration-200 hover:border-primary/20 hover:shadow-elevated",
        className,
      )}
    >
      <Link
        href={`/articles/${article.slug}`}
        className="relative block aspect-[16/10] overflow-hidden"
      >
        <Image
          src={article.imageUrl}
          alt={article.imageAlt}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
      </Link>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          {highlight ? <Badge variant="primary">Featured</Badge> : null}
          <Badge variant="secondary">{article.category}</Badge>
          <span className="text-caption">
            {formatReadingTime(article.readingTimeMinutes)}
          </span>
        </div>
        <h3 className="mt-3 font-serif text-lg font-semibold leading-snug tracking-tight text-foreground">
          <Link
            href={`/articles/${article.slug}`}
            className="hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            {article.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-muted">
          {article.excerpt}
        </p>
        <ArticleMeta author={article.author} publishedAt={article.publishedAt} />
      </div>
    </article>
  );
}

type ArticleMetaProps = {
  author: ArticleSummary["author"];
  publishedAt: string;
};

export function ArticleMeta({ author, publishedAt }: ArticleMetaProps) {
  return (
    <div className="mt-5 flex items-center gap-3 border-t border-border pt-4">
      <Avatar
        src={author.avatarUrl}
        alt={author.name}
        fallback={author.name}
        size="sm"
      />
      <div className="min-w-0 text-sm">
        <Link
          href={`/authors/${author.slug}`}
          className="font-medium text-foreground hover:text-primary"
        >
          {author.name}
        </Link>
        <p className="text-caption">{formatArticleDate(publishedAt)}</p>
      </div>
    </div>
  );
}

type ArticleGridProps = {
  articles: ArticleSummary[];
  className?: string;
};

export function ArticleGrid({ articles, className }: ArticleGridProps) {
  return (
    <ul
      className={cn(
        "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3",
        className,
      )}
    >
      {articles.map((article, index) => (
        <li key={article.id}>
          <ArticleCard article={article} priority={index === 0} />
        </li>
      ))}
    </ul>
  );
}
