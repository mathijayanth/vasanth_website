---
name: design-system
description: Use when building or styling UI components, pages, or layouts.
---

# Design system

- Premium modern healthcare editorial look: whitespace, rounded cards, subtle borders, soft shadows.
- Tokens: background #F8F5EF, primary #51105F, secondary #7D368C, accent #D0BDA1, text #3A1844, muted #6F5D68, border #E6DDD0, card #FFFFFF, success #16A34A, warning #F59E0B, error #DC2626. CSS vars in `app/globals.css`; TS mirror in `lib/design-tokens.ts`. Shared UI classes in `components/ui/primitives.ts`.
- Typography utilities: `text-display`, `text-title`, `text-subtitle`, `text-body`, `text-caption`, `text-overline`.
- Import UI from `@/components/ui` only; do not duplicate field/button/card styles.
- Avoid heavy blue washes, clutter, and Bootstrap-style UI.
- Mobile-first. Test at 320, 375, 768, 1024, 1440. No horizontal scroll.
- Touch targets at least 44px. Visible focus states. Semantic HTML and alt text.
- Tables scroll horizontally on mobile inside their own container.
