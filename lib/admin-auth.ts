import "server-only";

import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "thi_admin_session";
const SESSION_SECONDS = 60 * 60 * 8;
const MAX_CLOCK_SKEW_SECONDS = 60;

// Best-effort per-instance throttle. Add a persistent provider (e.g. Upstash)
// or Vercel Firewall rate limiting before production; serverless memory is not global.
const attempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

type SessionPayload = {
  sub: "admin";
  iat: number;
  exp: number;
  nonce: string;
};

function getPassword() {
  const value = process.env.ADMIN_PASSWORD;
  if (!value || value.length < 16) {
    throw new Error("ADMIN_PASSWORD must be configured and at least 16 characters long.");
  }
  return value;
}

function getSecret() {
  const value = process.env.ADMIN_SESSION_SECRET;
  if (!value || value.length < 32) {
    throw new Error("ADMIN_SESSION_SECRET must be configured and at least 32 characters long.");
  }
  return value;
}

function safeEqual(left: string, right: string) {
  const a = Buffer.from(left, "utf8");
  const b = Buffer.from(right, "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}

function sign(value: string) {
  return createHmac("sha256", getSecret()).update(value).digest("base64url");
}

function makeToken(payload: SessionPayload) {
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${encoded}.${sign(encoded)}`;
}

function parseToken(token: string): SessionPayload | null {
  if (token.length > 2048) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [encoded, signature] = parts;
  let expected: string;
  try {
    expected = sign(encoded);
  } catch {
    return null;
  }
  if (!safeEqual(signature, expected)) return null;

  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as SessionPayload;
    const now = Math.floor(Date.now() / 1000);
    if (
      payload.sub !== "admin" ||
      !Number.isInteger(payload.iat) ||
      !Number.isInteger(payload.exp) ||
      typeof payload.nonce !== "string" ||
      payload.exp <= now ||
      payload.iat > now + MAX_CLOCK_SKEW_SECONDS ||
      payload.exp - payload.iat !== SESSION_SECONDS
    ) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export function verifyAdminPassword(candidate: string, ip: string) {
  const now = Date.now();
  const current = attempts.get(ip);

  if (current && current.resetAt > now && current.count >= MAX_ATTEMPTS) {
    return { ok: false as const, limited: true as const };
  }
  if (!current || current.resetAt <= now) {
    attempts.set(ip, { count: 0, resetAt: now + WINDOW_MS });
  }

  const configured = getPassword();
  const ok = safeEqual(candidate, configured);

  if (ok) {
    attempts.delete(ip);
    return { ok: true as const, limited: false as const };
  }

  const state = attempts.get(ip)!;
  state.count += 1;
  attempts.set(ip, state);

  // Bound memory usage on warm serverless instances.
  if (attempts.size > 2000) {
    for (const [key, value] of attempts) {
      if (value.resetAt <= now) attempts.delete(key);
    }
  }
  return { ok: false as const, limited: state.count >= MAX_ATTEMPTS };
}

export async function createAdminSession() {
  const now = Math.floor(Date.now() / 1000);
  const token = makeToken({
    sub: "admin",
    iat: now,
    exp: now + SESSION_SECONDS,
    nonce: randomBytes(16).toString("base64url"),
  });

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_SECONDS,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function hasAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  return token ? parseToken(token) !== null : false;
}

export function isSameOriginRequest(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;

  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}
