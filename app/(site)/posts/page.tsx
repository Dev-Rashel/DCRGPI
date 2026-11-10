import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { PostsExplorer } from "@/components/site/posts-explorer";
import { getPosts } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Posts & News",
  description:
    "Club news, announcements, debate articles, achievements, workshops and competition updates from DCRGPI.",
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
        description="ডিবেটিং ক্লাব অব আরপিআইয়ের ভেতরে যা কিছু ঘটছে — টুর্নামেন্টের ফলাফল থেকে উন্মুক্ত ওয়ার্কশপ ও ক্লাবের নোটিশ পর্যন্ত।"
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
