import { handleApiError, created, ok, fail } from "@/lib/api";
import { getEvents, logActivity } from "@/lib/data";
import { connectDB } from "@/lib/db";
import { Event } from "@/lib/models";
import { adminGuard } from "@/lib/route-helpers";
import { sanitizePlainText, sanitizeRichText } from "@/lib/sanitize";
import { eventSchema } from "@/lib/validation";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const phaseParam = searchParams.get("phase");
    const phase =
      phaseParam === "upcoming" || phaseParam === "ongoing" || phaseParam === "past" ? phaseParam : "all";
    const result = await getEvents({
      phase,
      category: searchParams.get("category") ?? undefined,
      q: searchParams.get("q") ?? undefined,
      page: Math.max(1, Number(searchParams.get("page") ?? 1)),
      limit: Math.min(100, Math.max(1, Number(searchParams.get("limit") ?? 30))),
    });
    return ok(result);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  const guard = await adminGuard();
  if (guard.response) return guard.response;

  try {
    const payload = eventSchema.parse(await request.json());
    await connectDB();

    const existing = await Event.findOne({ slug: payload.slug }).lean();
    if (existing) return fail("An event with this slug already exists", 409);

    const event = await Event.create({
      ...payload,
      description: sanitizeRichText(payload.description),
      rules: sanitizePlainText(payload.rules ?? ""),
      registrationDeadline: payload.registrationDeadline ? new Date(payload.registrationDeadline) : null,
      startDate: new Date(payload.startDate),
      endDate: new Date(payload.endDate),
    });

    await logActivity({
      action: payload.status === "published" ? "Published" : "Created draft",
      entity: "Event",
      detail: payload.title,
      actor: guard.session.name,
    });

    return created({ id: String(event._id), slug: event.slug });
  } catch (error) {
    return handleApiError(error);
  }
}
