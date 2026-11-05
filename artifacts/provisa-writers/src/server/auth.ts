import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "provisa_admin_session";
const MAX_AGE = 60 * 60 * 8;
const failures = new Map<string, { count: number; resetAt: number }>();
function adminUsername() {
  return process.env.ADMIN_USERNAME?.trim() || "";
}

function adminPassword() {
  return process.env.ADMIN_PASSWORD || "";
}

export function adminLoginConfigured() {
  return Boolean(adminUsername() && adminPassword());
}

function secret() {
  const configured = process.env.SESSION_SECRET;
  if (configured && configured.length >= 32) return configured;
  // Without a dedicated secret, derive one from the private admin settings so
  // sessions still cannot be forged and end when the password changes.
  return createHash("sha256")
    .update(`provisa-admin-session:${adminUsername()}:${adminPassword()}`)
    .digest("base64url");
}

function signature(value: string) {
  return createHmac("sha256", secret()).update(value).digest("base64url");
}

function sameText(a: string, b: string) {
  const left = createHash("sha256").update(a).digest();
  const right = createHash("sha256").update(b).digest();
  return timingSafeEqual(left, right);
}

export function validCredentials(username: string, password: string) {
  if (!adminLoginConfigured()) return false;
  const userOk = sameText(username.trim(), adminUsername());
  const passOk = sameText(password, adminPassword());
  return userOk && passOk;
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
  if (!adminLoginConfigured()) return false;
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