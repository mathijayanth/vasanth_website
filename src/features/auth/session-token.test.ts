import "@/test/setup-env";
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { SignJWT } from "jose";
import { signSessionToken, verifySessionToken, type SessionClaims } from "./session-token";

const claims: SessionClaims = {
  id: "user_1",
  email: "reader@example.com",
  role: "USER",
  sessionVersion: 3,
};

function rawToken(payload: Record<string, unknown>, options?: { secret?: string; exp?: string }) {
  return new SignJWT(payload)
    .setSubject("user_1")
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(options?.exp ?? "1h")
    .sign(new TextEncoder().encode(options?.secret ?? process.env.AUTH_SECRET));
}

describe("session token", () => {
  it("round-trips the session version as the sv claim", async () => {
    const token = await signSessionToken(claims);
    assert.ok(token);
    const verified = await verifySessionToken(token);
    assert.deepEqual(verified, {
      id: "user_1",
      email: "reader@example.com",
      role: "USER",
      sessionVersion: 3,
    });
  });

  it("rejects tokens issued without sv (pre-rollout format)", async () => {
    const token = await rawToken({ email: claims.email, role: claims.role });
    assert.equal(await verifySessionToken(token), null);
  });

  for (const sv of ["3", -1, 1.5, null, Number.MAX_SAFE_INTEGER + 2]) {
    it(`rejects an invalid sv claim: ${String(sv)}`, async () => {
      const token = await rawToken({ email: claims.email, role: claims.role, sv });
      assert.equal(await verifySessionToken(token), null);
    });
  }

  it("rejects expired tokens", async () => {
    const token = await rawToken(
      { email: claims.email, role: claims.role, sv: 0 },
      { exp: "-1m" },
    );
    assert.equal(await verifySessionToken(token), null);
  });

  it("rejects tokens signed with a different secret", async () => {
    const token = await rawToken(
      { email: claims.email, role: claims.role, sv: 0 },
      { secret: "a-completely-different-secret-value-123" },
    );
    assert.equal(await verifySessionToken(token), null);
  });

  it("rejects malformed tokens", async () => {
    assert.equal(await verifySessionToken("not-a-jwt"), null);
    assert.equal(await verifySessionToken(""), null);
  });
});
