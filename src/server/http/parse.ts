import type { ZodType } from "zod";
import { AppError } from "./errors";

export function parseSearchParams<T>(schema: ZodType<T>, params: URLSearchParams): T {
  const parsed = schema.safeParse(Object.fromEntries(params.entries()));
  if (!parsed.success) {
    throw new AppError("VALIDATION_ERROR", "Request validation failed", parsed.error.flatten());
  }
  return parsed.data;
}

export async function parseJsonBody<T>(schema: ZodType<T>, request: Request): Promise<T> {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    throw new AppError("BAD_REQUEST", "Invalid JSON body");
  }

  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    throw new AppError("VALIDATION_ERROR", "Request validation failed", parsed.error.flatten());
  }
  return parsed.data;
}
