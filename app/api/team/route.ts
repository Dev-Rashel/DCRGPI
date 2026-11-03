import { fail, handleApiError, created, ok } from "@/lib/api";
import { connectDB } from "@/lib/db";
import { TeamMember } from "@/lib/models";
import { adminGuard } from "@/lib/route-helpers";
import { sanitizePlainText } from "@/lib/sanitize";
import { getTeam, logActivity } from "@/lib/data";
import { teamMemberSchema } from "@/lib/validation";

export async function GET() {
  try {
    const members = await getTeam({ activeOnly: false });
    return ok(members);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  const guard = await adminGuard();
  if (guard.response) return guard.response;

  try {
    const payload = teamMemberSchema.parse(await request.json());
    await connectDB();

    const count = await TeamMember.countDocuments({});
    const member = await TeamMember.create({
      ...payload,
      name: sanitizePlainText(payload.name),
      designation: sanitizePlainText(payload.designation),
      bio: sanitizePlainText(payload.bio ?? ""),
      department: sanitizePlainText(payload.department ?? ""),
      displayOrder: payload.displayOrder || count + 1,
      socialLinks: payload.socialLinks ?? {},
    });

    await logActivity({
      action: "Added",
      entity: "Team member",
      detail: member.name,
      actor: guard.session.name,
    });

    return created({ id: String(member._id) });
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
          TeamMember.findByIdAndUpdate(item.id, { $set: { displayOrder: item.displayOrder } }, { runValidators: true })
        )
    );

    await logActivity({ action: "Reordered", entity: "Team", detail: `${order.length} members`, actor: guard.session.name });
    return ok({ updated: order.length });
  } catch (error) {
    return handleApiError(error);
  }
}
