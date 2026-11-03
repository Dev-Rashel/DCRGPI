import { created, handleApiError, ok } from "@/lib/api";
import { getNotices, logActivity } from "@/lib/data";
import { connectDB } from "@/lib/db";
import { Notice } from "@/lib/models";
import { adminGuard } from "@/lib/route-helpers";
import { sanitizePlainText } from "@/lib/sanitize";
import { noticeSchema } from "@/lib/validation";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const notices = await getNotices({
      limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : undefined,
    });
    return ok(notices);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  const guard = await adminGuard();
  if (guard.response) return guard.response;

  try {
    const payload = noticeSchema.parse(await request.json());
    await connectDB();
    const notice = await Notice.create({
      ...payload,
      title: sanitizePlainText(payload.title),
      content: sanitizePlainText(payload.content),
      publishedAt: payload.publishedAt ? new Date(payload.publishedAt) : new Date(),
      expiresAt: payload.expiresAt ? new Date(payload.expiresAt) : null,
    });
    await logActivity({ action: "Published", entity: "Notice", detail: notice.title, actor: guard.session.name });
    return created({ id: String(notice._id) });
  } catch (error) {
    return handleApiError(error);
  }
}
