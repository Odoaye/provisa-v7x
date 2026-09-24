import { NextResponse } from "next/server";
import { hasSession } from "@/server/auth";
import { saveContent, seedContent } from "@/server/content";

export async function GET() {
  try {
    return NextResponse.json(await seedContent());
  } catch {
    return NextResponse.json(
      { error: "Content storage is unavailable." },
      { status: 503 },
    );
  }
}

export async function PUT(request: Request) {
  if (!(await hasSession())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const payload = await request.json().catch(() => null);
  if (!payload || typeof payload !== "object") {
    return NextResponse.json({ error: "Invalid content." }, { status: 400 });
  }

  try {
    return NextResponse.json(await saveContent(payload));
  } catch {
    return NextResponse.json(
      { error: "Content storage is unavailable." },
      { status: 503 },
    );
  }
}