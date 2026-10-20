import Link from "next/link";
import { cn } from "@/lib/utils";

type ArticleBreadcrumbProps = {
  category: string;
  categorySlug: string;
  title: string;
};

export function ArticleBreadcrumb({
  category,
  categorySlug,
  title,
}: ArticleBreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-muted">
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
        </li>
        <li aria-hidden>/</li>
        <li>
          <Link href="/articles" className="hover:text-foreground">
            Articles
          </Link>
        </li>
        <li aria-hidden>/</li>
        <li>
          <Link
            href={`/articles?category=${categorySlug}`}
            className="hover:text-foreground"
          >
            {category}
          </Link>
        </li>
        <li aria-hidden>/</li>
        <li className="line-clamp-1 font-medium text-foreground" aria-current="page">
          {title}
        </li>
      </ol>
    </nav>
  );
}

type ArticlePlaceholderBannerProps = {
  className?: string;
};

export function ArticlePlaceholderBanner({ className }: ArticlePlaceholderBannerProps) {
  return (
    <div
      role="note"
      className={cn(
        "rounded-2xl border border-warning/40 bg-warning/10 px-4 py-3 text-sm text-foreground",
        className,
      )}
    >
      <strong className="font-semibold">Placeholder article.</strong>{" "}
      Demonstration content only — not verified medical advice.
    </div>
  );
}
