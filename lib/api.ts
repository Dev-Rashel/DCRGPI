import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ data }, { status: 200, ...init });
}

export function created<T>(data: T) {
  return NextResponse.json({ data }, { status: 201 });
}

export function fail(message: string, status = 400, extra?: Record<string, unknown>) {
  return NextResponse.json({ error: message, ...extra }, { status });
}

export function handleApiError(error: unknown) {
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: "Validation failed",
        issues: error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      },
      { status: 422 }
    );
  }
  if (error && typeof error === "object" && "code" in error && (error as { code?: number }).code === 11000) {
    return fail("A record with these details already exists.", 409);
  }
  console.error("[api]", error);
  return fail("Something went wrong. Please try again.", 500);
}

export function parseBoolean(value: string | null, fallback = false) {
  if (value === null) return fallback;
  return value === "true" || value === "1";
}
