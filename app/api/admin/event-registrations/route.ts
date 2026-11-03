import { handleApiError, ok, fail } from "@/lib/api";
import { getEventRegistrations } from "@/lib/data";
import { adminGuard } from "@/lib/route-helpers";

export async function GET(request: Request) {
  const guard = await adminGuard();
  if (guard.response) return guard.response;

  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("eventId");
    if (!eventId) return fail("eventId is required", 400);
    const items = await getEventRegistrations(eventId);
    return ok(items);
  } catch (error) {
    return handleApiError(error);
  }
}
