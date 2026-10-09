import { SignJWT, jwtVerify } from "jose";
import type { UserRole } from "@prisma/client";
import { SESSION_MAX_AGE_SECONDS } from "./auth.constants";

/** Edge-safe: used by both middleware and server code. */

export type SessionClaims = {
  id: string;
  email: string;
  role: UserRole;
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

export async function signSessionToken(claims: SessionClaims): Promise<string | null> {
  const secret = getAuthSecret();
  if (!secret) return null;

  return new SignJWT({ email: claims.email, role: claims.role, name: claims.name ?? null })
    .setSubject(claims.id)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .sign(secret);
}

export async function verifySessionToken(token: string): Promise<SessionClaims | null> {
  const secret = getAuthSecret();
  if (!secret) return null;

  try {
    const { payload } = await jwtVerify(token, secret, { algorithms: ["HS256"] });
    const { sub: id, email, role } = payload;
    if (typeof id !== "string" || typeof email !== "string" || typeof role !== "string") {
      return null;
    }
    return { id, email, role: role as UserRole };
  } catch {
    return null;
  }
}
