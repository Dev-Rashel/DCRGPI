"use client";

import * as React from "react";
import { CheckCircle2, Download, Search, Trash2, UserCheck, UserX } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ConfirmDialog } from "@/components/ui/dialog";
import { AdminEmptyState, TableShell } from "@/components/admin/ui";
import { apiRequest, downloadCsv, fromApiError } from "@/lib/admin-utils";
import { formatDateTime } from "@/lib/utils";
import type { EventRegistrationDTO } from "@/lib/types";

export function RegistrationsManager({
  eventTitle,
  initialItems,
  demo = false,
}: {
  eventTitle: string;
  initialItems: EventRegistrationDTO[];
  demo?: boolean;
}) {
  const [items, setItems] = React.useState(initialItems);
  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState<"all" | "confirmed" | "cancelled">("all");
  const [pendingId, setPendingId] = React.useState<string | null>(null);
  const [deleting, setDeleting] = React.useState<EventRegistrationDTO | null>(null);
  const [working, setWorking] = React.useState(false);

  const filtered = React.useMemo(() => {
    const needle = query.trim().toLowerCase();
    return items.filter((item) => {
      if (status !== "all" && item.status !== status) return false;
      if (!needle) return true;
      return [item.name, item.email, item.phone, item.studentId, item.department, item.referenceNo]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
  }, [items, query, status]);

  const setRegistrationStatus = async (item: EventRegistrationDTO, next: "confirmed" | "cancelled") => {
    if (demo) return;
    setPendingId(item.id);
    try {
      const { ok, payload } = await apiRequest(`/api/admin/event-registrations/${item.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: next }),
      });
      if (!ok) {
        toast.error(fromApiError(payload));
        return;
      }
      setItems((current) => current.map((entry) => (entry.id === item.id ? { ...entry, status: next } : entry)));
      toast.success(next === "confirmed" ? "Registration confirmed" : "Registration cancelled");
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setPendingId(null);
    }
  };

  const remove = async () => {
    if (!deleting || demo) return;
    setWorking(true);
    try {
      const { ok, payload } = await apiRequest(`/api/admin/event-registrations/${deleting.id}`, { method: "DELETE" });
      if (!ok) {
        toast.error(fromApiError(payload));
        return;
      }
      setItems((current) => current.filter((entry) => entry.id !== deleting.id));
      toast.success("Registration removed");
      setDeleting(null);
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setWorking(false);
    }
  };

  const exportCsv = () => {
    downloadCsv(
      `dcrpi-registrations-${eventTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.csv`,
      ["Reference", "Name", "Student ID", "Department", "Email", "Phone", "Status", "Registered"],
      filtered.map((item) => [
        item.referenceNo,
        item.name,
        item.studentId,
        item.department,
        item.email,
        item.phone,
        item.status,
        item.createdAt,
      ])
    );
  };

  const confirmed = items.filter((item) => item.status === "confirmed").length;

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] px-4 py-3">
          <p className="text-[0.55rem] font-semibold uppercase tracking-[0.16em] text-cream/30">Total registrations</p>
          <p className="mt-1 font-display text-xl font-semibold text-cream">{items.length}</p>
        </div>
        <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] px-4 py-3">
          <p className="text-[0.55rem] font-semibold uppercase tracking-[0.16em] text-cream/30">Confirmed</p>
          <p className="mt-1 font-display text-xl font-semibold text-emerald-300">{confirmed}</p>
        </div>
        <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] px-4 py-3">
          <p className="text-[0.55rem] font-semibold uppercase tracking-[0.16em] text-cream/30">Cancelled</p>
          <p className="mt-1 font-display text-xl font-semibold text-cream/55">{items.length - confirmed}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {(["all", "confirmed", "cancelled"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setStatus(tab)}
              className={`rounded-full border px-3.5 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.08em] transition ${
                status === tab
                  ? "border-gold-400/40 bg-gold-400/10 text-gold-200"
                  : "border-white/10 text-cream/45 hover:border-white/25 hover:text-cream/80"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-cream/30" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search participants…"
              className="h-9 w-52 pl-8 text-xs"
              aria-label="Search registrations"
            />
          </div>
          <button
            type="button"
            onClick={exportCsv}
            disabled={!filtered.length}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-white/10 px-3 text-[0.65rem] font-semibold uppercase tracking-[0.08em] text-cream/60 transition hover:border-gold-400/40 hover:text-gold-200 disabled:opacity-40"
          >
            <Download className="h-3.5 w-3.5" /> CSV
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <AdminEmptyState
          icon={UserCheck}
          title={items.length ? "No matching registrations" : "No registrations yet"}
          description={
            items.length
              ? "Try a different search term or status filter."
              : "Participants who register on the public event page will appear here."
          }
        />
      ) : (
        <TableShell>
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/[0.07] text-[0.58rem] uppercase tracking-[0.14em] text-cream/30">
                <th className="px-4 py-3 font-semibold">Participant</th>
                <th className="px-4 py-3 font-semibold">Contact</th>
                <th className="px-4 py-3 font-semibold">Reference</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Registered</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02]">
                  <td className="px-4 py-3.5">
                    <p className="font-medium text-cream/85">{item.name}</p>
                    <p className="mt-0.5 text-[0.65rem] text-cream/35">
                      {item.studentId} · {item.department || "Department not given"}
                    </p>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-cream/50">
                    <a href={`mailto:${item.email}`} className="block hover:text-gold-200">
                      {item.email}
                    </a>
                    <a href={`tel:${item.phone}`} className="mt-0.5 block text-[0.65rem] text-cream/35 hover:text-gold-200">
                      {item.phone}
                    </a>
                  </td>
                  <td className="px-4 py-3.5 font-mono text-[0.65rem] text-cream/40">{item.referenceNo}</td>
                  <td className="px-4 py-3.5">
                    <Badge variant={item.status === "confirmed" ? "success" : "danger"}>{item.status}</Badge>
                  </td>
                  <td className="px-4 py-3.5 text-[0.68rem] text-cream/40">{formatDateTime(item.createdAt)}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      {item.status === "confirmed" ? (
                        <button
                          type="button"
                          onClick={() => setRegistrationStatus(item, "cancelled")}
                          disabled={pendingId === item.id || demo}
                          className="rounded-md p-2 text-cream/45 transition hover:bg-white/[0.06] hover:text-amber-300 disabled:opacity-40"
                          title="Cancel registration"
                          aria-label="Cancel registration"
                        >
                          <UserX className="h-3.5 w-3.5" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setRegistrationStatus(item, "confirmed")}
                          disabled={pendingId === item.id || demo}
                          className="rounded-md p-2 text-cream/45 transition hover:bg-white/[0.06] hover:text-emerald-300 disabled:opacity-40"
                          title="Confirm registration"
                          aria-label="Confirm registration"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setDeleting(item)}
                        disabled={demo}
                        className="rounded-md p-2 text-cream/45 transition hover:bg-red-400/10 hover:text-red-300 disabled:opacity-40"
                        title="Delete registration"
                        aria-label="Delete registration"
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
      )}

      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Remove this registration?"
        description={deleting ? `${deleting.name}'s registration for this event will be permanently deleted.` : ""}
        loading={working}
        onConfirm={remove}
      />
    </div>
  );
}
