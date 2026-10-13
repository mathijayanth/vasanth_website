import "server-only";
import { createHmac } from "node:crypto";
import { env } from "@/config/env";
import { RateLimitError } from "./errors";

/**
 * Fixed-window rate limiting.
 *
 * With UPSTASH_REDIS_REST_URL/TOKEN set, counters live in Redis and are shared by every
 * instance. Without them, or while Redis is unreachable, counters fall back to this process's
 * memory: limits then apply per instance only and reset on restart. That fallback trades
 * strict enforcement for availability and is reported as "memory-fallback" by
 * getRateLimitBackend() and a throttled warning log.
 */

export type RateLimitBackend = "redis" | "memory" | "memory-fallback";

type RateLimitOptions = { bucket: string; limit: number; windowMs: number };
type Counter = { count: number; ttlMs: number };

const REDIS_TIMEOUT_MS = 1_000;
const FALLBACK_REPORT_WINDOW_MS = 60_000;
const MEMORY_PRUNE_THRESHOLD = 10_000;

// Atomic in Redis: increments, and sets the window TTL on first hit or if it is ever missing.
const INCREMENT_SCRIPT = `
local count = redis.call('INCR', KEYS[1])
local ttl = redis.call('PTTL', KEYS[1])
if ttl < 0 then
  redis.call('PEXPIRE', KEYS[1], ARGV[1])
  ttl = tonumber(ARGV[1])
end
return {count, ttl}
`;

const memoryStore = new Map<string, { count: number; resetAt: number }>();
let lastRedisFailureAt = 0;

function memoryIncrement(key: string, windowMs: number): Counter {
  const now = Date.now();
  if (memoryStore.size > MEMORY_PRUNE_THRESHOLD) {
    for (const [storedKey, entry] of memoryStore) {
      if (entry.resetAt <= now) memoryStore.delete(storedKey);
    }
  }

  const entry = memoryStore.get(key);
  if (!entry || entry.resetAt <= now) {
    memoryStore.set(key, { count: 1, resetAt: now + windowMs });
    return { count: 1, ttlMs: windowMs };
  }
  entry.count += 1;
  return { count: entry.count, ttlMs: entry.resetAt - now };
}

async function redisCommand(command: Array<string | number>): Promise<unknown> {
  const upstash = env.upstash;
  if (!upstash) throw new Error("Upstash is not configured");

  const response = await fetch(upstash.url, {
    method: "POST",
    headers: { Authorization: `Bearer ${upstash.token}`, "Content-Type": "application/json" },
    body: JSON.stringify(command),
    signal: AbortSignal.timeout(REDIS_TIMEOUT_MS),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Upstash responded with HTTP ${response.status}`);

  const body = (await response.json()) as { result?: unknown; error?: unknown };
  if (body.error !== undefined) throw new Error("Upstash returned a command error");
  return body.result;
}

function reportRedisFailure(error: unknown) {
  const now = Date.now();
  if (now - lastRedisFailureAt > FALLBACK_REPORT_WINDOW_MS) {
    const reason = error instanceof Error ? error.message : "unknown error";
    console.warn(
      `[rate-limit] Redis unavailable (${reason}); using per-instance in-memory limits.`,
    );
  }
  lastRedisFailureAt = now;
}

async function increment(key: string, windowMs: number): Promise<Counter> {
  if (env.upstash) {
    try {
      const result = await redisCommand(["EVAL", INCREMENT_SCRIPT, 1, key, windowMs]);
      if (!Array.isArray(result) || result.length !== 2) {
        throw new Error("Unexpected Upstash response shape");
      }
      return { count: Number(result[0]), ttlMs: Number(result[1]) };
    } catch (error) {
      reportRedisFailure(error);
    }
  }
  return memoryIncrement(key, windowMs);
}

/** Keyed hash so raw emails and IPs never reach the store or logs. */
export function hashIdentifier(value: string): string {
  return createHmac("sha256", env.authSecret ?? "vitalnotes-rate-limit")
    .update(value)
    .digest("hex")
    .slice(0, 32);
}

function storeKey(bucket: string, identifier: string): string {
  return `rl:${bucket}:${hashIdentifier(identifier)}`;
}

/** Counts this attempt; throws RATE_LIMITED (429) once the count exceeds `limit` in the window. */
export async function consumeRateLimit(
  bucket: string,
  identifier: string,
  options: Omit<RateLimitOptions, "bucket">,
): Promise<void> {
  const { count, ttlMs } = await increment(storeKey(bucket, identifier), options.windowMs);
  if (count > options.limit) {
    throw new RateLimitError(Math.max(1, Math.ceil(ttlMs / 1000)));
  }
}

/** Clears a counter, e.g. failed-login attempts after a successful sign-in. */
export async function resetRateLimit(bucket: string, identifier: string): Promise<void> {
  const key = storeKey(bucket, identifier);
  memoryStore.delete(key);
  if (!env.upstash) return;
  try {
    await redisCommand(["DEL", key]);
  } catch (error) {
    reportRedisFailure(error);
  }
}

export async function enforceRateLimit(request: Request, options: RateLimitOptions) {
  await consumeRateLimit(options.bucket, getClientIp(request), options);
}

export function getRateLimitBackend(): RateLimitBackend {
  if (!env.upstash) return "memory";
  return Date.now() - lastRedisFailureAt < FALLBACK_REPORT_WINDOW_MS ? "memory-fallback" : "redis";
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? "unknown";
  return request.headers.get("x-real-ip") ?? "unknown";
}
