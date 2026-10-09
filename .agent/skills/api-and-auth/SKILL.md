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
