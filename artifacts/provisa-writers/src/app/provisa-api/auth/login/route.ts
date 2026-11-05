import { NextResponse } from "next/server";
import {
  adminLoginConfigured,
  createSession,
  rateLimited,
  recordFailure,
  validCredentials,
} from "@/server/auth";

export async function POST(request: Request) {
  if (!adminLoginConfigured()) {
    return NextResponse.json(
      { error: "Admin sign-in is not set up yet. Add ADMIN_USERNAME and ADMIN_PASSWORD in Vercel." },
      { status: 503 },
    );
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many attempts. Try again later." },
      { status: 429 },
    );
  }

  const body = await request.json().catch(() => null);
  if (
    !body ||
    typeof body.username !== "string" ||
    typeof body.password !== "string" ||
    !validCredentials(body.username, body.password)
  ) {
    recordFailure(ip);
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  await createSession();
  return NextResponse.json({ authenticated: true });
}