import { buildArticlesUrl } from "@/lib/articles/search-params";
import type { PaginationLink } from "@/components/ui/pagination";

type PaginationInput = {
  page: number;
  totalPages: number;
  search: string;
  category: string;
  sort: "latest";
};

export function buildArticlesPaginationLinks(
  input: PaginationInput,
): {
  prev: PaginationLink | null;
  next: PaginationLink | null;
  pages: PaginationLink[];
} {
  const base = {
    search: input.search,
    category: input.category,
    sort: input.sort,
  };

  const pages: PaginationLink[] = Array.from(
    { length: input.totalPages },
    (_, index) => {
      const pageNumber = index + 1;
      return {
        href: buildArticlesUrl({ ...base, page: pageNumber }),
        label: String(pageNumber),
        isCurrent: pageNumber === input.page,
      };
    },
  );

  return {
    prev:
      input.page > 1
        ? {
            href: buildArticlesUrl({ ...base, page: input.page - 1 }),
            label: "Previous page",
          }
        : null,
    next:
      input.page < input.totalPages
        ? {
            href: buildArticlesUrl({ ...base, page: input.page + 1 }),
            label: "Next page",
          }
        : null,
    pages,
  };
}
