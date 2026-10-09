"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { ContentHeadingLevel } from "@/types/article-content";

export type TocHeading = {
  id: string;
  level: ContentHeadingLevel;
  text: string;
};

type TableOfContentsProps = {
  headings: TocHeading[];
};

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  if (headings.length === 0) return null;

  const list = (
    <ul className="space-y-2 text-sm">
      {headings.map((heading) => (
        <li
          key={heading.id}
          className={cn(
            heading.level === 3 && "pl-3",
            heading.level === 4 && "pl-5",
          )}
        >
          <a
            href={`#${heading.id}`}
            className="text-muted transition-colors hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            onClick={() => setMobileOpen(false)}
          >
            {heading.text}
          </a>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      <div className="lg:hidden">
        <button
          type="button"
          aria-expanded={mobileOpen}
          aria-controls="mobile-toc"
          onClick={() => setMobileOpen((open) => !open)}
          className="flex w-full items-center justify-between rounded-2xl border border-border bg-card px-4 py-3 text-left text-sm font-medium shadow-soft"
        >
          Table of contents
          <span aria-hidden>{mobileOpen ? "−" : "+"}</span>
        </button>
        {mobileOpen ? (
          <nav
            id="mobile-toc"
            aria-label="Table of contents"
            className="mt-3 rounded-2xl border border-border bg-card p-4 shadow-soft"
          >
            {list}
          </nav>
        ) : null}
      </div>

      <nav
        aria-label="Table of contents"
        className="hidden lg:block lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:pr-2"
      >
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">
          On this page
        </p>
        <div className="mt-4">{list}</div>
      </nav>
    </>
  );
}

type KeyTakeawayBoxProps = {
  items: string[];
};

export function KeyTakeawayBox({ items }: KeyTakeawayBoxProps) {
  if (items.length === 0) return null;

  return (
    <aside
      aria-labelledby="key-takeaways-heading"
      className="rounded-2xl border border-secondary/30 bg-secondary/5 p-5 sm:p-6"
    >
      <h2 id="key-takeaways-heading" className="text-lg font-semibold text-foreground">
        Key takeaways
      </h2>
      <ul className="mt-3 space-y-2 text-sm leading-relaxed text-foreground/90">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span aria-hidden className="mt-1 text-secondary">
              •
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
