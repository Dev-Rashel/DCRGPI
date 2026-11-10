import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { EventsExplorer } from "@/components/site/events-explorer";
import { getEvents } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Events & Competitions",
  description:
    "Upcoming debates, workshops, seminars and competitions organised by DCRGPI.",
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
        description="টুর্নামেন্ট, প্রশিক্ষণ সেশন ও উন্মুক্ত বিতর্ক। আপনার পরের মঞ্চ খুঁজে নিন, দল নিবন্ধন করুন, অথবা এসে দর্শক হয়ে উপভোগ করুন।"
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
