import { handleProvisaImageUpload } from "@/server/image-upload";

export async function POST(request: Request) {
  return handleProvisaImageUpload(request);
}