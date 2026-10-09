/**
 * Centralized environment access. Expand in later phases (database, auth).
 * Never import secrets into Client Components.
 */
export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  /** PostgreSQL connection string — Phase 6 */
  databaseUrl: process.env.DATABASE_URL,
  /** Auth secret — future phase */
  authSecret: process.env.AUTH_SECRET,
} as const;

export function assertServerEnv(): void {
  if (typeof window !== "undefined") {
    throw new Error("env helpers must only run on the server");
  }
}
