import type { Metadata } from "next";
import { getEvents, getGallery, getNotices, getPosts, getSettings, getTeam } from "@/lib/data";
import { Hero } from "@/components/site/hero";
import { NoticeBar } from "@/components/site/notice-bar";
import { NoticesSection, SectionRenderer } from "@/components/site/home-sections";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Debating Club of RPI — Think Bold. Speak Fearlessly.",
  description:
    "The official home of the Debating Club of Rangpur Government Polytechnic Institute. Events, competitions, leadership, gallery and membership.",
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [settings, posts, events, team, gallery, notices] = await Promise.all([
    getSettings(),
    getPosts({ limit: 6, sort: "newest" }),
    getEvents({ phase: "upcoming", limit: 3 }),
    getTeam({ limit: 4 }),
    getGallery({ limit: 6 }),
    getNotices({ limit: 4 }),
  ]);

  return (
    <>
      <Hero settings={settings} />
      <NoticeBar notices={notices} />
      <SectionRenderer settings={settings} data={{ posts: posts.items, events: events.items, team, gallery }} />
      <NoticesSection notices={notices} />
    </>
  );
}
