import type { UserRole } from "@prisma/client";
import { db } from "@/lib/db";
import {
  canDeleteArticles,
  canPublishArticles,
} from "@/lib/auth/permissions";

export async function getAuthorProfileIdForUser(userId: string) {
  return db.authorProfile.findUnique({
    where: { userId },
    select: { id: true },
  });
}

export async function userCanEditArticle(
  userId: string,
  role: UserRole,
  articleId: string,
): Promise<boolean> {
  if (role === "ADMIN" || role === "EDITOR") return true;
  if (role !== "AUTHOR") return false;

  const [profile, article] = await Promise.all([
    getAuthorProfileIdForUser(userId),
    db.article.findUnique({ where: { id: articleId }, select: { authorId: true } }),
  ]);

  return Boolean(profile && article && article.authorId === profile.id);
}

export async function userCanEditArticleOrThrow(
  userId: string,
  role: UserRole,
  articleId: string,
): Promise<boolean> {
  return userCanEditArticle(userId, role, articleId);
}

export function validateArticleMutationPermissions(
  role: UserRole,
  input: {
    status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
    authorId?: string;
  },
  options?: { ownAuthorId?: string | null },
): { ok: true } | { ok: false; message: string } {
  if (input.status && !canPublishArticles(role) && input.status === "PUBLISHED") {
    return { ok: false, message: "Only editors and admins can publish articles" };
  }

  if (role === "AUTHOR" && input.authorId && options?.ownAuthorId) {
    if (input.authorId !== options.ownAuthorId) {
      return { ok: false, message: "Authors can only assign their own author profile" };
    }
  }

  if (role === "AUTHOR" && input.authorId && !options?.ownAuthorId) {
    return { ok: false, message: "Author profile is not linked to this account" };
  }

  if (!canDeleteArticles(role) && input.status === "ARCHIVED") {
    // authors can archive own? skip - only editors archive
  }

  return { ok: true };
}
