import { fail, handleApiError } from "@/lib/api";
import { getMembershipApplications } from "@/lib/data";
import { adminGuard, csvEscape } from "@/lib/route-helpers";

export async function GET() {
  const guard = await adminGuard();
  if (guard.response) return guard.response;

  try {
    const { items } = await getMembershipApplications({ limit: 1000 });

    const headers = [
      "Reference",
      "Name",
      "Student ID",
      "Department",
      "Semester",
      "Email",
      "Phone",
      "Status",
      "Submitted",
      "Reviewed",
      "Notes",
      "Motivation",
    ];

    const rows = items.map((item) =>
      [
        item.referenceNo,
        item.name,
        item.studentId,
        item.department,
        item.semester,
        item.email,
        item.phone,
        item.status,
        item.submittedAt,
        item.reviewedAt ?? "",
        item.notes,
        item.motivation,
      ]
        .map(csvEscape)
        .join(",")
    );

    const csv = `\uFEFF${headers.map(csvEscape).join(",")}\n${rows.join("\n")}`;
    const stamp = new Date().toISOString().slice(0, 10);

    return new Response(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="dcrpi-memberships-${stamp}.csv"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
