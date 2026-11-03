import { fail, handleApiError, created } from "@/lib/api";
import { connectDB, isDbConfigured } from "@/lib/db";
import { Event, EventRegistration } from "@/lib/models";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { referenceNumber } from "@/lib/route-helpers";
import { sanitizePlainText } from "@/lib/sanitize";
import { eventRegistrationSchema } from "@/lib/validation";

type Params = { params: Promise<{ slug: string }> };

export async function POST(request: Request, { params }: Params) {
  const limited = rateLimit(clientKey(request, "event-registration"), 6, 10 * 60_000);
  if (!limited.success) {
    return fail(`Too many registrations from this device. Try again in ${limited.retryAfter} seconds.`, 429);
  }

  try {
    const { slug } = await params;
    const payload = eventRegistrationSchema.parse(await request.json());

    if (!isDbConfigured()) {
      return fail("Event registration is unavailable because the database is not configured.", 503);
    }
    await connectDB();

    const event = await Event.findOne({ slug, status: "published" }).lean();
    if (!event) return fail("Event not found", 404);

    if (event.registrationStatus === "closed") return fail("Registration for this event is closed.", 400);
    if (event.registrationStatus === "coming-soon") return fail("Registration for this event has not opened yet.", 400);
    if (event.registrationDeadline && new Date(event.registrationDeadline).getTime() < Date.now()) {
      return fail("The registration deadline has passed.", 400);
    }

    const eventId = String(event._id);

    if (event.capacity > 0) {
      const count = await EventRegistration.countDocuments({ eventId, status: "confirmed" });
      if (count >= event.capacity) return fail("This event is now at full capacity.", 409);
    }

    const duplicate = await EventRegistration.findOne({
      eventId,
      $or: [{ email: payload.email.toLowerCase() }, { studentId: payload.studentId }],
    }).lean();
    if (duplicate) {
      return fail("You are already registered for this event.", 409, {
        referenceNo: duplicate.referenceNo,
      });
    }

    const registration = await EventRegistration.create({
      eventId,
      eventTitle: event.title,
      name: sanitizePlainText(payload.name),
      studentId: sanitizePlainText(payload.studentId),
      email: payload.email.toLowerCase(),
      phone: payload.phone,
      department: sanitizePlainText(payload.department ?? ""),
      referenceNo: referenceNumber("EVT"),
    });

    return created({ referenceNo: registration.referenceNo });
  } catch (error) {
    return handleApiError(error);
  }
}
