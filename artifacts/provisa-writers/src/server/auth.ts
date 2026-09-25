import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "provisa_admin_session";
const MAX_AGE = 60 * 60 * 8;
const failures = new Map<string, { count: number; resetAt: number }>();
const PREVIEW_USERNAME = "pwadmin";
const PREVIEW_PASSWORD = "client123";
const PREVIEW_SESSION_SECRET =
  "provisa-preview-session-signing-key-rotate-before-launch";

function secret() {
  return PREVIEW_SESSION_SECRET;
}

function signature(value: string) {
  return createHmac("sha256", secret()).update(value).digest("base64url");
}

export function validCredentials(username: string, password: string) {
  return username === PREVIEW_USERNAME && password === PREVIEW_PASSWORD;
}

export function rateLimited(ip: string) {
  const current = failures.get(ip);
  if (!current || current.resetAt < Date.now()) return false;
  return current.count >= 8;
}

export function recordFailure(ip: string) {
  const current = failures.get(ip);
  if (!current || current.resetAt < Date.now()) {
    failures.set(ip, { count: 1, resetAt: Date.now() + 15 * 60 * 1000 });
  } else {
    current.count += 1;
  }
}

export async function createSession() {
  const payload = `${Date.now() + MAX_AGE * 1000}.${randomBytes(24).toString("base64url")}`;
  const jar = await cookies();
  jar.set(COOKIE_NAME, `${payload}.${signature(payload)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function clearSession() {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}

export async function hasSession() {
  const value = (await cookies()).get(COOKIE_NAME)?.value;
  if (!value) return false;
  const parts = value.split(".");
  if (parts.length !== 3) return false;
  const payload = `${parts[0]}.${parts[1]}`;
  const expected = Buffer.from(signature(payload));
  const received = Buffer.from(parts[2]);
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) return false;
  return Number(parts[0]) > Date.now();
}