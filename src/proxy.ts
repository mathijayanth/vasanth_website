import { NextResponse, type NextRequest } from "next/server";
import type { UserRole } from "@prisma/client";
import {
  canAccessAdmin,
  canAccessAdminPath,
  canDeleteArticles,
  canManageArticles,
  canManageCategories,
} from "@/features/auth/permissions";
import { getSessionFromRequest } from "@/features/auth/session-edge";
import { siteConfig } from "@/config/site";

/**
 * First line of defence only: checks that a valid session exists and the role is plausible.
 * Route handlers and services re-check authentication, roles and ownership.
 */

const PUBLIC_WRITE_ROUTES = new Set([
  "/api/auth/login",
  "/api/auth/logout",
  "/api/auth/register",
  "/api/auth/forgot-password",
  "/api/auth/reset-password",
  "/api/newsletter",
  "/api/enquiries",
]);

const WRITE_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

const ARTICLE_ITEM_PATH = /^\/api\/articles\/[^/]+$/;

function apiErrorResponse(code: "UNAUTHORIZED" | "FORBIDDEN", message?: string) {
  const isUnauthorized = code === "UNAUTHORIZED";
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message:
          message ??
          (isUnauthorized
            ? "Authentication required"
            : "You do not have permission for this action"),
      },
    },
    { status: isUnauthorized ? 401 : 403 },
  );
}

// Cookie-authenticated writes must come from our own pages. Requests without an
// Origin header (curl, server-to-server) carry no victim cookies, so they are allowed.
function isCrossSiteRequest(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (origin) {
    const allowed = new Set([request.nextUrl.origin, new URL(siteConfig.url).origin]);
    return !allowed.has(origin);
  }
  return request.headers.get("sec-fetch-site") === "cross-site";
}

function isApiWriteAllowed(pathname: string, method: string, role: UserRole): boolean {
  if (pathname === "/api/categories" && method === "POST") return canManageCategories(role);
  if (pathname === "/api/articles" && method === "POST") return canManageArticles(role);
  if (ARTICLE_ITEM_PATH.test(pathname)) {
    if (method === "DELETE") return canDeleteArticles(role);
    if (method === "PUT") return canManageArticles(role);
  }
  return true;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { method } = request;

  if (pathname.startsWith("/admin")) {
    const session = await getSessionFromRequest(request);
    if (!session) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (!canAccessAdmin(session.role)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    if (!canAccessAdminPath(pathname, session.role)) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  if (!WRITE_METHODS.has(method)) {
    return NextResponse.next();
  }

  if (isCrossSiteRequest(request)) {
    return apiErrorResponse("FORBIDDEN", "Cross-site request blocked");
  }

  if (PUBLIC_WRITE_ROUTES.has(pathname)) {
    return NextResponse.next();
  }

  const session = await getSessionFromRequest(request);
  if (!session) return apiErrorResponse("UNAUTHORIZED");
  if (!isApiWriteAllowed(pathname, method, session.role)) return apiErrorResponse("FORBIDDEN");

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
