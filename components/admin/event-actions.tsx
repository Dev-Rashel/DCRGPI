"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ListChecks, Loader2, Pencil, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/dialog";
import { apiRequest, fromApiError } from "@/lib/admin-utils";

export function EventActions({
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
      const { ok, payload } = await apiRequest(`/api/events/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: status === "published" ? "draft" : "published" }),
      });
      if (!ok) {
        toast.error(fromApiError(payload));
        return;
      }
      toast.success(status === "published" ? "Event moved to drafts" : "Event published");
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
      const { ok, payload } = await apiRequest(`/api/events/${id}`, { method: "DELETE" });
      if (!ok) {
        toast.error(fromApiError(payload));
        return;
      }
      toast.success("Event deleted");
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
        href={`/admin/events/${id}`}
        className="rounded-md p-2 text-cream/45 transition hover:bg-white/[0.06] hover:text-gold-200"
        aria-label="Edit event"
        title="Edit event"
      >
        <Pencil className="h-3.5 w-3.5" />
      </Link>
      <Link
        href={`/admin/events/${id}/registrations`}
        className="rounded-md p-2 text-cream/45 transition hover:bg-white/[0.06] hover:text-sky-300"
        aria-label="View registrations"
        title="View registrations"
      >
        <ListChecks className="h-3.5 w-3.5" />
      </Link>
      <button
        type="button"
        onClick={toggleStatus}
        disabled={pending || demo}
        className="rounded-md p-2 text-cream/45 transition hover:bg-white/[0.06] hover:text-emerald-300 disabled:opacity-50"
        aria-label={status === "published" ? "Unpublish event" : "Publish event"}
        title={status === "published" ? "Move to drafts" : "Publish event"}
      >
        {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
      </button>
      <button
        type="button"
        onClick={() => setConfirming(true)}
        disabled={pending || demo}
        className="rounded-md p-2 text-cream/45 transition hover:bg-red-400/10 hover:text-red-300 disabled:opacity-50"
        aria-label="Delete event"
        title="Delete event"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>

      <ConfirmDialog
        open={confirming}
        onOpenChange={setConfirming}
        title="Delete this event?"
        description={`"${slug}" and its event page will be permanently removed. Existing registrations are kept for your records.`}
        loading={pending}
        onConfirm={remove}
      />
    </div>
  );
}
