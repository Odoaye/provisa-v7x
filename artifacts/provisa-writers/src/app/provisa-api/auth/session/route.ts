import { NextResponse } from "next/server";
import { hasSession } from "@/server/auth";

export async function GET() {
  return NextResponse.json({ authenticated: await hasSession() });
}