import { fail, handleApiError, ok } from "@/lib/api";
import { logActivity } from "@/lib/data";
import { connectDB } from "@/lib/db";
import { ContactMessage } from "@/lib/models";
import { adminGuard } from "@/lib/route-helpers";
import { messageUpdateSchema } from "@/lib/validation";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const guard = await adminGuard();
  if (guard.response) return guard.response;

  try {
    const { id } = await params;
    if (!/^[a-f0-9]{24}$/i.test(id)) return fail("Invalid message id", 400);
    const payload = messageUpdateSchema.parse(await request.json());
    await connectDB();

    const message = await ContactMessage.findByIdAndUpdate(id, { $set: payload }, { new: true });
    if (!message) return fail("Message not found", 404);
    return ok({ id: String(message._id), status: message.status });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const guard = await adminGuard();
  if (guard.response) return guard.response;

  try {
    const { id } = await params;
    if (!/^[a-f0-9]{24}$/i.test(id)) return fail("Invalid message id", 400);
    await connectDB();
    const message = await ContactMessage.findByIdAndDelete(id);
    if (!message) return fail("Message not found", 404);
    await logActivity({ action: "Deleted", entity: "Message", detail: message.subject, actor: guard.session.name });
    return ok({ id });
  } catch (error) {
    return handleApiError(error);
  }
}
