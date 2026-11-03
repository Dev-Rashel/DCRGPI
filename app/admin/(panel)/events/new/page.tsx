import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/ui";
import { DemoNotice } from "@/components/admin/form";
import { EventForm } from "@/components/admin/event-form";
import { demoMode } from "@/lib/data";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "New event" };

export default function NewEventPage() {
  const demo = demoMode();
  return (
    <div>
      <AdminPageHeader
        title="Create an event"
        description="Set the schedule, venue and registration options. You can publish now or keep it as a draft."
      />
      <div className="mb-4">
        <DemoNotice show={demo} />
      </div>
      <EventForm demo={demo} />
    </div>
  );
}
