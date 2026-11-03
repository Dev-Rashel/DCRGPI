import { fail, handleApiError, ok } from "@/lib/api";
import { getTeamMemberById, logActivity } from "@/lib/data";
import { connectDB } from "@/lib/db";
import { TeamMember } from "@/lib/models";
import { adminGuard } from "@/lib/route-helpers";
import { sanitizePlainText } from "@/lib/sanitize";
import { teamMemberSchema } from "@/lib/validation";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const member = await getTeamMemberById(id);
    if (!member) return fail("Team member not found", 404);
    return ok(member);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request, { params }: Params) {
  const guard = await adminGuard();
  if (guard.response) return guard.response;

  try {
    const { id } = await params;
    if (!/^[a-f0-9]{24}$/i.test(id)) return fail("Invalid member id", 400);
    const payload = teamMemberSchema.partial().parse(await request.json());
    await connectDB();

    const update: Record<string, unknown> = { ...payload };
    if (payload.name) update.name = sanitizePlainText(payload.name);
    if (payload.designation) update.designation = sanitizePlainText(payload.designation);
    if (payload.bio !== undefined) update.bio = sanitizePlainText(payload.bio ?? "");
    if (payload.department !== undefined) update.department = sanitizePlainText(payload.department ?? "");

    const member = await TeamMember.findByIdAndUpdate(id, { $set: update }, { new: true, runValidators: true });
    if (!member) return fail("Team member not found", 404);

    await logActivity({
      action: "Updated",
      entity: "Team member",
      detail: member.name,
      actor: guard.session.name,
    });
    return ok({ id: String(member._id) });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const guard = await adminGuard();
  if (guard.response) return guard.response;

  try {
    const { id } = await params;
    if (!/^[a-f0-9]{24}$/i.test(id)) return fail("Invalid member id", 400);
    await connectDB();
    const member = await TeamMember.findByIdAndDelete(id);
    if (!member) return fail("Team member not found", 404);
    await logActivity({ action: "Removed", entity: "Team member", detail: member.name, actor: guard.session.name });
    return ok({ id });
  } catch (error) {
    return handleApiError(error);
  }
}
