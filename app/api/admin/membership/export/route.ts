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
      "Group",
      "Email",
      "Phone",
      "Father's Name",
      "Mother's Name",
      "Previous Debate Experience",
      "Can Give Regular Time",
      "Status",
      "Submitted",
      "Reviewed",
      "Notes",
      "Experience Details",
      "Motivation",
    ];

    const rows = items.map((item) =>
      [
        item.referenceNo,
        item.name,
        item.studentId,
        item.department,
        item.semester,
        item.group,
        item.email,
        item.phone,
        item.fatherName,
        item.motherName,
        item.hasDebateExperience === "yes" ? "Yes" : "No",
        item.canCommitTime === "yes" ? "Yes" : "No",
        item.status,
        item.submittedAt,
        item.reviewedAt ?? "",
        item.notes,
        item.experience,
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
        "Content-Disposition": `attachment; filename="dcrgpi-memberships-${stamp}.csv"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
