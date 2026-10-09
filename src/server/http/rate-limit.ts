import { AppError } from "./errors";

const memoryStore = new Map<string, { count: number; resetAt: number }>();

function consume(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = memoryStore.get(key);
  if (!entry || entry.resetAt <= now) {
    memoryStore.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count += 1;
  return true;
}

type RateLimitOptions = { bucket: string; limit: number; windowMs: number };

/**
 * Throws RATE_LIMITED when the caller exceeds the limit.
 * In-memory store: per-instance only, not shared across serverless instances.
 */
export function enforceRateLimit(request: Request, options: RateLimitOptions): void {
  const key = `${options.bucket}:${getClientIp(request)}`;
  if (!consume(key, options.limit, options.windowMs)) {
    throw new AppError("RATE_LIMITED", "Too many requests. Please try again later.");
  }
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? "unknown";
  return request.headers.get("x-real-ip") ?? "unknown";
}
