import { NextResponse } from "next/server";
import { ZodError, type ZodType } from "zod";
import { apiError } from "./response";

export function parseSearchParams<T>(
  schema: ZodType<T>,
  params: URLSearchParams,
): T | NextResponse {
  const raw = Object.fromEntries(params.entries());
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return validationError(parsed.error);
  }
  return parsed.data;
}

export async function parseJsonBody<T>(
  schema: ZodType<T>,
  request: Request,
): Promise<T | NextResponse> {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return apiError("BAD_REQUEST", "Invalid JSON body", 400);
  }

  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return validationError(parsed.error);
  }
  return parsed.data;
}

export function validationError(error: ZodError) {
  return apiError("VALIDATION_ERROR", "Request validation failed", 400, error.flatten());
}
