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

export async function startSession(user: SessionUser): Promise<boolean> {
  const token = await signSessionToken(user);
  if (!token) return false;

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
  return true;
}

export async function endSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/** Verifies the JWT, then reloads the user so role changes and deletions take effect immediately. */
export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const claims = await verifySessionToken(token);
  if (!claims) return null;

  const user = await userRepository.findSessionUser(claims.id);
  if (!user || user.email !== claims.email) return null;
  return user;
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
