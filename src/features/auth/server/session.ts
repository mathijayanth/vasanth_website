import "server-only";
import { cookies } from "next/headers";
import type { UserRole } from "@prisma/client";
import { forbidden, unauthorized } from "@/server/http/errors";
import { SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS } from "../auth.constants";
import { signSessionToken, verifySessionToken } from "../session-token";
import { userRepository } from "./user.repository";

export type SessionUser = {
  id: string;
  email: string;
  role: UserRole;
  name: string | null;
};

type StoredSessionUser = SessionUser & { sessionVersion: number };

/** Shared by set and clear so the browser matches the same cookie when deleting it. */
export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
} as const;

export async function startSession(user: StoredSessionUser): Promise<boolean> {
  const token = await signSessionToken(user);
  if (!token) return false;

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    ...sessionCookieOptions,
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
  return true;
}

export async function endSession() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, "", { ...sessionCookieOptions, maxAge: 0 });
}

/**
 * Verifies the JWT, then reloads the user so role changes, deletions and revocations
 * (`sessionVersion` bumps) take effect immediately. Database errors propagate: they never
 * resolve to an authenticated user.
 */
export async function resolveSessionUser(
  token: string,
  findUser: (id: string) => Promise<StoredSessionUser | null> = userRepository.findSessionUser,
): Promise<SessionUser | null> {
  const claims = await verifySessionToken(token);
  if (!claims) return null;

  const user = await findUser(claims.id);
  if (!user || user.email !== claims.email) return null;
  if (user.sessionVersion !== claims.sessionVersion) return null;

  return { id: user.id, email: user.email, role: user.role, name: user.name };
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return resolveSessionUser(token);
}

export async function requireUser(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) throw unauthorized();
  return user;
}

export async function requireRole(allowed: readonly UserRole[]): Promise<SessionUser> {
  const user = await requireUser();
  if (!allowed.includes(user.role)) throw forbidden();
  return user;
}
