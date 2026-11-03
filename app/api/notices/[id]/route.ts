import { fail, handleApiError, ok } from "@/lib/api";
import { getNoticeById, logActivity } from "@/lib/data";
import { connectDB } from "@/lib/db";
import { Notice } from "@/lib/models";
import { adminGuard } from "@/lib/route-helpers";
import { sanitizePlainText } from "@/lib/sanitize";
import { noticeSchema } from "@/lib/validation";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const notice = await getNoticeById(id);
    if (!notice) return fail("Notice not found", 404);
    return ok(notice);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request, { params }: Params) {
  const guard = await adminGuard();
  if (guard.response) return guard.response;

  try {
    const { id } = await params;
    if (!/^[a-f0-9]{24}$/i.test(id)) return fail("Invalid notice id", 400);
    const payload = noticeSchema.partial().parse(await request.json());
    await connectDB();

    const update: Record<string, unknown> = { ...payload };
    if (payload.title) update.title = sanitizePlainText(payload.title);
    if (payload.content) update.content = sanitizePlainText(payload.content);
    if (payload.publishedAt !== undefined) {
      update.publishedAt = payload.publishedAt ? new Date(payload.publishedAt) : new Date();
    }
    if (payload.expiresAt !== undefined) {
      update.expiresAt = payload.expiresAt ? new Date(payload.expiresAt) : null;
    }

    const notice = await Notice.findByIdAndUpdate(id, { $set: update }, { new: true, runValidators: true });
    if (!notice) return fail("Notice not found", 404);
    await logActivity({ action: "Updated", entity: "Notice", detail: notice.title, actor: guard.session.name });
    return ok({ id: String(notice._id) });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const guard = await adminGuard();
  if (guard.response) return guard.response;

  try {
    const { id } = await params;
    if (!/^[a-f0-9]{24}$/i.test(id)) return fail("Invalid notice id", 400);
    await connectDB();
    const notice = await Notice.findByIdAndDelete(id);
    if (!notice) return fail("Notice not found", 404);
    await logActivity({ action: "Deleted", entity: "Notice", detail: notice.title, actor: guard.session.name });
    return ok({ id });
  } catch (error) {
    return handleApiError(error);
  }
}
