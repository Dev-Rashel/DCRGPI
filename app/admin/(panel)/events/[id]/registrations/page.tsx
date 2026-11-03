import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, MapPin, Pencil, Users } from "lucide-react";
import { AdminButton, AdminPageHeader, StatusBadge } from "@/components/admin/ui";
import { DemoNotice } from "@/components/admin/form";
import { RegistrationsManager } from "@/components/admin/registrations-manager";
import { Badge } from "@/components/ui/badge";
import { demoMode, getEventById, getEventRegistrations } from "@/lib/data";
import { formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Event registrations" };

export default async function EventRegistrationsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await getEventById(id);
  if (!event) notFound();
  const registrations = await getEventRegistrations(event.id);

  return (
    <div>
      <div className="mb-4">
        <Link
          href="/admin/events"
          className="inline-flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-cream/40 transition hover:text-gold-300"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to events
        </Link>
      </div>

      <AdminPageHeader
        title="Event registrations"
        description={event.title}
        actions={
          <>
            <AdminButton href={`/admin/events/${event.id}`} variant="outline">
              <Pencil className="h-3.5 w-3.5" /> Edit event
            </AdminButton>
            {event.status === "published" && (
              <AdminButton href={`/events/${event.slug}`} variant="ghost" target="_blank">
                View live page
              </AdminButton>
            )}
          </>
        }
      />

      <div className="mb-5 space-y-3">
        <DemoNotice show={demoMode()} />
        <div className="surface flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">{event.category}</Badge>
              <StatusBadge status={event.registrationStatus} />
              <Badge variant={event.status === "published" ? "success" : "muted"}>{event.status}</Badge>
            </div>
            <p className="flex items-center gap-2 text-sm text-cream/70">
              <CalendarDays className="h-4 w-4 text-gold-400/70" /> {formatDateTime(event.startDate)}
            </p>
            <p className="flex items-center gap-2 text-xs text-cream/40">
              <MapPin className="h-3.5 w-3.5" /> {event.venue}
              <span className="text-cream/20">·</span>
              <Users className="h-3.5 w-3.5" /> Capacity: {event.capacity > 0 ? event.capacity : "Unlimited"}
            </p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-[0.55rem] font-semibold uppercase tracking-[0.16em] text-cream/30">Registered</p>
            <p className="font-display text-3xl font-semibold text-cream">{registrations.length}</p>
            {event.capacity > 0 && (
              <p className="text-[0.65rem] text-cream/35">{Math.max(0, event.capacity - registrations.length)} spots remaining</p>
            )}
          </div>
        </div>
      </div>

      <RegistrationsManager eventTitle={event.title} initialItems={registrations} demo={demoMode()} />
    </div>
  );
}
