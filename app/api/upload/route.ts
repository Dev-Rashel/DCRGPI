import { fail, handleApiError, ok } from "@/lib/api";
import { getSession } from "@/lib/auth";
import { isCloudinaryConfigured, uploadImage } from "@/lib/cloudinary";

const MAX_BYTES = 4 * 1024 * 1024; // 4 MB (Vercel request limit is 4.5 MB)
const ALLOWED = ["image/png", "image/jpeg", "image/webp", "image/gif"];

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return fail("Unauthorized", 401);

  if (!isCloudinaryConfigured()) {
    return fail(
      "Cloudinary is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET, or paste an image URL instead.",
      503
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) return fail("No file uploaded", 400);

    if (!ALLOWED.includes(file.type)) {
      return fail("Unsupported file type. Use PNG, JPG, WebP or GIF.", 415);
    }
    if (file.size > MAX_BYTES) {
      return fail("File is too large. Maximum size is 4 MB.", 413);
    }

    const folder = String(formData.get("folder") ?? "dcrpi").replace(/[^a-z0-9/_-]/gi, "");
    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadImage(buffer, `dcrpi/${folder || "general"}`);

    return ok({ url: result.url, publicId: result.publicId });
  } catch (error) {
    return handleApiError(error);
  }
}
