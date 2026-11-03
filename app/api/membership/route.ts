import { fail, handleApiError, created } from "@/lib/api";
import { connectDB, isDbConfigured } from "@/lib/db";
import { Membership } from "@/lib/models";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { referenceNumber } from "@/lib/route-helpers";
import { sanitizePlainText } from "@/lib/sanitize";
import { membershipSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const limited = rateLimit(clientKey(request, "membership"), 4, 15 * 60_000);
  if (!limited.success) {
    return fail(`Too many applications from this device. Try again in ${limited.retryAfter} seconds.`, 429);
  }

  try {
    const payload = membershipSchema.parse(await request.json());

    if (!isDbConfigured()) {
      return fail(
        "Membership applications are temporarily unavailable because the database is not configured.",
        503
      );
    }
    await connectDB();

    const duplicate = await Membership.findOne({
      $or: [
        { email: payload.email.toLowerCase() },
        { studentId: { $regex: `^${payload.studentId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, $options: "i" } },
      ],
    }).lean();

    if (duplicate) {
      return fail("An application with this email or student ID already exists.", 409, {
        referenceNo: duplicate.referenceNo,
      });
    }

    const application = await Membership.create({
      name: sanitizePlainText(payload.name),
      studentId: sanitizePlainText(payload.studentId),
      department: sanitizePlainText(payload.department),
      semester: sanitizePlainText(payload.semester),
      email: payload.email.toLowerCase(),
      phone: payload.phone,
      photo: payload.photo ?? "",
      experience: sanitizePlainText(payload.experience ?? ""),
      motivation: sanitizePlainText(payload.motivation),
      activities: sanitizePlainText(payload.activities ?? ""),
      status: "pending",
      referenceNo: referenceNumber("DCRPI"),
      submittedAt: new Date(),
    });

    return created({
      referenceNo: application.referenceNo,
      status: application.status,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
