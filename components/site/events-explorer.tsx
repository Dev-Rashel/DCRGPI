"use client";

import * as React from "react";
import { CalendarDays, MapPin, Search, SlidersHorizontal, Ticket, X } from "lucide-react";
import { EventCard } from "@/components/site/event-card";
import { EVENT_CATEGORIES } from "@/lib/constants";
import { eventPhase } from "@/lib/data";
import type { EventDTO } from "@/lib/types";

const TABS = [
  { key: "upcoming", label: "Upcoming" },
  { key: "ongoing", label: "Ongoing" },
  { key: "past", label: "Past" },
] as const;

export function EventsExplorer({ events }: { events: EventDTO[] }) {
  const [tab, setTab] = React.useState<(typeof TABS)[number]["key"]>("upcoming");
  const [category, setCategory] = React.useState("All");
  const [query, setQuery] = React.useState("");
  const [filtersOpen, setFiltersOpen] = React.useState(false);

  React.useEffect(() => {
    if (events.length) {
      const hasUpcoming = events.some((event) => eventPhase(event) === "upcoming");
      if (!hasUpcoming) setTab("past");
    }
  }, [events]);

  const counts = React.useMemo(
    () => ({
      upcoming: events.filter((event) => eventPhase(event) === "upcoming").length,
      ongoing: events.filter((event) => eventPhase(event) === "ongoing").length,
      past: events.filter((event) => eventPhase(event) === "past").length,
    }),
    [events]
  );

  const filtered = React.useMemo(() => {
    let items = events.filter((event) => eventPhase(event) === tab);
    if (category !== "All") items = items.filter((event) => event.category === category);
    if (query.trim()) {
      const needle = query.trim().toLowerCase();
      items = items.filter(
        (event) =>
          event.title.toLowerCase().includes(needle) ||
          event.description.replace(/<[^>]*>/g, " ").toLowerCase().includes(needle) ||
          event.venue.toLowerCase().includes(needle)
      );
    }
    items.sort((a, b) => {
      const aTime = new Date(a.startDate).getTime();
      const bTime = new Date(b.startDate).getTime();
      return tab === "past" ? bTime - aTime : aTime - bTime;
    });
    return items;
  }, [events, tab, category, query]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 border-b border-white/[0.08]">
        {TABS.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setTab(item.key)}
            className={`relative px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] transition ${
              tab === item.key ? "text-gold-300" : "text-cream/45 hover:text-cream/80"
            }`}
            aria-pressed={tab === item.key}
          >
            {item.label}
            <span className="ml-2 text-[0.6rem] text-cream/30">{counts[item.key]}</span>
            {tab === item.key && <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-gold-400" />}
          </button>
        ))}
        <div className="ml-auto hidden items-center gap-2 py-2 sm:flex">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-cream/35" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search events"
              aria-label="Search events"
              className="input-base h-9 w-52 pl-9 text-xs"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-cream/40 hover:text-cream"
                aria-label="Clear search"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => setFiltersOpen((value) => !value)}
            className="inline-flex h-9 items-center gap-2 rounded-full border border-white/12 px-3.5 text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-cream/65 hover:border-gold-400/40"
            aria-expanded={filtersOpen}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" /> Categories
          </button>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 sm:hidden">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-cream/35" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search events"
            aria-label="Search events"
            className="input-base h-10 pl-9 text-xs"
          />
        </div>
        <button
          type="button"
          onClick={() => setFiltersOpen((value) => !value)}
          className="inline-flex h-10 items-center gap-2 rounded-full border border-white/12 px-3.5 text-[0.65rem] font-semibold uppercase text-cream/65"
          aria-expanded={filtersOpen}
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
        </button>
      </div>

      {filtersOpen && (
        <div className="mt-4 flex flex-wrap gap-2 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
          {["All", ...EVENT_CATEGORIES].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`rounded-full border px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.08em] transition ${
                category === item
                  ? "border-gold-400/60 bg-gold-400/15 text-gold-200"
                  : "border-white/10 text-cream/50 hover:border-white/25 hover:text-cream/85"
              }`}
              aria-pressed={category === item}
            >
              {item}
            </button>
          ))}
        </div>
      )}

      <div className="mt-8">
        {filtered.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-white/10 py-20 text-center">
            <Ticket className="mx-auto h-8 w-8 text-gold-400/50" />
            <p className="mt-4 font-display text-2xl text-cream/80">
              {tab === "past" ? "No past events to show" : "No events here yet"}
            </p>
            <p className="mt-2 text-sm text-cream/45">
              {category !== "All" || query
                ? "Try clearing your filters."
                : "Follow our social pages to hear about the next one first."}
            </p>
            {(category !== "All" || query) && (
              <button
                type="button"
                onClick={() => {
                  setCategory("All");
                  setQuery("");
                }}
                className="mt-6 rounded-full border border-white/15 px-5 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-cream transition hover:border-gold-400/50"
              >
                Reset filters
              </button>
            )}
          </div>
        )}
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-5 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 text-xs text-cream/45">
        <span className="inline-flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-gold-400" /> Times shown in local time
        </span>
        <span className="inline-flex items-center gap-2">
          <MapPin className="h-4 w-4 text-gold-400" /> On-campus venues unless stated
        </span>
      </div>
    </div>
  );
}
