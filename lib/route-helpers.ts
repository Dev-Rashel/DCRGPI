import { fail } from "@/lib/api";
import { getSession } from "@/lib/auth";
import { isDbConfigured } from "@/lib/db";
import type { SessionUser } from "@/lib/types";
import type { NextResponse } from "next/server";

type Guarded = { session: SessionUser; response: null } | { session: null; response: NextResponse };

/**
 * Ensures a request is authenticated AND that the database is configured
 * before any administrative mutation is attempted.
 */
export async function adminGuard(): Promise<Guarded> {
  const session = await getSession();
  if (!session) {
    return { session: null, response: fail("Unauthorized", 401) };
  }
  if (!isDbConfigured()) {
    return {
      session: null,
      response: fail(
        "The database is not configured. Add MONGODB_URI to your environment to enable content management.",
        503
      ),
    };
  }
  return { session, response: null };
}

export function demoWriteGuard() {
  if (!isDbConfigured()) {
    return fail(
      "The database is not configured, so changes cannot be saved. Add MONGODB_URI to your environment.",
      503
    );
  }
  return null;
}

export function referenceNumber(prefix: string) {
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `${prefix}-${year}-${random}`;
}

export function csvEscape(value: unknown) {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

export function slugFrom(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
