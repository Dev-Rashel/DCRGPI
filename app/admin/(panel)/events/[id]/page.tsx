import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/ui";
import { DemoNotice } from "@/components/admin/form";
import { EventForm } from "@/components/admin/event-form";
import { demoMode, getEventById } from "@/lib/data";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Edit event" };

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await getEventById(id);
  if (!event) notFound();

  return (
    <div>
      <AdminPageHeader
        title="Edit event"
        description={`Editing “${event.title}”. Registration settings update immediately.`}
      />
      <div className="mb-4">
        <DemoNotice show={demoMode()} />
      </div>
      <EventForm event={event} demo={demoMode()} />
    </div>
  );
}
