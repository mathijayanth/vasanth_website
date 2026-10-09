import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import type { UserRole } from "@prisma/client";
import { SESSION_COOKIE_NAME } from "@/lib/auth/constants";

export type EdgeSession = {
  id: string;
  email: string;
  role: UserRole;
};

function getAuthSecret(): Uint8Array | null {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 16) return null;
  return new TextEncoder().encode(secret);
}

export async function getSessionFromRequest(
  request: NextRequest,
): Promise<EdgeSession | null> {
  const secret = getAuthSecret();
  if (!secret) return null;

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret);
    const id = payload.sub;
    const email = payload.email;
    const role = payload.role;
    if (typeof id !== "string" || typeof email !== "string" || typeof role !== "string") {
      return null;
    }
    return { id, email, role: role as UserRole };
  } catch {
    return null;
  }
}
