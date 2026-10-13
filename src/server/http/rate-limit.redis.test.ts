import "@/test/setup-env";
import assert from "node:assert/strict";
import { afterEach, before, beforeEach, describe, it, mock } from "node:test";

const UPSTASH_URL = "https://fake-upstash.example";
const UPSTASH_TOKEN = "fake-upstash-token-should-never-be-logged";
Object.assign(process.env, {
  UPSTASH_REDIS_REST_URL: UPSTASH_URL,
  UPSTASH_REDIS_REST_TOKEN: UPSTASH_TOKEN,
});

// Loaded after the Upstash variables are set, because config/env reads them once on import.
let consumeRateLimit: typeof import("./rate-limit").consumeRateLimit;
let getRateLimitBackend: typeof import("./rate-limit").getRateLimitBackend;
let resetRateLimit: typeof import("./rate-limit").resetRateLimit;

before(async () => {
  ({ consumeRateLimit, getRateLimitBackend, resetRateLimit } = await import("./rate-limit"));
});

/** Minimal Upstash REST stand-in. Each command runs to completion before the next, like Redis. */
function createFakeUpstash() {
  const store = new Map<string, { count: number; expiresAt: number }>();
  const commands: unknown[][] = [];

  const handler = async (url: string | URL | Request, init?: RequestInit) => {
    assert.equal(String(url), UPSTASH_URL);
    assert.equal(new Headers(init?.headers).get("Authorization"), `Bearer ${UPSTASH_TOKEN}`);
    const command = JSON.parse(String(init?.body)) as unknown[];
    commands.push(command);

    const [name] = command;
    if (name === "EVAL") {
      const [, , , key, windowMs] = command as [string, string, number, string, number];
      const now = Date.now();
      const entry = store.get(key);
      if (!entry || entry.expiresAt <= now) {
        store.set(key, { count: 1, expiresAt: now + windowMs });
        return Response.json({ result: [1, windowMs] });
      }
      entry.count += 1;
      return Response.json({ result: [entry.count, entry.expiresAt - now] });
    }
    if (name === "DEL") {
      store.delete(command[1] as string);
      return Response.json({ result: 1 });
    }
    return Response.json({ error: "unsupported command" });
  };

  return { store, commands, handler };
}

let bucketSeq = 0;
const freshBucket = () => `redis-test-${bucketSeq++}`;

describe("rate limit (Upstash backend)", () => {
  let fake: ReturnType<typeof createFakeUpstash>;

  beforeEach(() => {
    fake = createFakeUpstash();
    mock.method(globalThis, "fetch", fake.handler);
  });

  afterEach(() => {
    mock.restoreAll();
  });

  it("uses a single atomic EVAL (INCR + PEXPIRE) per attempt", async () => {
    await consumeRateLimit(freshBucket(), "203.0.113.9", { limit: 5, windowMs: 60_000 });
    assert.equal(fake.commands.length, 1);
    const [name, script, numKeys, , windowMs] = fake.commands[0]!;
    assert.equal(name, "EVAL");
    assert.match(String(script), /INCR/);
    assert.match(String(script), /PEXPIRE/);
    assert.equal(numKeys, 1);
    assert.equal(windowMs, 60_000);
    assert.equal(getRateLimitBackend(), "redis");
  });

  it("stores hashed keys only, never the raw email", async () => {
    const bucket = freshBucket();
    await consumeRateLimit(bucket, "patient@example.com", { limit: 5, windowMs: 60_000 });
    const key = String(fake.commands[0]![3]);
    assert.match(key, new RegExp(`^rl:${bucket}:[0-9a-f]{32}$`));
    assert.ok(!key.includes("patient"));
  });

  it("enforces the limit from the shared counter, including under concurrency", async () => {
    const bucket = freshBucket();
    const results = await Promise.allSettled(
      Array.from({ length: 12 }, () =>
        consumeRateLimit(bucket, "shared", { limit: 4, windowMs: 60_000 }),
      ),
    );
    assert.equal(results.filter((result) => result.status === "fulfilled").length, 4);
  });

  it("resetRateLimit deletes the Redis key", async () => {
    const bucket = freshBucket();
    await consumeRateLimit(bucket, "x", { limit: 1, windowMs: 60_000 });
    await resetRateLimit(bucket, "x");
    assert.equal(fake.commands.at(-1)![0], "DEL");
    await consumeRateLimit(bucket, "x", { limit: 1, windowMs: 60_000 });
  });
});

describe("rate limit (Upstash failure fallback)", () => {
  afterEach(() => {
    mock.restoreAll();
  });

  for (const [label, failingFetch] of [
    ["network error", async () => Promise.reject(new TypeError("fetch failed"))],
    ["HTTP 500", async () => new Response("boom", { status: 500 })],
    ["command error", async () => Response.json({ error: "ERR something" })],
  ] as const) {
    it(`falls back to memory on ${label} and logs a sanitized warning`, async () => {
      mock.method(globalThis, "fetch", failingFetch);
      const warn = mock.method(console, "warn", () => {});

      const bucket = freshBucket();
      await consumeRateLimit(bucket, "fallback", { limit: 1, windowMs: 60_000 });
      await assert.rejects(consumeRateLimit(bucket, "fallback", { limit: 1, windowMs: 60_000 }));

      assert.equal(getRateLimitBackend(), "memory-fallback");
      const logged = warn.mock.calls.map((call) => call.arguments.join(" ")).join("\n");
      assert.ok(!logged.includes(UPSTASH_TOKEN));
      assert.ok(!logged.includes(UPSTASH_URL));
      assert.ok(!logged.includes("fallback"));
    });
  }
});
