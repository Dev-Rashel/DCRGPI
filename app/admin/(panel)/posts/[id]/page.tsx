import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/ui";
import { DemoNotice } from "@/components/admin/form";
import { PostForm } from "@/components/admin/post-form";
import { demoMode, getPostById } from "@/lib/data";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Edit post" };

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getPostById(id);
  if (!post) notFound();

  return (
    <div>
      <AdminPageHeader
        title="Edit post"
        description={`Editing “${post.title}”. Changes are reflected on the public site as soon as you save.`}
      />
      <div className="mb-4">
        <DemoNotice show={demoMode()} />
      </div>
      <PostForm post={post} demo={demoMode()} />
    </div>
  );
}
