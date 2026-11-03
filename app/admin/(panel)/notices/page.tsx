import type { Metadata } from "next";
import { NoticesManager } from "@/components/admin/notices-manager";
import { AdminPageHeader } from "@/components/admin/ui";
import { DemoNotice } from "@/components/admin/form";
import { demoMode, getNotices } from "@/lib/data";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Notices" };

export default async function AdminNoticesPage() {
  const notices = await getNotices({ includeDrafts: true });

  return (
    <div>
      <AdminPageHeader
        title="Notices & announcements"
        description="Short updates shown in the notice bar and on the homepage. Schedule or expire them automatically."
      />
      <div className="mb-4">
        <DemoNotice show={demoMode()} />
      </div>
      <NoticesManager initialItems={notices} demo={demoMode()} />
    </div>
  );
}
