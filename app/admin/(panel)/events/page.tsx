import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, MapPin, Plus, Search } from "lucide-react";
import { AdminButton, AdminEmptyState, AdminPageHeader, StatusBadge, TableShell } from "@/components/admin/ui";
import { EventActions } from "@/components/admin/event-actions";
import { DemoNotice } from "@/components/admin/form";
import { Badge } from "@/components/ui/badge";
import { Input, Select } from "@/components/ui/input";
import { demoMode, eventPhase, getEvents } from "@/lib/data";
import { EVENT_CATEGORIES } from "@/lib/constants";
import { formatDateTime } from "@/lib/utils";
import type { EventPhase } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Events" };

type SearchParams = Promise<{ q?: string; status?: string; category?: string; phase?: string; page?: string }>;

const PAGE_SIZE = 10;

export default async function AdminEventsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const demo = demoMode();
  const q = params.q?.trim() ?? "";
  const status = params.status === "published" || params.status === "draft" ? params.status : "all";
  const category = params.category && EVENT_CATEGORIES.includes(params.category as never) ? params.category : "";
  const phase =
    params.phase === "upcoming" || params.phase === "ongoing" || params.phase === "past"
      ? (params.phase as EventPhase)
      : "all";
  const page = Math.max(1, Number(params.page ?? 1) || 1);

  const result = await getEvents({
    includeDrafts: true,
    q: q || undefined,
    category: category || undefined,
    status: status === "all" ? undefined : status,
    phase,
    page,
    limit: PAGE_SIZE,
  });

  const hrefFor = (next: { status?: string; phase?: string; page?: number }) => {
    const search = new URLSearchParams();
    if (q) search.set("q", q);
    if (category) search.set("category", category);
    const nextStatus = next.status ?? status;
    if (nextStatus !== "all") search.set("status", nextStatus);
    const nextPhase = next.phase ?? phase;
    if (nextPhase !== "all") search.set("phase", nextPhase);
    if (next.page && next.page > 1) search.set("page", String(next.page));
    const query = search.toString();
    return query ? `/admin/events?${query}` : "/admin/events";
  };

  return (
    <div>
      <AdminPageHeader
        title="Events & competitions"
        description="Plan debates, workshops and ceremonies. Open registrations and manage participant lists."
        actions={
          <AdminButton href="/admin/events/new">
            <Plus className="h-3.5 w-3.5" /> New event
          </AdminButton>
        }
      />

      <div className="mb-4 space-y-3">
        <DemoNotice show={demo} />

        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { key: "all", label: "All events" },
            { key: "upcoming", label: "Upcoming" },
            { key: "ongoing", label: "Ongoing" },
            { key: "past", label: "Past" },
          ].map((tab) => (
            <Link
              key={tab.key}
              href={hrefFor({ phase: tab.key, page: 1 })}
              className={`rounded-full border px-3.5 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.08em] transition ${
                phase === tab.key
                  ? "border-gold-400/40 bg-gold-400/10 text-gold-200"
                  : "border-white/10 text-cream/45 hover:border-white/25 hover:text-cream/80"
              }`}
            >
              {tab.label}
            </Link>
          ))}
          <span className="mx-1 hidden h-5 w-px bg-white/10 sm:block" />
          {[
            { key: "all", label: "Any status" },
            { key: "published", label: "Published" },
            { key: "draft", label: "Drafts" },
          ].map((tab) => (
            <Link
              key={tab.key}
              href={hrefFor({ status: tab.key, page: 1 })}
              className={`rounded-full border px-3.5 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.08em] transition ${
                status === tab.key
                  ? "border-sky-400/40 bg-sky-400/10 text-sky-200"
                  : "border-white/10 text-cream/45 hover:border-white/25 hover:text-cream/80"
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        <form action="/admin/events" method="get" className="flex flex-wrap items-center gap-2">
          {status !== "all" && <input type="hidden" name="status" value={status} />}
          {phase !== "all" && <input type="hidden" name="phase" value={phase} />}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-cream/30" />
            <Input name="q" defaultValue={q} placeholder="Search events…" className="h-9 w-52 pl-8 text-xs" aria-label="Search events" />
          </div>
          <Select name="category" defaultValue={category} className="h-9 w-44 text-xs" aria-label="Filter by category">
            <option value="">All categories</option>
            {EVENT_CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
          <button
            type="submit"
            className="h-9 rounded-lg border border-white/10 px-3 text-[0.65rem] font-semibold uppercase tracking-[0.08em] text-cream/60 transition hover:border-gold-400/40 hover:text-gold-200"
          >
            Filter
          </button>
        </form>
      </div>

      {result.items.length === 0 ? (
        <AdminEmptyState
          icon={CalendarDays}
          title={q || category || status !== "all" || phase !== "all" ? "No matching events" : "No events yet"}
          description={
            q || category || status !== "all" || phase !== "all"
              ? "Try a different search or remove a filter."
              : "Create your first event and open registrations."
          }
          action={<AdminButton href="/admin/events/new">Create an event</AdminButton>}
        />
      ) : (
        <TableShell>
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/[0.07] text-[0.58rem] uppercase tracking-[0.14em] text-cream/30">
                <th className="px-4 py-3 font-semibold">Event</th>
                <th className="px-4 py-3 font-semibold">Date & venue</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Registration</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {result.items.map((event) => {
                const currentPhase = eventPhase(event);
                return (
                  <tr key={event.id} className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02]">
                    <td className="max-w-[330px] px-4 py-3.5">
                      <Link href={`/admin/events/${event.id}`} className="group flex items-center gap-3">
                        <span className="relative h-10 w-14 shrink-0 overflow-hidden rounded-md border border-white/10 bg-ink-800">
                          {event.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={event.image} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <span className="flex h-full w-full items-center justify-center text-cream/20">
                              <CalendarDays className="h-4 w-4" />
                            </span>
                          )}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate font-medium text-cream/85 group-hover:text-gold-200">{event.title}</span>
                          <span className="mt-0.5 block truncate text-[0.65rem] text-cream/30">{event.category}</span>
                        </span>
                      </Link>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-cream/45">
                      <span className="block">{formatDateTime(event.startDate)}</span>
                      <span className="mt-1 flex items-center gap-1 text-[0.65rem] text-cream/30">
                        <MapPin className="h-3 w-3" /> {event.venue}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <Badge variant={event.status === "published" ? "success" : "muted"}>{event.status}</Badge>
                        <Badge variant={currentPhase === "past" ? "muted" : currentPhase === "ongoing" ? "warning" : "outline"}>
                          {currentPhase}
                        </Badge>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={event.registrationStatus} />
                    </td>
                    <td className="px-4 py-3.5">
                      <EventActions id={event.id} slug={event.slug} status={event.status} demo={demo} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </TableShell>
      )}

      {result.pages > 1 && (
        <div className="mt-4 flex items-center justify-between gap-4 text-xs text-cream/40">
          <p>
            Page {result.page} of {result.pages} · {result.total} events
          </p>
          <div className="flex items-center gap-2">
            <Link
              href={hrefFor({ page: result.page - 1 })}
              aria-disabled={result.page <= 1}
              className={`rounded-full border border-white/10 px-3.5 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.08em] transition hover:border-gold-400/40 hover:text-gold-200 ${
                result.page <= 1 ? "pointer-events-none opacity-40" : ""
              }`}
            >
              Previous
            </Link>
            <Link
              href={hrefFor({ page: result.page + 1 })}
              aria-disabled={result.page >= result.pages}
              className={`rounded-full border border-white/10 px-3.5 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.08em] transition hover:border-gold-400/40 hover:text-gold-200 ${
                result.page >= result.pages ? "pointer-events-none opacity-40" : ""
              }`}
            >
              Next
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
