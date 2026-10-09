# Project: Medical Blog

Stack: Next.js (App Router), TypeScript, Tailwind CSS, PostgreSQL, Prisma, Zod.

- Follow the skills in `.agent/skills` (or `.cursor/skills`) for the relevant task.
- Work one phase at a time. Produce a short plan first and wait for approval before writing code.
- Never expose secrets. Use `.env.example` with placeholders only.
- Run `tsc --noEmit`, `eslint`, and `npm run build` before reporting any task complete.
- Never deploy or run destructive database commands without confirmation.

## Architecture

All source lives in `src/`. Code is grouped by feature, not by file type.

| Folder | Contains |
| ------ | -------- |
| `app/` | Routing only: pages, layouts, route handlers. Route groups `(site)`, `(auth)`, `(admin)` do not change URLs. |
| `features/<name>/` | Everything for one business area: `components/`, `server/`, `lib/`, `*.schemas.ts`, `*.types.ts`, `*.mapper.ts`, `index.ts`. |
| `components/ui`, `components/layout` | Shared design system and site chrome only. Feature UI goes in its feature. |
| `server/` | Shared backend: `db/client.ts`, `http/` (errors, responses, parsing, pagination, rate limit), `email/`. |
| `config/` | `env.ts` (Zod-validated, server-only) and `site.ts` (public brand, nav, URLs). |
| `lib/` | Pure, framework-free helpers. |
| `proxy.ts` | Coarse auth gate for `/admin` and write APIs (Next 16 replacement for middleware). |

Rules:

- Request flow is route handler → service → repository → Prisma. Handlers parse input, call one service, return `apiSuccess`. They are wrapped in `withErrorHandling`.
- Services hold business rules and permission checks and throw `AppError` (`server/http/errors.ts`) for expected failures. Never return error responses from services.
- Only `*.repository.ts` files import `@/server/db/client`.
- Files in `server/` and `features/*/server/` start with `import "server-only"`.
- Import a feature's UI and types from its `index.ts` (`@/features/articles`). Import server code, schemas, and `permissions` by explicit path. Inside a feature, use relative imports.
- Read secrets through `@/config/env`, never `process.env` (exception: edge-safe `features/auth/session-token.ts`).
- Naming: kebab-case files; `*.service.ts`, `*.repository.ts`, `*.policy.ts`, `*.schemas.ts`, `*.mapper.ts`, `*.types.ts`.
