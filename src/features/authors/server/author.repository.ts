import "server-only";
import type { Prisma } from "@prisma/client";
import { db } from "@/server/db/client";

function buildSearchWhere(search?: string): Prisma.AuthorProfileWhereInput {
  if (!search) return {};
  return {
    OR: [
      { displayName: { contains: search, mode: "insensitive" } },
      { slug: { contains: search, mode: "insensitive" } },
      { specialty: { contains: search, mode: "insensitive" } },
    ],
  };
}

export const authorRepository = {
  findMany(params: { search?: string; skip: number; take: number }) {
    return db.authorProfile.findMany({
      where: buildSearchWhere(params.search),
      orderBy: { displayName: "asc" },
      skip: params.skip,
      take: params.take,
    });
  },

  count(search?: string) {
    return db.authorProfile.count({ where: buildSearchWhere(search) });
  },

  findById(id: string) {
    return db.authorProfile.findUnique({ where: { id } });
  },

  findBySlug(slug: string) {
    return db.authorProfile.findUnique({ where: { slug } });
  },

  async exists(id: string) {
    const row = await db.authorProfile.findUnique({ where: { id }, select: { id: true } });
    return Boolean(row);
  },

  async findIdByUserId(userId: string) {
    const row = await db.authorProfile.findUnique({ where: { userId }, select: { id: true } });
    return row?.id ?? null;
  },

  countPublishedArticles(authorId: string) {
    return db.article.count({ where: { authorId, status: "PUBLISHED" } });
  },
};
