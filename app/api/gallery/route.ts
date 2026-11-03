import { created, fail, handleApiError, ok } from "@/lib/api";
import { getGallery, logActivity } from "@/lib/data";
import { connectDB } from "@/lib/db";
import { GalleryItem } from "@/lib/models";
import { adminGuard } from "@/lib/route-helpers";
import { sanitizePlainText } from "@/lib/sanitize";
import { gallerySchema } from "@/lib/validation";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const items = await getGallery({
      album: searchParams.get("album") ?? undefined,
      limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : undefined,
    });
    return ok(items);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  const guard = await adminGuard();
  if (guard.response) return guard.response;

  try {
    const payload = gallerySchema.parse(await request.json());
    await connectDB();
    const count = await GalleryItem.countDocuments({});
    const item = await GalleryItem.create({
      ...payload,
      caption: sanitizePlainText(payload.caption ?? ""),
      album: sanitizePlainText(payload.album),
      displayOrder: payload.displayOrder || count + 1,
      uploadedAt: new Date(),
    });
    await logActivity({ action: "Uploaded", entity: "Gallery", detail: payload.caption || payload.album, actor: guard.session.name });
    return created({ id: String(item._id) });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request) {
  const guard = await adminGuard();
  if (guard.response) return guard.response;

  try {
    const body = await request.json();
    const order = body?.order as { id: string; displayOrder: number }[] | undefined;
    if (!Array.isArray(order)) return fail("An order array is required", 400);
    await connectDB();
    await Promise.all(
      order
        .filter((item) => /^[a-f0-9]{24}$/i.test(item.id))
        .map((item) =>
          GalleryItem.findByIdAndUpdate(item.id, { $set: { displayOrder: item.displayOrder } }, { runValidators: true })
        )
    );
    await logActivity({ action: "Reordered", entity: "Gallery", detail: `${order.length} photos`, actor: guard.session.name });
    return ok({ updated: order.length });
  } catch (error) {
    return handleApiError(error);
  }
}
