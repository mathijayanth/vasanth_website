import "@/test/setup-env";
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { upstashPairIssue } from "@/config/env";
import { RateLimitError } from "./errors";
import { handleRouteError } from "./handle-error";
import {
  consumeRateLimit,
  getRateLimitBackend,
  hashIdentifier,
  resetRateLimit,
} from "./rate-limit";

let bucketSeq = 0;
const freshBucket = () => `test-${process.pid}-${bucketSeq++}`;

describe("rate limit (in-memory backend)", () => {
  it("reports the memory backend when Upstash is not configured", () => {
    assert.equal(getRateLimitBackend(), "memory");
  });

  it("allows `limit` attempts, then throws RateLimitError with a retry hint", async () => {
    const bucket = freshBucket();
    for (let i = 0; i < 3; i += 1) {
      await consumeRateLimit(bucket, "203.0.113.1", { limit: 3, windowMs: 60_000 });
    }
    await assert.rejects(
      consumeRateLimit(bucket, "203.0.113.1", { limit: 3, windowMs: 60_000 }),
      (error: unknown) =>
        error instanceof RateLimitError &&
        error.status === 429 &&
        error.retryAfterSeconds > 0 &&
        error.retryAfterSeconds <= 60,
    );
  });

  it("tracks identifiers independently", async () => {
    const bucket = freshBucket();
    await consumeRateLimit(bucket, "a", { limit: 1, windowMs: 60_000 });
    await consumeRateLimit(bucket, "b", { limit: 1, windowMs: 60_000 });
    await assert.rejects(consumeRateLimit(bucket, "a", { limit: 1, windowMs: 60_000 }));
  });

  it("allows attempts again after the window expires", async () => {
    const bucket = freshBucket();
    await consumeRateLimit(bucket, "x", { limit: 1, windowMs: 30 });
    await assert.rejects(consumeRateLimit(bucket, "x", { limit: 1, windowMs: 30 }));
    await new Promise((resolve) => setTimeout(resolve, 50));
    await consumeRateLimit(bucket, "x", { limit: 1, windowMs: 30 });
  });

  it("resetRateLimit clears the counter", async () => {
    const bucket = freshBucket();
    await consumeRateLimit(bucket, "x", { limit: 1, windowMs: 60_000 });
    await resetRateLimit(bucket, "x");
    await consumeRateLimit(bucket, "x", { limit: 1, windowMs: 60_000 });
  });

  it("concurrent attempts cannot exceed the limit", async () => {
    const bucket = freshBucket();
    const results = await Promise.allSettled(
      Array.from({ length: 25 }, () =>
        consumeRateLimit(bucket, "burst", { limit: 5, windowMs: 60_000 }),
      ),
    );
    assert.equal(results.filter((result) => result.status === "fulfilled").length, 5);
  });
});

describe("hashIdentifier", () => {
  it("is deterministic, distinct per input, and never contains the raw value", () => {
    const hashed = hashIdentifier("reader@example.com");
    assert.equal(hashed, hashIdentifier("reader@example.com"));
    assert.notEqual(hashed, hashIdentifier("other@example.com"));
    assert.match(hashed, /^[0-9a-f]{32}$/);
    assert.ok(!hashed.includes("reader"));
  });
});

describe("429 responses", () => {
  it("map to HTTP 429 with a Retry-After header", async () => {
    const response = handleRouteError(new RateLimitError(42));
    assert.equal(response.status, 429);
    assert.equal(response.headers.get("Retry-After"), "42");
    const body = await response.json();
    assert.equal(body.success, false);
    assert.equal(body.error.code, "RATE_LIMITED");
  });
});

describe("Upstash env validation", () => {
  it("accepts both or neither variable and rejects only one, without echoing values", () => {
    assert.equal(upstashPairIssue({}), null);
    assert.equal(
      upstashPairIssue({ UPSTASH_REDIS_REST_URL: "https://x", UPSTASH_REDIS_REST_TOKEN: "t" }),
      null,
    );
    const issue = upstashPairIssue({ UPSTASH_REDIS_REST_TOKEN: "super-secret-token" });
    assert.ok(issue);
    assert.ok(!issue.includes("super-secret-token"));
  });
});
