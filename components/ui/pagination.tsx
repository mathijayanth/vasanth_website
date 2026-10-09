import Link from "next/link";
import { cn } from "@/lib/utils";
import { focusRing, touchTarget, transitionBase } from "./primitives";

export type PaginationLink = {
  href: string;
  label: string;
  isCurrent?: boolean;
};

type PaginationProps = {
  prev?: PaginationLink | null;
  next?: PaginationLink | null;
  pages: PaginationLink[];
  className?: string;
  "aria-label"?: string;
};

const pageLinkClass = cn(
  touchTarget,
  "inline-flex min-w-11 items-center justify-center rounded-xl border border-border bg-card px-3 text-sm font-medium text-foreground shadow-soft",
  transitionBase,
  focusRing,
  "hover:border-primary/30 hover:bg-background",
);

export function Pagination({
  prev,
  next,
  pages,
  className,
  "aria-label": ariaLabel = "Pagination",
}: PaginationProps) {
  return (
    <nav aria-label={ariaLabel} className={cn("w-full", className)}>
      <ul className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        <li>
          {prev ? (
            <Link
              href={prev.href}
              className={cn(pageLinkClass, !prev.href && "pointer-events-none opacity-50")}
              aria-label={prev.label}
            >
              ← Prev
            </Link>
          ) : (
            <span
              className={cn(pageLinkClass, "pointer-events-none opacity-40")}
              aria-hidden
            >
              ← Prev
            </span>
          )}
        </li>
        {pages.map((page) => (
          <li key={page.href}>
            <Link
              href={page.href}
              aria-current={page.isCurrent ? "page" : undefined}
              className={cn(
                pageLinkClass,
                page.isCurrent &&
                  "border-primary bg-primary text-white hover:bg-primary/90 hover:text-white",
              )}
            >
              {page.label}
            </Link>
          </li>
        ))}
        <li>
          {next ? (
            <Link href={next.href} className={pageLinkClass} aria-label={next.label}>
              Next →
            </Link>
          ) : (
            <span
              className={cn(pageLinkClass, "pointer-events-none opacity-40")}
              aria-hidden
            >
              Next →
            </span>
          )}
        </li>
      </ul>
    </nav>
  );
}
