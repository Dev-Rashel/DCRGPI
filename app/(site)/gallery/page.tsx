import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { GalleryExplorer } from "@/components/site/gallery-explorer";
import { getGallery } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Photos from Debating Club of RPI competitions, workshops, training sessions and campus events.",
  alternates: { canonical: "/gallery" },
};

export default async function GalleryPage() {
  const items = await getGallery();

  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title={
          <>
            Moments worth <span className="gold-text italic">remembering</span>
          </>
        }
        description="Late-night prep, first speeches, trophy lifts and the community in between. Browse our albums from events, workshops and competitions."
        breadcrumb={[{ label: "Gallery" }]}
      />
      <section className="py-16 sm:py-20">
        <div className="container-narrow">
          <GalleryExplorer items={items} />
        </div>
      </section>
    </>
  );
}
