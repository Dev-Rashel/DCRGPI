import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, MapPin, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { eventPhase, type getEvents } from "@/lib/data";
import { formatDate, formatDateTime } from "@/lib/utils";
import type { EventDTO } from "@/lib/types";
import { PostPlaceholder } from "./placeholders";

const statusMap = {
  open: { label: "Registration open", variant: "success" as const },
  closed: { label: "Registration closed", variant: "muted" as const },
  "coming-soon": { label: "Coming soon", variant: "warning" as const },
};

export function EventCard({ event }: { event: EventDTO }) {
  const phase = eventPhase(event);
  const status = statusMap[event.registrationStatus];

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02] transition duration-500 hover:-translate-y-1 hover:border-gold-400/30 hover:shadow-card">
      <Link href={`/events/${event.slug}`} className="relative block aspect-[16/9] overflow-hidden">
        {event.image ? (
          <Image
            src={event.image}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition duration-700 group-hover:scale-105"
          />
        ) : (
          <PostPlaceholder title={event.title} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/10 to-transparent" />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <Badge>{event.category}</Badge>
          {phase === "ongoing" && <Badge variant="success">Live now</Badge>}
          {phase === "past" && <Badge variant="muted">Past event</Badge>}
        </div>
        <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-lg bg-ink-950/70 px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-cream/80 backdrop-blur">
          <CalendarDays className="h-3.5 w-3.5 text-gold-400" />
          {formatDate(event.startDate)}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-xl font-semibold leading-snug text-cream transition group-hover:text-gold-200">
          <Link href={`/events/${event.slug}`}>{event.title}</Link>
        </h3>
        <div className="mt-4 space-y-2 text-sm text-cream/55">
          <p className="flex items-start gap-2">
            <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-gold-400/80" />
            {formatDateTime(event.startDate)}
          </p>
          <p className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-400/80" />
            {event.venue}
          </p>
          <p className="flex items-start gap-2">
            <Users className="mt-0.5 h-4 w-4 shrink-0 text-gold-400/80" />
            Capacity {event.capacity || "Open"} participants
          </p>
        </div>
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-white/[0.06] pt-4">
          <Badge variant={status.variant}>{status.label}</Badge>
          <Link
            href={`/events/${event.slug}`}
            className="inline-flex items-center gap-1 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-gold-300 transition hover:text-gold-200"
          >
            Details <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
