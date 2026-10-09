import "server-only";
import { notFound } from "@/server/http/errors";
import { buildPaginationMeta, toSkipTake } from "@/server/http/pagination";
import { looksLikeCuid } from "@/lib/ids";
import { toAuthorDto } from "../author.mapper";
import type { AuthorsListQuery } from "../author.schemas";
import { authorRepository } from "./author.repository";

export async function listAuthors(query: AuthorsListQuery) {
  const [items, total] = await Promise.all([
    authorRepository.findMany({ search: query.search, ...toSkipTake(query) }),
    authorRepository.count(query.search),
  ]);

  return {
    items: items.map(toAuthorDto),
    pagination: buildPaginationMeta(query, total),
  };
}

/** Accepts an author id or slug. */
export async function getAuthor(identifier: string) {
  const author = looksLikeCuid(identifier)
    ? await authorRepository.findById(identifier)
    : await authorRepository.findBySlug(identifier);

  if (!author) throw notFound("Author not found");

  const publishedArticleCount = await authorRepository.countPublishedArticles(author.id);
  return { ...toAuthorDto(author), publishedArticleCount };
}
