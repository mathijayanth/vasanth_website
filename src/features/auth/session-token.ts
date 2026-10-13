import { SignJWT, jwtVerify } from "jose";
import type { UserRole } from "@prisma/client";
import { SESSION_MAX_AGE_SECONDS } from "./auth.constants";

/** Edge-safe: used by both middleware and server code. */

export type SessionClaims = {
  id: string;
  email: string;
  role: UserRole;
  /** Must equal `User.sessionVersion`; bumping the column revokes every older token. */
  sessionVersion: number;
  name?: string | null;
};

function getAuthSecret(): Uint8Array | null {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 16) return null;
  return new TextEncoder().encode(secret);
}

export function isAuthConfigured(): boolean {
  return getAuthSecret() !== null;
}

function isValidSessionVersion(value: unknown): value is number {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
}

export async function signSessionToken(claims: SessionClaims): Promise<string | null> {
  const secret = getAuthSecret();
  if (!secret) return null;

  return new SignJWT({
    email: claims.email,
    role: claims.role,
    name: claims.name ?? null,
    sv: claims.sessionVersion,
  })
    .setSubject(claims.id)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .sign(secret);
}

/** Tokens issued before `sv` existed are rejected, so every user signs in once after rollout. */
export async function verifySessionToken(token: string): Promise<SessionClaims | null> {
  const secret = getAuthSecret();
  if (!secret) return null;

  try {
    const { payload } = await jwtVerify(token, secret, { algorithms: ["HS256"] });
    const { sub: id, email, role, sv } = payload;
    if (typeof id !== "string" || typeof email !== "string" || typeof role !== "string") {
      return null;
    }
    if (!isValidSessionVersion(sv)) return null;
    return { id, email, role: role as UserRole, sessionVersion: sv };
  } catch {
    return null;
  }
}
