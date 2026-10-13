import "@/test/setup-env";
import assert from "node:assert/strict";
import { afterEach, before, describe, it, mock } from "node:test";
import { NextRequest } from "next/server";
import { POST as forgotPasswordRoute } from "@/app/api/auth/forgot-password/route";
import { POST as loginRoute } from "@/app/api/auth/login/route";
import { proxy } from "@/proxy";
import { AppError } from "@/server/http/errors";
import { logoutEverywhere, resetPassword } from "./auth.service";
import { hashPassword } from "./password";
import { passwordResetRepository } from "./password-reset.repository";
import { userRepository } from "./user.repository";

const CORRECT_PASSWORD = "Correct-pass-1";
let correctHash: string;

before(async () => {
  correctHash = await hashPassword(CORRECT_PASSWORD);
});

afterEach(() => {
  mock.restoreAll();
});

function jsonRequest(path: string, body: unknown, ip: string) {
  return new NextRequest(`http://localhost:3000${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": ip },
    body: JSON.stringify(body),
  });
}

function fakeUser(email: string) {
  return {
    id: "user_login",
    email,
    role: "USER" as const,
    name: null,
    sessionVersion: 0,
    passwordHash: correctHash,
  };
}

describe("login per-email limit", () => {
  it("allows five failed attempts, rejects the sixth with 429 across different IPs", async () => {
    const lookup = mock.method(userRepository, "findByEmailWithPassword", async (email: string) =>
      fakeUser(email),
    );

    for (let attempt = 1; attempt <= 5; attempt += 1) {
      const email = attempt % 2 ? "Victim@Example.com" : "  victim@example.COM ";
      const response = await loginRoute(
        jsonRequest("/api/auth/login", { email, password: "Wrong-pass-1" }, `198.51.100.${attempt}`),
        undefined,
      );
      assert.equal(response.status, 401, `attempt ${attempt}`);
      const body = await response.json();
      assert.equal(body.error.message, "Invalid email or password");
    }

    const lookupsBefore = lookup.mock.callCount();
    const blocked = await loginRoute(
      jsonRequest(
        "/api/auth/login",
        { email: "victim@example.com", password: CORRECT_PASSWORD },
        "198.51.100.99",
      ),
      undefined,
    );
    assert.equal(blocked.status, 429);
    assert.ok(Number(blocked.headers.get("Retry-After")) > 0);
    assert.equal(lookup.mock.callCount(), lookupsBefore, "no password check once limited");
  });

  it("returns the same 401 for unknown accounts and still runs a password comparison", async () => {
    mock.method(userRepository, "findByEmailWithPassword", async () => null);
    const started = performance.now();
    const response = await loginRoute(
      jsonRequest("/api/auth/login", { email: "nobody@example.com", password: "Wrong-pass-1" }, "198.51.100.200"),
      undefined,
    );
    assert.equal(response.status, 401);
    assert.equal((await response.json()).error.message, "Invalid email or password");
    assert.ok(performance.now() - started > 20, "bcrypt comparison was not skipped");
  });

  it("keeps the existing per-IP limit (10/min) for different emails", async () => {
    mock.method(userRepository, "findByEmailWithPassword", async () => null);
    const statuses: number[] = [];
    for (let attempt = 1; attempt <= 11; attempt += 1) {
      const response = await loginRoute(
        jsonRequest(
          "/api/auth/login",
          { email: `user${attempt}@example.com`, password: "Wrong-pass-1" },
          "192.0.2.50",
        ),
        undefined,
      );
      statuses.push(response.status);
    }
    assert.deepEqual(statuses.slice(0, 10), Array(10).fill(401));
    assert.equal(statuses[10], 429);
  });
});

describe("forgot-password per-email limit", () => {
  async function requestReset(email: string, ip: string) {
    const response = await forgotPasswordRoute(
      jsonRequest("/api/auth/forgot-password", { email }, ip),
      undefined,
    );
    return { status: response.status, body: await response.json() };
  }

  it("allows three requests per email per hour, rejects the fourth across IPs (existing account)", async () => {
    mock.method(userRepository, "findIdByEmail", async (email: string) => ({ id: "u1", email }));
    mock.method(passwordResetRepository, "issue", async () => "reset-token-for-tests");
    mock.method(console, "info", () => {});

    const results = [];
    for (let attempt = 1; attempt <= 4; attempt += 1) {
      results.push(await requestReset("member@example.com", `203.0.113.${attempt}`));
    }
    assert.deepEqual(
      results.map((result) => result.status),
      [200, 200, 200, 429],
    );
  });

  it("behaves the same for an email with no account", async () => {
    mock.method(userRepository, "findIdByEmail", async () => null);
    const results = [];
    for (let attempt = 1; attempt <= 4; attempt += 1) {
      results.push(await requestReset("ghost@example.com", `203.0.113.${attempt + 10}`));
    }
    assert.deepEqual(
      results.map((result) => result.status),
      [200, 200, 200, 429],
    );
    assert.equal(
      results[0]!.body.message,
      "If an account exists for that email, password reset instructions were sent.",
    );
  });
});

describe("resetPassword", () => {
  const validRecord = {
    id: "token_1",
    userId: "user_1",
    usedAt: null,
    expiresAt: new Date(Date.now() + 60_000),
  };

  it("on success stores a bcrypt hash and increments sessionVersion", async () => {
    const user = { sessionVersion: 2, passwordHash: "old" };
    mock.method(passwordResetRepository, "findValid", async () => validRecord);
    const complete = mock.method(
      passwordResetRepository,
      "complete",
      async (input: { passwordHash: string }) => {
        user.passwordHash = input.passwordHash;
        user.sessionVersion += 1;
        return true;
      },
    );

    await resetPassword({ token: "t".repeat(64), password: "New-pass-123", confirmPassword: "New-pass-123" });

    assert.equal(complete.mock.callCount(), 1);
    assert.equal(user.sessionVersion, 3);
    assert.match(user.passwordHash, /^\$2[aby]\$12\$/);
  });

  it("does not touch the user for an invalid or expired token", async () => {
    mock.method(passwordResetRepository, "findValid", async () => null);
    const complete = mock.method(passwordResetRepository, "complete", async () => true);

    await assert.rejects(
      resetPassword({ token: "t".repeat(64), password: "New-pass-123", confirmPassword: "New-pass-123" }),
      (error: unknown) => error instanceof AppError && error.status === 400,
    );
    assert.equal(complete.mock.callCount(), 0);
  });

  it("fails without changes when the token was claimed concurrently", async () => {
    mock.method(passwordResetRepository, "findValid", async () => validRecord);
    mock.method(passwordResetRepository, "complete", async () => false);

    await assert.rejects(
      resetPassword({ token: "t".repeat(64), password: "New-pass-123", confirmPassword: "New-pass-123" }),
      (error: unknown) => error instanceof AppError && error.status === 400,
    );
  });
});

describe("logout everywhere", () => {
  it("increments the user's session version", async () => {
    const increment = mock.method(userRepository, "incrementSessionVersion", async () => {});
    await logoutEverywhere({ id: "user_9", email: "a@example.com", role: "USER", name: null });
    assert.deepEqual(increment.mock.calls[0]!.arguments, ["user_9"]);
  });

  it("is blocked by the proxy without a session (401) and from other origins (403)", async () => {
    const anonymous = await proxy(
      new NextRequest("http://localhost:3000/api/auth/logout-all", { method: "POST" }),
    );
    assert.equal(anonymous.status, 401);

    const crossSite = await proxy(
      new NextRequest("http://localhost:3000/api/auth/logout-all", {
        method: "POST",
        headers: { Origin: "https://evil.example" },
      }),
    );
    assert.equal(crossSite.status, 403);
  });
});
