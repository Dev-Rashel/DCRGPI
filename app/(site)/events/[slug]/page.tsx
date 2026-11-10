import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Clock, MapPin, Ticket, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EventRegister } from "@/components/site/event-register";
import { ShareLinks } from "@/components/site/share-links";
import { getEventBySlug, getSettings } from "@/lib/data";
import { sanitizeRichText } from "@/lib/sanitize";
import { absoluteUrl, formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

const statusMap = {
  open: { label: "Registration open", variant: "success" as const },
  closed: { label: "Registration closed", variant: "muted" as const },
  "coming-soon": { label: "Coming soon", variant: "warning" as const },
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return { title: "Event not found" };

  return {
    title: event.title,
    description: event.description.replace(/<[^>]*>/g, " ").slice(0, 160),
    alternates: { canonical: `/events/${event.slug}` },
    openGraph: {
      type: "article",
      title: event.title,
      description: event.description.replace(/<[^>]*>/g, " ").slice(0, 160),
      url: absoluteUrl(`/events/${event.slug}`),
      images: event.image ? [{ url: event.image, width: 1200, height: 630 }] : undefined,
    },
  };
}

export default async function EventDetailPage({ params }: Params) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) notFound();
  const settings = await getSettings();

  const status = statusMap[event.registrationStatus];
  const deadline = event.registrationDeadline ? new Date(event.registrationDeadline) : null;
  const deadlinePassed = deadline ? deadline.getTime() < Date.now() : false;
  const isPast = new Date(event.endDate).getTime() < Date.now();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    startDate: event.startDate,
    endDate: event.endDate,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: { "@type": "Place", name: event.venue, address: settings.contactInfo.address },
    image: event.image || undefined,
    description: event.description.replace(/<[^>]*>/g, " "),
    organizer: { "@type": "Organization", name: "DCRGPI", url: absoluteUrl("/") },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="relative overflow-hidden pb-14 pt-28 sm:pt-32">
        <div className="absolute inset-0">
          {event.image ? (
            <Image src={event.image} alt="" fill priority sizes="100vw" className="object-cover opacity-30" />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-ink-700 to-ink-950" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/90 to-ink-950/60" />
        </div>
        <div className="container-narrow relative">
          <Link
            href="/events"
            className="mb-8 inline-flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-cream/50 transition hover:text-gold-300"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> All events
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <Badge>{event.category}</Badge>
            <Badge variant={status.variant}>{status.label}</Badge>
            {isPast && <Badge variant="muted">Past event</Badge>}
          </div>
          <h1 className="mt-5 max-w-4xl text-display-lg font-semibold text-cream">{event.title}</h1>
          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-cream/55">
            <span className="inline-flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-gold-400" /> {formatDateTime(event.startDate)}
            </span>
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gold-400" /> {event.venue}
            </span>
            <span className="inline-flex items-center gap-2">
              <Users className="h-4 w-4 text-gold-400" /> {event.capacity || "Open"} seats
            </span>
          </div>
        </div>
      </div>

      <section className="pb-20">
        <div className="container-narrow grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div>
            <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-2xl border border-white/10">
              {event.image ? (
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 70vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-ink-800 font-display text-3xl text-gold-400/30">
                  DCRGPI
                </div>
              )}
            </div>

            <h2 className="font-display text-2xl font-semibold text-cream sm:text-3xl">About this event</h2>
            <div
              className="prose-editorial mt-5"
              dangerouslySetInnerHTML={{ __html: sanitizeRichText(event.description) }}
            />

            {event.rules && (
              <div className="mt-10 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
                <h2 className="font-display text-xl font-semibold text-cream">Rules & requirements</h2>
                <ul className="mt-4 space-y-2.5">
                  {event.rules
                    .split(/\n|(?<=\.)\s+/)
                    .map((rule) => rule.trim())
                    .filter(Boolean)
                    .map((rule) => (
                      <li key={rule} className="flex items-start gap-3 text-sm leading-relaxed text-cream/60">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-400/70" />
                        {rule}
                      </li>
                    ))}
                </ul>
              </div>
            )}

            <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/[0.07] bg-white/[0.02] p-5">
              <ShareLinks title={event.title} path={`/events/${event.slug}`} />
              <Link href="/events" className="text-xs font-semibold uppercase tracking-[0.14em] text-cream/50 hover:text-gold-300">
                Back to events
              </Link>
            </div>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
            <div className="surface p-6">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-gold-300">Event details</p>
              <dl className="mt-5 space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                  <div>
                    <dt className="text-[0.62rem] uppercase tracking-[0.14em] text-cream/35">Starts</dt>
                    <dd className="mt-0.5 text-cream/80">{formatDateTime(event.startDate)}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                  <div>
                    <dt className="text-[0.62rem] uppercase tracking-[0.14em] text-cream/35">Ends</dt>
                    <dd className="mt-0.5 text-cream/80">{formatDateTime(event.endDate)}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                  <div>
                    <dt className="text-[0.62rem] uppercase tracking-[0.14em] text-cream/35">Venue</dt>
                    <dd className="mt-0.5 text-cream/80">{event.venue}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Ticket className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                  <div>
                    <dt className="text-[0.62rem] uppercase tracking-[0.14em] text-cream/35">Registration deadline</dt>
                    <dd className="mt-0.5 text-cream/80">
                      {deadline ? formatDateTime(deadline) : "On event day"}
                      {deadlinePassed && <span className="ml-1 text-red-300">(passed)</span>}
                    </dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                  <div>
                    <dt className="text-[0.62rem] uppercase tracking-[0.14em] text-cream/35">Capacity</dt>
                    <dd className="mt-0.5 text-cream/80">{event.capacity || "No fixed limit"} participants</dd>
                  </div>
                </div>
              </dl>
              <div className="mt-6">
                {deadlinePassed || isPast ? (
                  <p className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-center text-xs text-cream/50">
                    Registration for this event has closed.
                  </p>
                ) : (
                  <EventRegister event={event} />
                )}
              </div>
              <p className="mt-3 text-center text-[0.65rem] text-cream/35">
                By registering you agree to follow the club&apos;s code of conduct.
              </p>
            </div>

            <div className="surface p-6">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-gold-300">Questions?</p>
              <p className="mt-3 text-sm text-cream/55">
                Contact the organizing committee at{" "}
                <a href={`mailto:${settings.contactInfo.email}`} className="text-gold-300 hover:underline">
                  {settings.contactInfo.email}
                </a>
                .
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
