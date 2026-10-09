/** Runs once when the server starts: fail fast on missing or invalid configuration. */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("@/config/env");
  }
}
