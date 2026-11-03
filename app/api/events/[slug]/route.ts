import { handleApiError, ok, fail } from "@/lib/api";
import { getEventBySlug, logActivity } from "@/lib/data";
import { connectDB } from "@/lib/db";
import { Event } from "@/lib/models";
import { adminGuard } from "@/lib/route-helpers";
import { sanitizePlainText, sanitizeRichText } from "@/lib/sanitize";
import { eventUpdateSchema } from "@/lib/validation";

type Params = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    const { slug } = await params;
    const event = await getEventBySlug(slug);
    if (!event) return fail("Event not found", 404);
    return ok(event);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request, { params }: Params) {
  const guard = await adminGuard();
  if (guard.response) return guard.response;

  try {
    const { slug: id } = await params;
    if (!/^[a-f0-9]{24}$/i.test(id)) return fail("Invalid event id", 400);

    const payload = eventUpdateSchema.parse(await request.json());
    await connectDB();

    const update: Record<string, unknown> = { ...payload };
    if (payload.description) update.description = sanitizeRichText(payload.description);
    if (payload.rules !== undefined) update.rules = sanitizePlainText(payload.rules ?? "");
    if (payload.startDate) update.startDate = new Date(payload.startDate);
    if (payload.endDate) update.endDate = new Date(payload.endDate);
    if (payload.registrationDeadline !== undefined) {
      update.registrationDeadline = payload.registrationDeadline ? new Date(payload.registrationDeadline) : null;
    }
    if (payload.slug) {
      const conflict = await Event.findOne({ slug: payload.slug, _id: { $ne: id } }).lean();
      if (conflict) return fail("An event with this slug already exists", 409);
    }

    const event = await Event.findByIdAndUpdate(id, { $set: update }, { new: true, runValidators: true });
    if (!event) return fail("Event not found", 404);

    await logActivity({
      action: payload.status ? `Set status to ${payload.status}` : "Updated",
      entity: "Event",
      detail: event.title,
      actor: guard.session.name,
    });
    return ok({ id: String(event._id) });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const guard = await adminGuard();
  if (guard.response) return guard.response;

  try {
    const { slug: id } = await params;
    if (!/^[a-f0-9]{24}$/i.test(id)) return fail("Invalid event id", 400);
    await connectDB();
    const event = await Event.findByIdAndDelete(id);
    if (!event) return fail("Event not found", 404);
    await logActivity({ action: "Deleted", entity: "Event", detail: event.title, actor: guard.session.name });
    return ok({ id });
  } catch (error) {
    return handleApiError(error);
  }
}
