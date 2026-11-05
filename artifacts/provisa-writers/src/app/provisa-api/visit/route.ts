import { NextResponse } from "next/server";
import { hasSession } from "@/server/auth";
import { clientIp, recordVisit, tooManyRequests, visitSummary } from "@/server/insights";

export const dynamic = "force-dynamic";

const BOT_PATTERN = /bot|crawl|spider|slurp|preview|facebookexternalhit|whatsapp|headless|lighthouse/i;

export async function POST(request: Request) {
  if (BOT_PATTERN.test(request.headers.get("user-agent") ?? "")) {
    return NextResponse.json({ ok: true });
  }
  if (tooManyRequests(`visit:${clientIp(request)}`, 30, 60 * 60 * 1000)) {
    return NextResponse.json({ ok: true });
  }
  try {
    await recordVisit();
  } catch {
    // Counting a visit must never break the page.
  }
  return NextResponse.json({ ok: true });
}

export async function GET() {
  if (!(await hasSession())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  try {
    return NextResponse.json(await visitSummary());
  } catch {
    return NextResponse.json({ error: "Visitor numbers are unavailable." }, { status: 503 });
  }
}
