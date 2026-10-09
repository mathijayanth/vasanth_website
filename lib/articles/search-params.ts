export type ArticleSort = "latest";

export type ArticlesSearchParams = {
  search?: string;
  category?: string;
  page?: string;
  sort?: string;
};

export type ParsedArticlesQuery = {
  search: string;
  category: string;
  page: number;
  sort: ArticleSort;
};

export function parseArticlesQuery(
  params: ArticlesSearchParams,
): ParsedArticlesQuery {
  const pageRaw = Number.parseInt(params.page ?? "1", 10);
  const page = Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1;
  const sort: ArticleSort = params.sort === "latest" || !params.sort ? "latest" : "latest";

  return {
    search: (params.search ?? "").trim(),
    category: (params.category ?? "").trim(),
    page,
    sort,
  };
}

export type BuildArticlesUrlInput = {
  search?: string;
  category?: string;
  page?: number;
  sort?: ArticleSort;
};

export function buildArticlesUrl(input: BuildArticlesUrlInput = {}): string {
  const sp = new URLSearchParams();

  if (input.search?.trim()) {
    sp.set("search", input.search.trim());
  }
  if (input.category?.trim()) {
    sp.set("category", input.category.trim());
  }
  if (input.page && input.page > 1) {
    sp.set("page", String(input.page));
  }
  if (input.sort && input.sort !== "latest") {
    sp.set("sort", input.sort);
  }

  const query = sp.toString();
  return query ? `/articles?${query}` : "/articles";
}
