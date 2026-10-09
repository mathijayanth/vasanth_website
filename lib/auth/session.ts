import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import type { UserRole } from "@prisma/client";
import { db } from "@/lib/db";
import { apiError } from "@/lib/api/response";
import { SESSION_COOKIE_NAME } from "@/lib/auth/constants";

export { SESSION_COOKIE_NAME };

export type SessionUser = {
  id: string;
  email: string;
  role: UserRole;
  name: string | null;
};

function getAuthSecret(): Uint8Array | null {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 16) return null;
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(user: SessionUser): Promise<string | null> {
  const secret = getAuthSecret();
  if (!secret) return null;

  return new SignJWT({
    sub: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const secret = getAuthSecret();
  if (!secret) return null;

  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret);
    const id = payload.sub;
    const email = payload.email;
    const role = payload.role;
    if (typeof id !== "string" || typeof email !== "string" || typeof role !== "string") {
      return null;
    }

    const user = await db.user.findUnique({
      where: { id },
      select: { id: true, email: true, role: true, name: true },
    });
    if (!user || user.email !== email) return null;

    return user;
  } catch {
    return null;
  }
}

export async function requireAuth() {
  const user = await getSessionUser();
  if (!user) {
    return { user: null, error: apiError("UNAUTHORIZED", "Authentication required", 401) };
  }
  return { user, error: null };
}

export async function requireRoles(allowed: UserRole[]) {
  const auth = await requireAuth();
  if (auth.error) return auth;
  if (!allowed.includes(auth.user.role)) {
    return {
      user: null,
      error: apiError("FORBIDDEN", "You do not have permission for this action", 403),
    };
  }
  return auth;
}

export function canManageCategories(role: UserRole): boolean {
  return role === "ADMIN" || role === "EDITOR";
}

/** @deprecated Import from `@/lib/auth/permissions` */
export function canManageArticles(role: UserRole): boolean {
  return role === "ADMIN" || role === "EDITOR" || role === "AUTHOR";
}
