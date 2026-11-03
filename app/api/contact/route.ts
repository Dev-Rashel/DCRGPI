import { created, fail, handleApiError } from "@/lib/api";
import { connectDB, isDbConfigured } from "@/lib/db";
import { ContactMessage } from "@/lib/models";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { sanitizePlainText } from "@/lib/sanitize";
import { contactSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const limited = rateLimit(clientKey(request, "contact"), 4, 10 * 60_000);
  if (!limited.success) {
    return fail(`Too many messages from this device. Try again in ${limited.retryAfter} seconds.`, 429);
  }

  try {
    const payload = contactSchema.parse(await request.json());

    if (!isDbConfigured()) {
      return fail("The contact form is temporarily unavailable because the database is not configured.", 503);
    }
    await connectDB();

    const message = await ContactMessage.create({
      name: sanitizePlainText(payload.name),
      email: payload.email.toLowerCase(),
      subject: sanitizePlainText(payload.subject),
      message: sanitizePlainText(payload.message),
      status: "unread",
      submittedAt: new Date(),
    });

    return created({ id: String(message._id) });
  } catch (error) {
    return handleApiError(error);
  }
}
