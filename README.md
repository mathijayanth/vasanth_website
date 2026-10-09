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
   | `AUTH_SECRET` | Session JWT signing (min 16 characters) |
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
| `npm run db:validate` | Validate Prisma schema |
| `npm run db:migrate` | Create/apply migrations (dev) |
| `npm run db:seed` | Seed PLACEHOLDER data |
| `npm run db:verify` | Smoke-test DB queries |
| `npm run api:verify` | Smoke-test API service helpers |

## Project structure

```text
app/                    # App Router routes
  articles/             # Listing + [slug] detail (DB-backed)
  authors/              # Listing + [slug] detail
  login/ register/      # Auth pages
  admin/                # Dashboard (protected)
  api/                  # Route handlers + auth
components/
  ui/                   # Design system
  auth/                 # Login/register forms
lib/
  auth/                 # Session, permissions, password reset
  articles/             # Query helpers + DB mappers
  api/                  # API responses and services
prisma/                 # Schema, migrations, seed
```

Agent skills live in `.cursor/skills/` and `.agent/skills/` — see `AGENTS.md`.

## Verify setup

```bash
npm run typecheck
npm run lint
npm run build
```

## License

Private — all rights reserved unless otherwise specified by the project owner.
