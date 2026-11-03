import { SignJWT } from "jose/jwt/sign";
import { jwtVerify } from "jose/jwt/verify";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import type { SessionUser } from "./types";

export const SESSION_COOKIE = "dcrpi_session";
const MAX_AGE = 60 * 60 * 8; // 8 hours

function secretKey() {
  const secret =
    process.env.AUTH_SECRET ||
    (process.env.NODE_ENV !== "production" ? "dcrpi-development-secret-change-me-please" : "");
  if (!secret || secret.length < 16) {
    throw new Error("AUTH_SECRET is not configured");
  }
  return new TextEncoder().encode(secret);
}

export async function createSession(user: SessionUser) {
  const token = await new SignJWT({
    sub: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    image: user.image ?? "",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .setIssuer("dcrpi")
    .sign(secretKey());

  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function destroySession() {
  const store = await cookies();
  store.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function decodeSession(token?: string | null): Promise<SessionUser | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey(), { issuer: "dcrpi" });
    if (!payload.sub || (payload.role !== "admin" && payload.role !== "editor")) return null;
    return {
      id: payload.sub,
      name: String(payload.name ?? "Administrator"),
      email: String(payload.email ?? ""),
      role: payload.role,
      image: String(payload.image ?? ""),
    };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionUser | null> {
  const store = await cookies();
  return decodeSession(store.get(SESSION_COOKIE)?.value);
}

export async function getSessionFromRequest(req: NextRequest): Promise<SessionUser | null> {
  return decodeSession(req.cookies.get(SESSION_COOKIE)?.value);
}

export async function requireAdmin() {
  const session = await getSession();
  if (!session) {
    return { session: null, error: "Unauthorized" as const };
  }
  return { session, error: null };
}
