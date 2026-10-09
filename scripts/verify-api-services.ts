/**
 * Smoke-test API service queries (database-backed).
 */
import { listArticles, findArticleBySlugOrId, searchArticles } from "@/lib/api/services/articles";
import { db } from "@/lib/db";

async function main() {
  const list = await listArticles({
    pagination: { page: 1, limit: 6 },
    includeDrafts: false,
    sort: "latest",
  });

  const article = await findArticleBySlugOrId("calmer-way-to-read-clinical-evidence", {
    includeDrafts: false,
  });

  const search = await searchArticles({
    pagination: { page: 1, limit: 5 },
    q: "placeholder",
  });

  const categories = await db.category.count();

  console.log("API service verification OK", {
    listCount: list.items.length,
    listTotal: list.pagination.total,
    articleSlug: article?.slug ?? null,
    searchTotal: search.pagination.total,
    categories,
  });

  if (!article) throw new Error("Expected seeded article via API services");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
