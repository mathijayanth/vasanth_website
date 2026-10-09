import { db } from "@/lib/db";

export type ArticleCategoryOption = {
  slug: string;
  label: string;
};

export async function loadArticleCategories(): Promise<ArticleCategoryOption[]> {
  const rows = await db.category.findMany({
    orderBy: { name: "asc" },
    select: { name: true, slug: true },
  });

  return rows.map((row) => ({ slug: row.slug, label: row.name }));
}
