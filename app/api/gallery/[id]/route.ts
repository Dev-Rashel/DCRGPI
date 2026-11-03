import { fail, handleApiError, ok } from "@/lib/api";
import { getGalleryById, logActivity } from "@/lib/data";
import { connectDB } from "@/lib/db";
import { GalleryItem } from "@/lib/models";
import { adminGuard } from "@/lib/route-helpers";
import { sanitizePlainText } from "@/lib/sanitize";
import { gallerySchema } from "@/lib/validation";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const item = await getGalleryById(id);
    if (!item) return fail("Gallery item not found", 404);
    return ok(item);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request, { params }: Params) {
  const guard = await adminGuard();
  if (guard.response) return guard.response;

  try {
    const { id } = await params;
    if (!/^[a-f0-9]{24}$/i.test(id)) return fail("Invalid gallery id", 400);
    const payload = gallerySchema.partial().parse(await request.json());
    await connectDB();

    const update = { ...payload };
    if (payload.caption !== undefined) update.caption = sanitizePlainText(payload.caption ?? "");
    if (payload.album) update.album = sanitizePlainText(payload.album);

    const item = await GalleryItem.findByIdAndUpdate(id, { $set: update }, { new: true, runValidators: true });
    if (!item) return fail("Gallery item not found", 404);
    await logActivity({ action: "Updated", entity: "Gallery", detail: item.caption || item.album, actor: guard.session.name });
    return ok({ id: String(item._id) });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const guard = await adminGuard();
  if (guard.response) return guard.response;

  try {
    const { id } = await params;
    if (!/^[a-f0-9]{24}$/i.test(id)) return fail("Invalid gallery id", 400);
    await connectDB();
    const item = await GalleryItem.findByIdAndDelete(id);
    if (!item) return fail("Gallery item not found", 404);
    await logActivity({ action: "Deleted", entity: "Gallery", detail: item.caption || item.album, actor: guard.session.name });
    return ok({ id });
  } catch (error) {
    return handleApiError(error);
  }
}
