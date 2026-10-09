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
