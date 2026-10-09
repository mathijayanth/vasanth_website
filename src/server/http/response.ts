import { NextResponse } from "next/server";
import type { ApiErrorCode } from "./errors";

export type { ApiErrorCode };

export type ApiSuccessResponse<T> = {
  success: true;
  data: T;
  message?: string;
};

export type ApiErrorResponse = {
  success: false;
  error: {
    code: ApiErrorCode;
    message: string;
    details?: unknown;
  };
};

export function apiSuccess<T>(
  data: T,
  options?: { message?: string; status?: number },
): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      ...(options?.message ? { message: options.message } : {}),
    },
    { status: options?.status ?? 200 },
  );
}

export function apiError(
  code: ApiErrorCode,
  message: string,
  status: number,
  details?: unknown,
): NextResponse<ApiErrorResponse> {
  const body: ApiErrorResponse = {
    success: false,
    error: {
      code,
      message,
      ...(details !== undefined &&
      details !== null &&
      process.env.NODE_ENV !== "production"
        ? { details }
        : {}),
    },
  };
  return NextResponse.json(body, { status });
}
