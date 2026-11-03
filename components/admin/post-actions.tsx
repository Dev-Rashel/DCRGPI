"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, Loader2, Pencil, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/dialog";
import { apiRequest, fromApiError } from "@/lib/admin-utils";
import { cn } from "@/lib/utils";

export function PostActions({
  id,
  slug,
  status,
  demo = false,
}: {
  id: string;
  slug: string;
  status: "draft" | "published";
  demo?: boolean;
}) {
  const router = useRouter();
  const [confirming, setConfirming] = React.useState(false);
  const [pending, setPending] = React.useState(false);

  const toggleStatus = async () => {
    if (demo) return;
    setPending(true);
    try {
      const { ok, payload } = await apiRequest(`/api/posts/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: status === "published" ? "draft" : "published" }),
      });
      if (!ok) {
        toast.error(fromApiError(payload));
        return;
      }
      toast.success(status === "published" ? "Post moved to drafts" : "Post published");
      router.refresh();
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setPending(false);
    }
  };

  const remove = async () => {
    if (demo) return;
    setPending(true);
    try {
      const { ok, payload } = await apiRequest(`/api/posts/${id}`, { method: "DELETE" });
      if (!ok) {
        toast.error(fromApiError(payload));
        return;
      }
      toast.success("Post deleted");
      setConfirming(false);
      router.refresh();
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-1">
      <Link
        href={`/admin/posts/${id}`}
        className="rounded-md p-2 text-cream/45 transition hover:bg-white/[0.06] hover:text-gold-200"
        aria-label="Edit post"
        title="Edit post"
      >
        <Pencil className="h-3.5 w-3.5" />
      </Link>
      <Link
        href={`/admin/posts/${id}/preview`}
        className="rounded-md p-2 text-cream/45 transition hover:bg-white/[0.06] hover:text-cream"
        aria-label="Preview post"
        title="Preview post"
      >
        <Eye className="h-3.5 w-3.5" />
      </Link>
      <button
        type="button"
        onClick={toggleStatus}
        disabled={pending || demo}
        className={cn(
          "rounded-md p-2 transition hover:bg-white/[0.06] disabled:opacity-50",
          status === "published" ? "text-cream/45 hover:text-amber-300" : "text-cream/45 hover:text-emerald-300"
        )}
        aria-label={status === "published" ? "Unpublish post" : "Publish post"}
        title={status === "published" ? "Move to drafts" : "Publish post"}
      >
        {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
      </button>
      <button
        type="button"
        onClick={() => setConfirming(true)}
        disabled={pending || demo}
        className="rounded-md p-2 text-cream/45 transition hover:bg-red-400/10 hover:text-red-300 disabled:opacity-50"
        aria-label="Delete post"
        title="Delete post"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>

      <ConfirmDialog
        open={confirming}
        onOpenChange={setConfirming}
        title="Delete this post?"
        description={`"${slug}" will be permanently removed from the website and the database.`}
        loading={pending}
        onConfirm={remove}
      />
    </div>
  );
}
