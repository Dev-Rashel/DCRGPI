import { handleApiError, ok } from "@/lib/api";
import { getMembershipApplications } from "@/lib/data";
import { adminGuard } from "@/lib/route-helpers";

export async function GET(request: Request) {
  const guard = await adminGuard();
  if (guard.response) return guard.response;

  try {
    const { searchParams } = new URL(request.url);
    const result = await getMembershipApplications({
      status: searchParams.get("status") ?? "all",
      q: searchParams.get("q") ?? undefined,
      page: Math.max(1, Number(searchParams.get("page") ?? 1)),
      limit: Math.min(100, Math.max(1, Number(searchParams.get("limit") ?? 20))),
    });
    return ok(result);
  } catch (error) {
    return handleApiError(error);
  }
}
