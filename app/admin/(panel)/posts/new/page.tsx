import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/ui";
import { DemoNotice } from "@/components/admin/form";
import { PostForm } from "@/components/admin/post-form";
import { demoMode } from "@/lib/data";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "New post" };

export default function NewPostPage() {
  const demo = demoMode();
  return (
    <div>
      <AdminPageHeader
        title="Write a post"
        description="Draft a story, add a cover image and publish when you are ready."
      />
      <div className="mb-4">
        <DemoNotice show={demo} />
      </div>
      <PostForm demo={demo} />
    </div>
  );
}
