"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Check, Download, Mail, MailOpen, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, ConfirmDialog } from "@/components/ui/dialog";
import { AdminEmptyState, TableShell } from "@/components/admin/ui";
import { apiRequest, downloadCsv, fromApiError } from "@/lib/admin-utils";
import { formatDateTime } from "@/lib/utils";
import type { ContactMessageDTO } from "@/lib/types";

export function MessagesManager({ initialItems, demo }: { initialItems: ContactMessageDTO[]; demo: boolean }) {
  const router = useRouter();
  const [items, setItems] = React.useState(initialItems);
  const [selected, setSelected] = React.useState<ContactMessageDTO | null>(null);
  const [deleting, setDeleting] = React.useState<ContactMessageDTO | null>(null);
  const [working, setWorking] = React.useState(false);

  React.useEffect(() => setItems(initialItems), [initialItems]);

  const setStatus = async (message: ContactMessageDTO, status: "read" | "unread") => {
    setWorking(true);
    try {
      const { ok, payload } = await apiRequest(`/api/admin/messages/${message.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      if (!ok) {
        toast.error(fromApiError(payload));
        return;
      }
      setItems((current) => current.map((item) => (item.id === message.id ? { ...item, status } : item)));
      setSelected((current) => (current && current.id === message.id ? { ...current, status } : current));
      toast.success(status === "read" ? "Marked as read" : "Marked as unread");
      router.refresh();
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setWorking(false);
    }
  };

  const remove = async () => {
    if (!deleting) return;
    setWorking(true);
    try {
      const { ok, payload } = await apiRequest(`/api/admin/messages/${deleting.id}`, { method: "DELETE" });
      if (!ok) {
        toast.error(fromApiError(payload));
        return;
      }
      setItems((current) => current.filter((item) => item.id !== deleting.id));
      toast.success("Message deleted");
      setDeleting(null);
      setSelected(null);
      router.refresh();
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setWorking(false);
    }
  };

  const exportCsv = () => {
    downloadCsv(
      `dcrgpi-messages-${new Date().toISOString().slice(0, 10)}.csv`,
      ["Name", "Email", "Subject", "Message", "Status", "Submitted"],
      items.map((item) => [item.name, item.email, item.subject, item.message, item.status, item.submittedAt])
    );
  };

  if (!items.length) {
    return (
      <AdminEmptyState
        icon={Mail}
        title="No messages"
        description="Messages sent through the public contact form will appear here."
      />
    );
  }

  return (
    <>
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-xs text-cream/40">
          {items.filter((item) => item.status === "unread").length} unread · {items.length} in this view
        </p>
        <button
          type="button"
          onClick={exportCsv}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-white/10 px-3 text-[0.65rem] font-semibold uppercase tracking-[0.08em] text-cream/60 transition hover:border-gold-400/40 hover:text-gold-200"
        >
          <Download className="h-3.5 w-3.5" /> Export CSV
        </button>
      </div>

      <TableShell>
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/[0.07] text-[0.58rem] uppercase tracking-[0.14em] text-cream/30">
              <th className="px-4 py-3 font-semibold">From</th>
              <th className="px-4 py-3 font-semibold">Subject</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Received</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((message) => (
              <tr
                key={message.id}
                className={`border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] ${
                  message.status === "unread" ? "bg-gold-400/[0.025]" : ""
                }`}
              >
                <td className="px-4 py-3.5">
                  <p className="font-medium text-cream/85">{message.name}</p>
                  <a href={`mailto:${message.email}`} className="mt-0.5 block text-[0.65rem] text-cream/35 hover:text-gold-200">
                    {message.email}
                  </a>
                </td>
                <td className="max-w-[340px] px-4 py-3.5">
                  <button type="button" onClick={() => setSelected(message)} className="block w-full text-left">
                    <span className={`block truncate ${message.status === "unread" ? "font-semibold text-cream/90" : "text-cream/70"}`}>
                      {message.subject}
                    </span>
                    <span className="mt-0.5 block truncate text-[0.65rem] text-cream/30">{message.message}</span>
                  </button>
                </td>
                <td className="px-4 py-3.5">
                  <Badge variant={message.status === "unread" ? "warning" : "muted"}>{message.status}</Badge>
                </td>
                <td className="px-4 py-3.5 text-[0.68rem] text-cream/40">{formatDateTime(message.submittedAt)}</td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => setStatus(message, message.status === "unread" ? "read" : "unread")}
                      disabled={demo || working}
                      className="rounded-md p-2 text-cream/45 transition hover:bg-white/[0.06] hover:text-gold-200 disabled:opacity-25"
                      aria-label={message.status === "unread" ? "Mark as read" : "Mark as unread"}
                      title={message.status === "unread" ? "Mark as read" : "Mark as unread"}
                    >
                      {message.status === "unread" ? <Check className="h-3.5 w-3.5" /> : <MailOpen className="h-3.5 w-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelected(message)}
                      className="rounded-md px-2 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.06em] text-cream/45 transition hover:bg-white/[0.06] hover:text-gold-200"
                    >
                      Open
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleting(message)}
                      disabled={demo}
                      className="rounded-md p-2 text-cream/45 transition hover:bg-red-400/10 hover:text-red-300 disabled:opacity-25"
                      aria-label="Delete message"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableShell>

      <Dialog
        open={Boolean(selected)}
        onOpenChange={(open) => !open && setSelected(null)}
        title={selected?.subject ?? "Message"}
        description={selected ? `${selected.name} · ${selected.email}` : undefined}
        className="sm:max-w-xl"
      >
        {selected && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={selected.status === "unread" ? "warning" : "muted"}>{selected.status}</Badge>
              <span className="text-[0.65rem] text-cream/30">{formatDateTime(selected.submittedAt)}</span>
            </div>

            <p className="whitespace-pre-line text-sm leading-relaxed text-cream/70">{selected.message}</p>

            {!demo && (
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.08] pt-4">
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStatus(selected, selected.status === "unread" ? "read" : "unread")}
                    disabled={working}
                    className="h-9 px-4 text-xs"
                  >
                    {selected.status === "unread" ? "Mark as read" : "Mark as unread"}
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => setDeleting(selected)}
                    disabled={working}
                    className="h-9 px-4 text-xs"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </Button>
                </div>
                <a
                  href={`mailto:${selected.email}?subject=${encodeURIComponent(`Re: ${selected.subject}`)}`}
                  className="inline-flex h-9 items-center gap-2 rounded-full bg-gold-400 px-4 text-xs font-semibold text-ink-950 transition hover:bg-gold-300"
                >
                  <Mail className="h-3.5 w-3.5" /> Reply by email
                </a>
              </div>
            )}
          </div>
        )}
      </Dialog>

      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Delete this message?"
        description={deleting ? `The message from ${deleting.name} will be permanently deleted.` : ""}
        loading={working}
        onConfirm={remove}
      />
    </>
  );
}
