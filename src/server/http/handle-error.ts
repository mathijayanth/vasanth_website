import "server-only";
import type { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { AppError, RateLimitError } from "./errors";
import { apiError } from "./response";

export function handleRouteError(error: unknown) {
  if (error instanceof RateLimitError) {
    const response = apiError(error.code, error.message, error.status);
    response.headers.set("Retry-After", String(error.retryAfterSeconds));
    return response;
  }

  if (error instanceof AppError) {
    return apiError(error.code, error.message, error.status, error.details);
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return apiError("CONFLICT", "A record with this value already exists", 409);
    }
    if (error.code === "P2025") {
      return apiError("NOT_FOUND", "Record not found", 404);
    }
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    console.error("[db] database unavailable:", error.errorCode ?? "no error code");
    return apiError("SERVICE_UNAVAILABLE", "Service temporarily unavailable", 503);
  }

  console.error(error);
  return apiError("INTERNAL_ERROR", "An unexpected error occurred", 500);
}

type RouteHandler<Ctx> = (request: NextRequest, context: Ctx) => Promise<Response>;

/** Wraps a route handler so thrown AppErrors and Prisma errors become API error responses. */
export function withErrorHandling<Ctx = unknown>(handler: RouteHandler<Ctx>): RouteHandler<Ctx> {
  return async (request, context) => {
    try {
      return await handler(request, context);
    } catch (error) {
      return handleRouteError(error);
    }
  };
}
