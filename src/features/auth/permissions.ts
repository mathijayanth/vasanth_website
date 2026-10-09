import type { UserRole } from "@prisma/client";
import { ADMIN_SECTION_EDITOR_ROLES, STAFF_ROLES } from "./auth.constants";

export function isStaffRole(role: UserRole): boolean {
  return (STAFF_ROLES as readonly string[]).includes(role);
}

export function canAccessAdmin(role: UserRole): boolean {
  return isStaffRole(role);
}

export function canManageCategories(role: UserRole): boolean {
  return role === "ADMIN" || role === "EDITOR";
}

export function canManageAuthors(role: UserRole): boolean {
  return role === "ADMIN" || role === "EDITOR";
}

export function canManageArticles(role: UserRole): boolean {
  return isStaffRole(role);
}

export function canPublishArticles(role: UserRole): boolean {
  return role === "ADMIN" || role === "EDITOR";
}

export function canDeleteArticles(role: UserRole): boolean {
  return role === "ADMIN" || role === "EDITOR";
}

export function canAccessAdminPath(pathname: string, role: UserRole): boolean {
  if (!canAccessAdmin(role)) return false;

  if (
    pathname.startsWith("/admin/categories") ||
    pathname.startsWith("/admin/authors")
  ) {
    return (ADMIN_SECTION_EDITOR_ROLES as readonly string[]).includes(role);
  }

  return true;
}

export function assertPublishStatusAllowed(
  role: UserRole,
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED",
): boolean {
  if (!status || status === "DRAFT" || status === "ARCHIVED") return true;
  return canPublishArticles(role);
}
