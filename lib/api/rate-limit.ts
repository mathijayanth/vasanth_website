import { NextResponse } from "next/server";
import { apiError } from "./response";

const memoryStore = new Map<string, { count: number; resetAt: number }>();

function memoryRateLimit(key: string, limit: number, windowMs: number): boolean {
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

/** Returns a rate-limit response, or null when allowed. */
export async function rateLimitOrError(
  bucket: string,
  identifier: string,
  limit: number,
  windowMs: number,
): Promise<NextResponse | null> {
  const key = `${bucket}:${identifier}`;
  if (!memoryRateLimit(key, limit, windowMs)) {
    return apiError("RATE_LIMITED", "Too many requests. Please try again later.", 429);
  }
  return null;
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? "unknown";
  return request.headers.get("x-real-ip") ?? "unknown";
}
