---
name: prisma-postgres
description: Use when changing the database schema, writing Prisma queries, migrations, or seed data.
---

# Prisma + PostgreSQL rules

- Single Prisma client instance in lib/db.ts (global singleton for dev hot reload).
- Credentials only from env vars. Never commit .env.
- Always add indexes for slug, status, categoryId, authorId, publishedAt.
- Use select/include deliberately; never return password hashes or internal fields.
- Paginate every list query. No unbounded findMany.
- Propose schema changes and wait for approval before running a migration.
- Seed data must be clearly marked as PLACEHOLDER content, never real medical claims.
- After schema change: prisma validate, prisma migrate dev, then run the build.
