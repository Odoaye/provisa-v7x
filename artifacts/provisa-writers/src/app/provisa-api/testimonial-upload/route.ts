import { handleUpload } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { hasSession } from "@/server/auth";

const allowedContentTypes = [
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/webp",
];
const maxImageSize = 10 * 1024 * 1024;

export async function POST(request: Request) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "Screenshot uploads are only available in the Vercel deployment." },
      { status: 503 },
    );
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid upload request." }, { status: 400 });
  }

  try {
    const response = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (!(await hasSession())) throw new Error("Unauthorized.");
        if (!pathname.startsWith("testimonials/")) {
          throw new Error("Invalid screenshot path.");
        }
        return {
          allowedContentTypes,
          maximumSizeInBytes: maxImageSize,
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async () => undefined,
    });
    return NextResponse.json(response);
  } catch {
    return NextResponse.json(
      { error: "Could not prepare the screenshot upload. Please try again." },
      { status: 400 },
    );
  }
}