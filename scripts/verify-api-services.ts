/**
 * Smoke-test the service layer against the seeded database.
 */
import {
  getArticle,
  listArticles,
  searchArticles,
} from "@/features/articles/server/article.service";
import { listCategories } from "@/features/categories/server/category.service";
import { db } from "@/server/db/client";

async function main() {
  const list = await listArticles({ page: 1, limit: 6, sort: "latest" });
  const article = await getArticle("calmer-way-to-read-clinical-evidence");
  const search = await searchArticles({ page: 1, limit: 5, q: "placeholder" });
  const categories = await listCategories({ page: 1, limit: 50 });

  console.log("API service verification OK", {
    listCount: list.items.length,
    listTotal: list.pagination.total,
    articleSlug: article.slug,
    searchTotal: search.pagination.total,
    categories: categories.pagination.total,
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
