import { fail, handleApiError, ok } from "@/lib/api";
import { logActivity } from "@/lib/data";
import { connectDB } from "@/lib/db";
import { EventRegistration } from "@/lib/models";
import { adminGuard } from "@/lib/route-helpers";
import { eventRegistrationUpdateSchema } from "@/lib/validation";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const guard = await adminGuard();
  if (guard.response) return guard.response;

  try {
    const { id } = await params;
    if (!/^[a-f0-9]{24}$/i.test(id)) return fail("Invalid registration id", 400);
    const payload = eventRegistrationUpdateSchema.parse(await request.json());
    await connectDB();
    const registration = await EventRegistration.findByIdAndUpdate(
      id,
      { $set: { status: payload.status } },
      { new: true, runValidators: true }
    );
    if (!registration) return fail("Registration not found", 404);
    await logActivity({
      action: `Marked ${payload.status}`,
      entity: "Event registration",
      detail: `${registration.name} — ${registration.eventTitle}`,
      actor: guard.session.name,
    });
    return ok({ id: String(registration._id), status: registration.status });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const guard = await adminGuard();
  if (guard.response) return guard.response;

  try {
    const { id } = await params;
    if (!/^[a-f0-9]{24}$/i.test(id)) return fail("Invalid registration id", 400);
    await connectDB();
    const registration = await EventRegistration.findByIdAndDelete(id);
    if (!registration) return fail("Registration not found", 404);
    await logActivity({
      action: "Removed registration",
      entity: "Event",
      detail: `${registration.name} — ${registration.eventTitle}`,
      actor: guard.session.name,
    });
    return ok({ id });
  } catch (error) {
    return handleApiError(error);
  }
}
