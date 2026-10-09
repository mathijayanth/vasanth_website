import type { ArticleStatus, UserRole } from "@prisma/client";
import {
  canDeleteArticles,
  canManageArticles,
  canPublishArticles,
  isStaffRole,
} from "@/features/auth/permissions";
import { forbidden } from "@/server/http/errors";

export function canViewDrafts(role?: UserRole): boolean {
  return role ? isStaffRole(role) : false;
}

export function assertCanManageArticles(role: UserRole): void {
  if (!canManageArticles(role)) {
    throw forbidden("You do not have permission to manage articles");
  }
}

export function assertCanDeleteArticles(role: UserRole): void {
  if (!canDeleteArticles(role)) {
    throw forbidden("You do not have permission to delete articles");
  }
}

/** Authors may only edit articles attached to their own author profile. */
export function assertCanEditArticle(
  role: UserRole,
  articleAuthorId: string,
  ownAuthorProfileId: string | null,
): void {
  if (role === "ADMIN" || role === "EDITOR") return;
  if (role === "AUTHOR" && ownAuthorProfileId && articleAuthorId === ownAuthorProfileId) return;
  throw forbidden("You can only edit your own articles");
}

export function assertMutationAllowed(
  role: UserRole,
  input: { status?: ArticleStatus; authorId?: string },
  ownAuthorProfileId: string | null,
): void {
  if (input.status === "PUBLISHED" && !canPublishArticles(role)) {
    throw forbidden("Only editors and admins can publish articles");
  }

  if (role === "AUTHOR" && input.authorId) {
    if (!ownAuthorProfileId) {
      throw forbidden("Author profile is not linked to this account");
    }
    if (input.authorId !== ownAuthorProfileId) {
      throw forbidden("Authors can only assign their own author profile");
    }
  }
}
