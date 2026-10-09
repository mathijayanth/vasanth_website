# Antigravity & Cursor Skills: Medical Blog Project

Reusable instruction files (Agent Skills) for building the medical blog with Antigravity or Cursor. Each skill is a folder containing a `SKILL.md` file.

---

## 1. Where to put the skills

### Antigravity

A skill is a directory with a `SKILL.md` file. Everything else (scripts, references, assets) is optional.

| Scope | Path |
|---|---|
| Global (all projects) | `~/.gemini/antigravity/skills/<skill-name>/SKILL.md` |
| Project only | `./.agent/skills/<skill-name>/SKILL.md` |

- Workspace skills override global skills with the same name.
- After adding skills, restart Antigravity or start a new agent session.
- On Windows/WSL2, make sure you use the path the app actually reads (for example `/mnt/c/Users/<you>/.gemini/antigravity/skills/`).

### Cursor

Cursor also uses skills as directories with a `SKILL.md` file. Suggested path:

```
.cursor/skills/<skill-name>/SKILL.md
```

Confirm this path in your Cursor version's docs. If skills are not picked up, use `.cursor/rules/*.mdc` or `AGENTS.md` instead.

### Shared across tools: AGENTS.md

Put general conventions in `AGENTS.md` at the project root. It works across Antigravity, Claude Code, Cursor, and other AI tools. Use skills for task-specific playbooks.

---

## 2. Project folder layout

```text
medical-blog/
├── AGENTS.md
├── .agent/
│   └── skills/
│       ├── nextjs-conventions/SKILL.md
│       ├── prisma-postgres/SKILL.md
│       ├── api-and-auth/SKILL.md
│       ├── medical-content-safety/SKILL.md
│       └── design-system/SKILL.md
└── .cursor/
    └── skills/            # same five folders, if using Cursor
```

Quick setup (run from the project root):

```bash
mkdir -p .agent/skills/{nextjs-conventions,prisma-postgres,api-and-auth,medical-content-safety,design-system}
# Cursor (optional): copy the same folders
mkdir -p .cursor/skills && cp -r .agent/skills/* .cursor/skills/
```

---

## 3. AGENTS.md (root of project)

```markdown
# Project: Medical Blog

Stack: Next.js (App Router), TypeScript, Tailwind CSS, PostgreSQL, Prisma, Zod.

- Follow the skills in .agent/skills (or .cursor/skills) for the relevant task.
- Work one phase at a time. Produce a short plan first and wait for approval before writing code.
- Never expose secrets. Use .env.example with placeholders only.
- Run tsc --noEmit, eslint, and npm run build before reporting any task complete.
- Never deploy or run destructive database commands without confirmation.
```

---

## 4. The skills

### 4.1 `nextjs-conventions`

Path: `.agent/skills/nextjs-conventions/SKILL.md`

```markdown
---
name: nextjs-conventions
description: Use when creating or editing pages, components, layouts, or routes in this Next.js App Router project.
---

# Next.js conventions

- Next.js App Router, TypeScript strict mode, Tailwind CSS.
- Default to Server Components. Add "use client" only for state, effects, or browser APIs.
- Fetch data in Server Components; never fetch the same data twice in one request.
- Use next/image for all images and next/font for fonts.
- Folder layout: app/, components/{ui,layout,articles,admin,forms}, lib/, prisma/, types/.
- Reuse components from components/ui. Never duplicate card or button styling.
- Every page must have loading, empty, and error states.
- No inline styles. Use Tailwind classes and design tokens only.
- Before finishing any task run: tsc --noEmit, eslint, and npm run build. Do not report done if any fails.
```

### 4.2 `prisma-postgres`

Path: `.agent/skills/prisma-postgres/SKILL.md`

```markdown
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
```

### 4.3 `api-and-auth`

Path: `.agent/skills/api-and-auth/SKILL.md`

```markdown
---
name: api-and-auth
description: Use when building route handlers, server actions, authentication, or admin-protected features.
---

# API and auth rules

- Validate all input with Zod. Never trust client data.
- Response format: { success: true, data, message } or { success: false, error: { code, message } }.
- Check authentication AND role on the server for every write endpoint. Middleware alone is not enough.
- Roles: start with ADMIN and EDITOR only unless told otherwise.
- Hash passwords with a vetted library (argon2 or bcrypt). Never log secrets.
- Return generic error messages in production; log details server-side only.
- Rate-limit public write endpoints (newsletter, login) using a shared store such as Upstash Redis, since serverless has no shared memory.
- Validate uploads by MIME type, extension, and size.
```

### 4.4 `medical-content-safety`

Path: `.agent/skills/medical-content-safety/SKILL.md`

```markdown
---
name: medical-content-safety
description: Use whenever writing or editing article content, seed data, disclaimers, or anything that makes health claims.
---

# Medical content safety

- Never invent medical facts, statistics, doses, or study citations.
- Placeholder articles must be labeled as placeholders in the title or a visible banner.
- Show "Medically reviewed by" only when a real reviewer is attached in the database.
- Every article page includes a medical disclaimer: informational, not a substitute for professional advice.
- Sanitize all rich text before rendering (DOMPurify, or render from the editor's JSON). Never use dangerouslySetInnerHTML with unsanitized content.
- Do not publish drafts in sitemap, search, or public APIs. Set noindex on /admin.
```

### 4.5 `design-system`

Path: `.agent/skills/design-system/SKILL.md`

```markdown
---
name: design-system
description: Use when building or styling UI components, pages, or layouts.
---

# Design system

- Premium modern healthcare editorial look: whitespace, rounded cards, subtle borders, soft shadows.
- Tokens: background #F8FAFC, primary #2563EB, secondary #14B8A6, text #0F172A, muted #64748B, border #E2E8F0.
- Avoid heavy blue washes, clutter, and Bootstrap-style UI.
- Mobile-first. Test at 320, 375, 768, 1024, 1440. No horizontal scroll.
- Touch targets at least 44px. Visible focus states. Semantic HTML and alt text.
- Tables scroll horizontally on mobile inside their own container.
```

---

## 5. How to use them with your phase prompts

1. Create the folders and files above, add `AGENTS.md`, and commit them to git.
2. Open a new agent session so the skills get indexed.
3. Run your phase prompts one at a time. The prompts can now be shorter, since the rules live in the skills instead of being repeated in every prompt.
4. Commit after each phase and review the output (especially the Prisma schema) before moving on.
5. If an agent ignores a skill, make its `description` line more specific about when to use it. That line is what the agent matches against your task.

## 6. Recommended build order (MVP)

Phase 1 (setup) → 2 (design system) → 3 (homepage) → 4 (article listing) → 5 (article page) → 6 (database) → 7 (API) → authentication (keep Admin + Editor only) → 9/10 (admin dashboard + editor, merged) → 17 (deployment).

Add search, SEO, security audit, performance, and testing passes after the MVP works. Cut comments, article views, and saved articles unless the client asks for them.

## 7. Before you start

- Decide your tools up front: auth library (Auth.js or Better Auth), rich text editor (Tiptap), rate-limit store (Upstash Redis).
- Treat seeded articles as placeholders; real content should come from the client's doctors or reviewers.
- Confirm scope with the client. If they mainly need to publish articles, a headless CMS (Sanity, Payload) or WordPress may be faster than a custom admin.
