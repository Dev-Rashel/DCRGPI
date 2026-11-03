import type { Metadata } from "next";
import { GalleryManager } from "@/components/admin/gallery-manager";
import { AdminPageHeader } from "@/components/admin/ui";
import { DemoNotice } from "@/components/admin/form";
import { demoMode, getEvents, getGallery } from "@/lib/data";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Gallery" };

export default async function AdminGalleryPage() {
  const [items, events] = await Promise.all([
    getGallery(),
    getEvents({ includeDrafts: true, limit: 100 }),
  ]);

  return (
    <div>
      <AdminPageHeader
        title="Photo gallery"
        description="Curate the club's visual story. Upload photos, organise albums and control the order they appear in."
      />
      <div className="mb-4">
        <DemoNotice show={demoMode()} />
      </div>
      <GalleryManager
        initialItems={items}
        events={events.items.map((event) => ({ id: event.id, title: event.title }))}
        demo={demoMode()}
      />
    </div>
  );
}
