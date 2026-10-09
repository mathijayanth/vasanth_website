import "server-only";
import type { Prisma } from "@prisma/client";
import { db } from "@/server/db/client";

function buildSearchWhere(search?: string): Prisma.CategoryWhereInput {
  if (!search) return {};
  return {
    OR: [
      { name: { contains: search, mode: "insensitive" } },
      { slug: { contains: search, mode: "insensitive" } },
    ],
  };
}

export const categoryRepository = {
  findMany(params: { search?: string; skip?: number; take?: number }) {
    return db.category.findMany({
      where: buildSearchWhere(params.search),
      orderBy: { name: "asc" },
      skip: params.skip,
      take: params.take,
    });
  },

  count(search?: string) {
    return db.category.count({ where: buildSearchWhere(search) });
  },

  async exists(id: string) {
    const row = await db.category.findUnique({ where: { id }, select: { id: true } });
    return Boolean(row);
  },

  async isSlugAvailable(slug: string) {
    const row = await db.category.findUnique({ where: { slug }, select: { id: true } });
    return !row;
  },

  create(data: { name: string; slug: string; description?: string | null }) {
    return db.category.create({
      data: { name: data.name, slug: data.slug, description: data.description ?? null },
    });
  },
};
