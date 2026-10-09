import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { canAccessAdminPath } from "@/lib/auth/permissions";
import { getSessionFromRequest } from "@/lib/auth/session-edge";

const PUBLIC_AUTH_API = new Set([
  "/api/auth/login",
  "/api/auth/logout",
  "/api/auth/register",
  "/api/auth/forgot-password",
  "/api/auth/reset-password",
]);

function unauthorizedApiResponse() {
  return NextResponse.json(
    {
      success: false,
      error: { code: "UNAUTHORIZED", message: "Authentication required" },
    },
    { status: 401 },
  );
}

function forbiddenApiResponse() {
  return NextResponse.json(
    {
      success: false,
      error: { code: "FORBIDDEN", message: "You do not have permission for this action" },
    },
    { status: 403 },
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;

  if (pathname.startsWith("/admin")) {
    const session = await getSessionFromRequest(request);
    if (!session) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (!canAccessAdminPath(pathname, session.role)) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  if (pathname.startsWith("/api/")) {
    const isWrite = method === "POST" || method === "PUT" || method === "PATCH" || method === "DELETE";

    if (PUBLIC_AUTH_API.has(pathname)) {
      return NextResponse.next();
    }

    if (pathname === "/api/newsletter" && method === "POST") {
      return NextResponse.next();
    }

    if (pathname.startsWith("/api/articles") && method === "GET") {
      return NextResponse.next();
    }

    if (pathname.startsWith("/api/authors") && method === "GET") {
      return NextResponse.next();
    }

    if (pathname.startsWith("/api/categories") && method === "GET") {
      return NextResponse.next();
    }

    if (pathname.startsWith("/api/search") && method === "GET") {
      return NextResponse.next();
    }

    if (isWrite) {
      const session = await getSessionFromRequest(request);
      if (!session) {
        return unauthorizedApiResponse();
      }

      if (pathname.startsWith("/api/categories") && method === "POST") {
        if (session.role !== "ADMIN" && session.role !== "EDITOR") {
          return forbiddenApiResponse();
        }
      }

      if (pathname === "/api/articles" && method === "POST") {
        if (!["ADMIN", "EDITOR", "AUTHOR"].includes(session.role)) {
          return forbiddenApiResponse();
        }
      }

      if (pathname.startsWith("/api/articles/") && (method === "PUT" || method === "DELETE")) {
        if (method === "DELETE" && session.role !== "ADMIN" && session.role !== "EDITOR") {
          return forbiddenApiResponse();
        }
        if (method === "PUT" && !["ADMIN", "EDITOR", "AUTHOR"].includes(session.role)) {
          return forbiddenApiResponse();
        }
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
