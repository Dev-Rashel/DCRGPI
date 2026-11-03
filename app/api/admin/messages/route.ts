import { handleApiError, ok } from "@/lib/api";
import { getContactMessages } from "@/lib/data";
import { adminGuard } from "@/lib/route-helpers";

export async function GET(request: Request) {
  const guard = await adminGuard();
  if (guard.response) return guard.response;

  try {
    const { searchParams } = new URL(request.url);
    const items = await getContactMessages({
      status: searchParams.get("status") ?? "all",
      q: searchParams.get("q") ?? undefined,
      limit: 200,
    });
    return ok(items);
  } catch (error) {
    return handleApiError(error);
  }
}
