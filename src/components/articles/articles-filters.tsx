"use client";

import { FormEvent, useCallback, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Select } from "@/components/ui";
import { fieldStyles } from "@/components/ui/primitives";
import {
  buildArticlesUrl,
  type ArticleSort,
} from "@/lib/articles/search-params";
import { cn } from "@/lib/utils";

type CategoryOption = {
  slug: string;
  label: string;
};

type ArticlesFiltersProps = {
  search: string;
  category: string;
  sort: ArticleSort;
  categories: readonly CategoryOption[];
};

export function ArticlesFilters({
  search,
  category,
  sort,
  categories,
}: ArticlesFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  const pushQuery = useCallback(
    (next: { search?: string; category?: string; sort?: ArticleSort; page?: number }) => {
      const href = buildArticlesUrl({
        search: next.search ?? search,
        category: next.category ?? category,
        sort: next.sort ?? sort,
        page: next.page ?? 1,
      });
      startTransition(() => {
        router.push(href, { scroll: false });
      });
    },
    [router, search, category, sort],
  );

  function onSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const nextSearch = String(formData.get("search") ?? "").trim();
    pushQuery({ search: nextSearch, page: 1 });
  }

  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-4 shadow-soft sm:p-5",
        pending && "opacity-80",
      )}
    >
      <form
        onSubmit={onSearchSubmit}
        className="flex flex-col gap-4 lg:flex-row lg:items-end"
        role="search"
        aria-label="Filter articles"
      >
        <div className="flex-1 space-y-1.5">
          <label htmlFor="articles-search" className="text-sm font-medium text-foreground">
            Search
          </label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              id="articles-search"
              name="search"
              type="search"
              defaultValue={search}
              placeholder="Search titles and summaries…"
              className={cn(fieldStyles, "flex-1")}
              autoComplete="off"
            />
            <button
              type="submit"
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-medium text-white hover:bg-primary/90"
            >
              Search
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:w-[28rem]">
          <Select
            id="articles-category"
            label="Category"
            value={category}
            onChange={(event) => {
              pushQuery({ category: event.target.value, page: 1 });
            }}
          >
            <option value="">All categories</option>
            {categories.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.label}
              </option>
            ))}
          </Select>

          <Select
            id="articles-sort"
            label="Sort"
            value={sort}
            onChange={(event) => {
              pushQuery({ sort: event.target.value as ArticleSort, page: 1 });
            }}
          >
            <option value="latest">Latest</option>
          </Select>
        </div>
      </form>

      {pathname === "/articles" && !search && !category ? (
        <p className="mt-4 text-caption">
          Tip: search by keyword or filter by category. Results update in the URL
          for sharing and bookmarking.
        </p>
      ) : null}
    </div>
  );
}
