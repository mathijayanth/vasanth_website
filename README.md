# VitalNotes — Medical Article Platform

Modern healthcare editorial platform built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **PostgreSQL**, and **Prisma**.

## Prerequisites

- Node.js 20+
- npm 10+
- Docker (recommended for local PostgreSQL) or local Postgres

## Getting started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Environment variables**

   ```bash
   cp .env.example .env
   cp .env.example .env.local
   ```

   Set at minimum:

   | Variable | Purpose |
   | -------- | ------- |
   | `DATABASE_URL` | PostgreSQL for Prisma and Server Components |
   | `AUTH_SECRET` | Session JWT signing — `openssl rand -base64 48` (min 16 chars in dev, 32 in production) |

   Variables are validated when the server starts (`src/config/env.ts`); the app refuses to boot with a clear message if one is missing. CI builds without secrets can set `SKIP_ENV_VALIDATION=1`.
   | `NEXT_PUBLIC_APP_URL` | Canonical URLs, password reset links |

3. **Database (local)**

   ```bash
   docker compose up -d
   npm run db:validate
   npm run db:migrate
   npm run db:seed
   npm run db:verify
   ```

4. **Run the dev server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Authentication

Sessions use an HTTP-only cookie (`vitalnotes_session`) backed by a signed JWT. The server always reloads the user from the database after verifying the token.

| Route | Description |
| ----- | ----------- |
| `/login` | Sign in (supports `?next=` redirect after login) |
| `/register` | Create a `USER` account |
| `/forgot-password` | Request a reset link |
| `/reset-password?token=…` | Set a new password |

**Seed accounts** (password from `SEED_ADMIN_PASSWORD` or default `ChangeMe-Dev-Only!`):

- `admin@placeholder.vitalnotes.local` — `ADMIN`
- `editor@placeholder.vitalnotes.local` — `EDITOR`

**Roles:** `ADMIN` (full access), `EDITOR` (publish/manage articles), `AUTHOR` (own drafts), `USER` (read/save).

**Protected areas:** `/admin/*` and mutating `/api/*` routes (except public auth and newsletter subscribe). Middleware enforces login; route handlers enforce role and resource rules.

**Password reset email:** Configure `RESEND_API_KEY` and `EMAIL_FROM` (verified sender in Resend) to send real mail in all environments. Without that, non-production responses may include a `resetUrl` in the JSON body and the server logs the link.

**Session revocation:** each token carries the user's `sessionVersion`. A password reset or `POST /api/auth/logout-all` increments it, which invalidates every existing session for that user. API routes and admin pages check the version against the database. The proxy only checks the token signature, so it cannot see revocations, but the admin layout re-checks and redirects to login. Tokens issued before this change have no version claim, so every user must sign in once after rollout.

**Rate limiting:** set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` to share limits across instances. Without them, or while Redis is unreachable, limits fall back to per-instance memory and `GET /api/health` reports `rateLimit: "memory"` or `"memory-fallback"`. Login allows 5 failed attempts per email per 15 minutes and forgot-password 3 requests per email per hour, both on top of the per-IP limits.

## Content data

- **`/articles` and `/articles/[slug]`** load **published** articles from PostgreSQL.
- Marketing homepage sections still use placeholder mock data until wired to the API.

## Scripts

| Command | Description |
| ------- | ----------- |
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript (`tsc --noEmit`) |
| `npm test` | Unit tests (`node:test` via `tsx`; no database or Redis needed) |
| `npm run db:validate` | Validate Prisma schema |
| `npm run db:migrate` | Create/apply migrations (dev) |
| `npm run db:seed` | Seed PLACEHOLDER data |
| `npm run db:verify` | Smoke-test DB queries |
| `npm run api:verify` | Smoke-test API service helpers |

## Project structure

```text
src/
  app/                    # Routing only
    (site)/               # Public pages: home, articles, authors, topics, legal
    (auth)/               # login, register, forgot/reset password
    (admin)/admin/        # Admin dashboard (protected)
    api/                  # Thin route handlers
  features/               # One folder per business area
    articles/             # components/, server/ (service, repository, policy), lib/, schemas, types
    auth/                 # session, permissions, password reset, forms
    authors/ categories/ newsletter/ home/
  components/
    ui/                   # Design system — import from @/components/ui
    layout/               # Header, footer, section header
  server/                 # Shared backend: db client, HTTP helpers, email
  config/                 # env.ts (validated secrets), site.ts (brand, nav)
  lib/                    # Pure helpers
  types/                  # Cross-feature types
  proxy.ts                # Auth gate for /admin and write APIs
  instrumentation.ts      # Validates env on server start
prisma/                   # Schema, migrations, seed
scripts/                  # Verification scripts
docs/                     # Playbooks and design docs
```

Backend requests flow **route handler → service → repository → Prisma**. Architecture rules are in [`AGENTS.md`](AGENTS.md); agent skills live in `.cursor/skills/` and `.agent/skills/`.

## Verify setup

```bash
npm run typecheck
npm run lint
npm run build
```

## License

Private — all rights reserved unless otherwise specified by the project owner.
