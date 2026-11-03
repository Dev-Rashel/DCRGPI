import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { PostsExplorer } from "@/components/site/posts-explorer";
import { getPosts } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Posts & News",
  description:
    "Club news, announcements, debate articles, achievements, workshops and competition updates from the Debating Club of RPI.",
  alternates: { canonical: "/posts" },
};

export default async function PostsPage() {
  const { items } = await getPosts({ limit: 200, sort: "newest" });

  return (
    <>
      <PageHero
        eyebrow="The newsroom"
        title={
          <>
            Ideas, updates & <span className="gold-text italic">announcements</span>
          </>
        }
        description="Everything happening inside the Debating Club of RPI — from tournament results to open workshops and club notices."
        breadcrumb={[{ label: "Posts" }]}
      />
      <section className="py-16 sm:py-20">
        <div className="container-narrow">
          <PostsExplorer posts={items} />
        </div>
      </section>
    </>
  );
}
