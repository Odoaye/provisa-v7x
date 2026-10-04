import { handleUpload } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { hasSession } from "@/server/auth";

const allowedContentTypes = [
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/webp",
];
const allowedFolders = ["blog", "founder", "staff", "testimonials"] as const;
const maxImageSize = 10 * 1024 * 1024;

type ImageFolder = (typeof allowedFolders)[number];

export async function handleProvisaImageUpload(
  request: Request,
  folders: readonly ImageFolder[] = allowedFolders,
) {
  if (!(await hasSession())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "Image uploads are only available in the Vercel deployment." },
      { status: 503 },
    );
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json(
      { error: "Invalid upload request." },
      { status: 400 },
    );
  }

  try {
    const response = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        const [folder, ...segments] = pathname.split("/");
        if (
          !folders.includes(folder as ImageFolder) ||
          segments.length === 0 ||
          segments.some((segment) => !segment || segment === "." || segment === "..")
        ) {
          throw new Error("Invalid image path.");
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
      { error: "Could not prepare the image upload. Please try again." },
      { status: 400 },
    );
  }
}