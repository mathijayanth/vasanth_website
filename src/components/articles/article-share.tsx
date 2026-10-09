"use client";

import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";

type ArticleShareButtonsProps = {
  url: string;
  title: string;
};

export function ArticleShareButtons({ url, title }: ArticleShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [url]);

  const buttonClass =
    "inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-border bg-card px-3 text-sm font-medium text-foreground shadow-soft transition-colors hover:border-primary/30 hover:bg-background focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

  return (
    <div className="flex flex-wrap items-center gap-2" aria-label="Share article">
      <a
        className={buttonClass}
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        LinkedIn
      </a>
      <a
        className={buttonClass}
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Share
      </a>
      <button type="button" className={buttonClass} onClick={copyLink}>
        {copied ? "Copied" : "Copy link"}
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? "Link copied to clipboard" : ""}
      </span>
    </div>
  );
}

type ArticleShareButtonsPropsWithClass = ArticleShareButtonsProps & {
  className?: string;
};

export function ArticleShareBar(props: ArticleShareButtonsPropsWithClass) {
  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", props.className)}>
      <p className="text-sm font-medium text-muted">Share this article</p>
      <ArticleShareButtons url={props.url} title={props.title} />
    </div>
  );
}
