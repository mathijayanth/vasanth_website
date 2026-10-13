/** Import first in every test file: `config/env` validates process.env when it is first loaded. */
Object.assign(process.env, {
  NODE_ENV: "test",
  NEXT_PUBLIC_APP_URL: "http://localhost:3000",
  // Never contacted: tests replace every repository call that would hit the database.
  DATABASE_URL: "postgresql://test:test@127.0.0.1:1/unreachable_test_db",
  AUTH_SECRET: "test-only-secret-at-least-32-characters-long",
});
