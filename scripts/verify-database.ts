/**
 * Smoke-test Prisma queries against the seeded database.
 */
import { db } from "../lib/db";

async function main() {
  const [categoryCount, authorCount, articleCount, tagCount] = await Promise.all([
    db.category.count(),
    db.authorProfile.count(),
    db.article.count({ where: { status: "PUBLISHED" } }),
    db.tag.count(),
  ]);

  const featured = await db.article.findFirst({
    where: { slug: "calmer-way-to-read-clinical-evidence", status: "PUBLISHED" },
    select: {
      id: true,
      title: true,
      slug: true,
      category: { select: { slug: true, name: true } },
      author: { select: { slug: true, displayName: true } },
      tags: { take: 5, select: { tag: { select: { slug: true } } } },
      references: { take: 3, orderBy: { sortOrder: "asc" } },
      medicalReviews: {
        take: 1,
        select: { reviewer: { select: { displayName: true } }, isVerified: true },
      },
    },
  });

  const page = await db.article.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    take: 6,
    skip: 0,
    select: {
      id: true,
      title: true,
      slug: true,
      publishedAt: true,
      category: { select: { name: true } },
      author: { select: { displayName: true } },
    },
  });

  console.log("Database verification OK");
  console.log({
    categoryCount,
    authorCount,
    publishedArticleCount: articleCount,
    tagCount,
    featuredArticle: featured?.title ?? null,
    listingSampleSize: page.length,
  });

  if (categoryCount < 1 || authorCount < 1 || articleCount < 1 || tagCount < 1) {
    throw new Error("Seed data missing — run npm run db:seed");
  }

  if (!featured) {
    throw new Error("Expected seeded featured article slug not found");
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
