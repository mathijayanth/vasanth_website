import type { AuthorProfile } from "@prisma/client";

export function toAuthorDto(author: AuthorProfile) {
  return {
    id: author.id,
    slug: author.slug,
    displayName: author.displayName,
    bio: author.bio,
    title: author.title,
    specialty: author.specialty,
    avatarUrl: author.avatarUrl,
    createdAt: author.createdAt,
    updatedAt: author.updatedAt,
  };
}

export type AuthorDto = ReturnType<typeof toAuthorDto>;
