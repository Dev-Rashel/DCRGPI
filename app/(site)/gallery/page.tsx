import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { GalleryExplorer } from "@/components/site/gallery-explorer";
import { getGallery } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Photos from DCRGPI competitions, workshops, training sessions and campus events.",
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
        description="রাত জেগে প্রস্তুতি, প্রথম বক্তব্য, ট্রফি হাতে তোলা আর তার মাঝের কমিউনিটি — ইভেন্ট, ওয়ার্কশপ ও প্রতিযোগিতার অ্যালবাম ঘুরে দেখুন।"
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
