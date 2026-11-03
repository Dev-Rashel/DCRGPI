import { fail, handleApiError, ok } from "@/lib/api";
import { logActivity } from "@/lib/data";
import { connectDB } from "@/lib/db";
import { Membership } from "@/lib/models";
import { adminGuard } from "@/lib/route-helpers";
import { sanitizePlainText } from "@/lib/sanitize";
import { membershipUpdateSchema } from "@/lib/validation";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const guard = await adminGuard();
  if (guard.response) return guard.response;

  try {
    const { id } = await params;
    if (!/^[a-f0-9]{24}$/i.test(id)) return fail("Invalid application id", 400);
    const payload = membershipUpdateSchema.parse(await request.json());
    await connectDB();

    const update: Record<string, unknown> = {};
    if (payload.status) {
      update.status = payload.status;
      update.reviewedAt = new Date();
    }
    if (payload.notes !== undefined) update.notes = sanitizePlainText(payload.notes);

    const application = await Membership.findByIdAndUpdate(id, { $set: update }, { new: true, runValidators: true });
    if (!application) return fail("Application not found", 404);

    await logActivity({
      action: payload.status ? `Marked ${payload.status}` : "Updated notes for",
      entity: "Membership",
      detail: application.name,
      actor: guard.session.name,
    });

    return ok({ id: String(application._id), status: application.status });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const guard = await adminGuard();
  if (guard.response) return guard.response;

  try {
    const { id } = await params;
    if (!/^[a-f0-9]{24}$/i.test(id)) return fail("Invalid application id", 400);
    await connectDB();
    const application = await Membership.findByIdAndDelete(id);
    if (!application) return fail("Application not found", 404);
    await logActivity({ action: "Deleted", entity: "Membership", detail: application.name, actor: guard.session.name });
    return ok({ id });
  } catch (error) {
    return handleApiError(error);
  }
}
