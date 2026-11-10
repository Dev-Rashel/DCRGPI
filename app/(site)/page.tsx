import type { Metadata } from "next";
import { getEvents, getGallery, getNotices, getPosts, getSettings, getTeam } from "@/lib/data";
import { SITE_FULL_NAME, SITE_NAME } from "@/lib/constants";
import { Hero } from "@/components/site/hero";
import { NoticeBar } from "@/components/site/notice-bar";
import { NoticesSection, SectionRenderer } from "@/components/site/home-sections";
import { TagMarquee } from "@/components/site/tag-marquee";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: `${SITE_NAME} — Think Bold. Speak Fearlessly.` },
  description: `The official home of ${SITE_FULL_NAME}. Events, competitions, leadership, gallery and membership.`,
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
      <TagMarquee />
      <NoticeBar notices={notices} />
      <SectionRenderer settings={settings} data={{ posts: posts.items, events: events.items, team, gallery }} />
      <NoticesSection notices={notices} />
    </>
  );
}
