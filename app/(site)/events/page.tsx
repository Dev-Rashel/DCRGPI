import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { EventsExplorer } from "@/components/site/events-explorer";
import { getEvents } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Events & Competitions",
  description:
    "Upcoming debates, workshops, seminars and competitions organised by the Debating Club of RPI.",
  alternates: { canonical: "/events" },
};

export default async function EventsPage() {
  const { items } = await getEvents({ limit: 200 });

  return (
    <>
      <PageHero
        eyebrow="Take the floor"
        title={
          <>
            Events that <span className="gold-text italic">move the room</span>
          </>
        }
        description="Tournaments, training sessions and open debates. Find your next stage, register your team, or come and watch."
        breadcrumb={[{ label: "Events" }]}
      />
      <section className="py-16 sm:py-20">
        <div className="container-narrow">
          <EventsExplorer events={items} />
        </div>
      </section>
    </>
  );
}
