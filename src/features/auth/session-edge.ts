import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME } from "./auth.constants";
import { verifySessionToken, type SessionClaims } from "./session-token";

/** Middleware-only: verifies the JWT signature. Does not hit the database. */
export async function getSessionFromRequest(request: NextRequest): Promise<SessionClaims | null> {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}
