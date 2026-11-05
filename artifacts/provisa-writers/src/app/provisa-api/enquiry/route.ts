import { NextResponse } from "next/server";
import { hasSession } from "@/server/auth";
import {
  clientIp,
  deleteEnquiry,
  listEnquiries,
  parseEnquiry,
  saveEnquiry,
  tooManyRequests,
} from "@/server/insights";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  // Hidden field that people never fill in; bots usually do.
  if (body && typeof body.website === "string" && body.website.trim()) {
    return NextResponse.json({ ok: true });
  }

  if (tooManyRequests(`enquiry:${clientIp(request)}`, 5, 10 * 60 * 1000)) {
    return NextResponse.json(
      { error: "Too many messages. Please try again later or email info@provisawriters.com." },
      { status: 429 },
    );
  }

  const parsed = parseEnquiry(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    await saveEnquiry(parsed.value);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Your message could not be saved." }, { status: 503 });
  }
}

export async function GET() {
  if (!(await hasSession())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  try {
    return NextResponse.json({ enquiries: await listEnquiries() });
  } catch {
    return NextResponse.json({ error: "Enquiries are unavailable." }, { status: 503 });
  }
}

export async function DELETE(request: Request) {
  if (!(await hasSession())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing enquiry." }, { status: 400 });
  try {
    await deleteEnquiry(id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "The enquiry could not be deleted." }, { status: 503 });
  }
}
