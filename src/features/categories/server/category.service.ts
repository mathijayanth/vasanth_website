import "server-only";
import { env } from "@/config/env";
import type { SessionUser } from "@/features/auth/server/session";
import { canManageCategories } from "@/features/auth/permissions";
import { conflict, forbidden } from "@/server/http/errors";
import { buildPaginationMeta, toSkipTake } from "@/server/http/pagination";
import { toCategoryDto, toCategoryOption } from "../category.mapper";
import type { CategoriesListQuery, CreateCategoryInput } from "../category.schemas";
import { categoryRepository } from "./category.repository";

export async function listCategories(query: CategoriesListQuery) {
  const [items, total] = await Promise.all([
    categoryRepository.findMany({ search: query.search, ...toSkipTake(query) }),
    categoryRepository.count(query.search),
  ]);

  return {
    items: items.map(toCategoryDto),
    pagination: buildPaginationMeta(query, total),
  };
}

export async function getCategoryOptions() {
  if (env.uiPreview) return [];
  const rows = await categoryRepository.findMany({});
  return rows.map(toCategoryOption);
}

export async function createCategory(input: CreateCategoryInput, user: SessionUser) {
  if (!canManageCategories(user.role)) {
    throw forbidden("You do not have permission to create categories");
  }
  if (!(await categoryRepository.isSlugAvailable(input.slug))) {
    throw conflict("Category slug already exists");
  }

  const category = await categoryRepository.create(input);
  return toCategoryDto(category);
}
