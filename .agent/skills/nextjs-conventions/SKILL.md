---
name: nextjs-conventions
description: Use when creating or editing pages, components, layouts, or routes in this Next.js App Router project.
---

# Next.js conventions

- Next.js App Router, TypeScript strict mode, Tailwind CSS.
- Default to Server Components. Add "use client" only for state, effects, or browser APIs.
- Fetch data in Server Components; never fetch the same data twice in one request.
- Use next/image for all images and next/font for fonts.
- Folder layout (all under src/): app/ (routing only), features/<name>/{components,server,lib}, components/{ui,layout} (shared only), server/{db,http,email}, config/, lib/ (pure helpers), types/. See AGENTS.md.
- Reuse components from components/ui. Never duplicate card or button styling.
- Every page must have loading, empty, and error states.
- No inline styles. Use Tailwind classes and design tokens only.
- Before finishing any task run: tsc --noEmit, eslint, and npm run build. Do not report done if any fails.
