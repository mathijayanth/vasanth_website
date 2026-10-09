import type { Category } from "@prisma/client";
import type { CategoryOption } from "./category.types";

export function toCategoryDto(category: Category) {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
  };
}

export function toCategoryOption(category: Pick<Category, "name" | "slug">): CategoryOption {
  return { slug: category.slug, label: category.name };
}

export type CategoryDto = ReturnType<typeof toCategoryDto>;
