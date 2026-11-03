import type { Metadata } from "next";
import { TeamManager } from "@/components/admin/team-manager";
import { AdminPageHeader } from "@/components/admin/ui";
import { DemoNotice } from "@/components/admin/form";
import { demoMode, getTeam } from "@/lib/data";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Club leadership" };

export default async function AdminTeamPage() {
  const members = await getTeam({ activeOnly: false });

  return (
    <div>
      <AdminPageHeader
        title="Club leadership"
        description="Manage the executive committee, organizers, mentors and active debaters shown on the public team page."
      />
      <div className="mb-4">
        <DemoNotice show={demoMode()} />
      </div>
      <TeamManager initialItems={members} demo={demoMode()} />
    </div>
  );
}
