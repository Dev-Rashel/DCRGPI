"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Check, Eye, Loader2, Mail, Phone, Trash2, UserPlus, X } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, ConfirmDialog } from "@/components/ui/dialog";
import { StatusBadge } from "@/components/admin/ui";
import { Field } from "@/components/admin/form";
import { apiRequest, fromApiError } from "@/lib/admin-utils";
import { formatDate, formatDateTime } from "@/lib/utils";
import type { MembershipDTO, MembershipStatus } from "@/lib/types";

export function MembershipManager({ initialItems, demo }: { initialItems: MembershipDTO[]; demo: boolean }) {
  const router = useRouter();
  const [items, setItems] = React.useState(initialItems);
  const [reviewing, setReviewing] = React.useState<MembershipDTO | null>(null);
  const [deleting, setDeleting] = React.useState<MembershipDTO | null>(null);
  const [working, setWorking] = React.useState(false);
  const [quickId, setQuickId] = React.useState<string | null>(null);

  React.useEffect(() => setItems(initialItems), [initialItems]);

  const quickReview = async (application: MembershipDTO, status: MembershipStatus) => {
    setQuickId(application.id);
    try {
      const { ok, payload } = await apiRequest(`/api/admin/membership/${application.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      if (!ok) {
        toast.error(fromApiError(payload));
        return;
      }
      setItems((current) => current.map((item) => (item.id === application.id ? { ...item, status } : item)));
      toast.success(status === "approved" ? "Application approved" : "Application rejected");
      router.refresh();
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setQuickId(null);
    }
  };

  const remove = async () => {
    if (!deleting) return;
    setWorking(true);
    try {
      const { ok, payload } = await apiRequest(`/api/admin/membership/${deleting.id}`, { method: "DELETE" });
      if (!ok) {
        toast.error(fromApiError(payload));
        return;
      }
      setItems((current) => current.filter((item) => item.id !== deleting.id));
      toast.success("Application deleted");
      setDeleting(null);
      router.refresh();
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setWorking(false);
    }
  };

  return (
    <>
      <table className="w-full min-w-[900px] text-left text-sm">
        <thead>
          <tr className="border-b border-white/[0.07] text-[0.58rem] uppercase tracking-[0.14em] text-cream/30">
            <th className="px-4 py-3 font-semibold">Applicant</th>
            <th className="px-4 py-3 font-semibold">Department</th>
            <th className="px-4 py-3 font-semibold">Contact</th>
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="px-4 py-3 font-semibold">Submitted</th>
            <th className="px-4 py-3 text-right font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((application) => (
            <tr key={application.id} className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02]">
              <td className="px-4 py-3.5">
                <div className="flex items-center gap-3">
                  <span className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-ink-800 text-[0.65rem] font-bold text-gold-300/70">
                    {application.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={application.photo} alt="" className="h-full w-full object-cover" />
                    ) : (
                      application.name.slice(0, 2).toUpperCase()
                    )}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-medium text-cream/85">{application.name}</span>
                    <span className="mt-0.5 block font-mono text-[0.62rem] text-cream/30">
                      {application.referenceNo} · {application.studentId}
                    </span>
                  </span>
                </div>
              </td>
              <td className="px-4 py-3.5 text-xs text-cream/50">
                {application.department}
                <span className="block text-[0.65rem] text-cream/30">{application.semester} semester</span>
              </td>
              <td className="px-4 py-3.5 text-xs text-cream/50">
                <a href={`mailto:${application.email}`} className="block truncate hover:text-gold-200">
                  {application.email}
                </a>
                <a href={`tel:${application.phone}`} className="mt-0.5 block text-[0.65rem] text-cream/30 hover:text-gold-200">
                  {application.phone}
                </a>
              </td>
              <td className="px-4 py-3.5">
                <StatusBadge status={application.status} />
              </td>
              <td className="px-4 py-3.5 text-[0.68rem] text-cream/40">{formatDate(application.submittedAt)}</td>
              <td className="px-4 py-3.5">
                <div className="flex items-center justify-end gap-1">
                  {application.status === "pending" && !demo && (
                    <>
                      <button
                        type="button"
                        onClick={() => quickReview(application, "approved")}
                        disabled={quickId === application.id}
                        className="rounded-md p-2 text-cream/45 transition hover:bg-emerald-400/10 hover:text-emerald-300 disabled:opacity-40"
                        aria-label="Approve application"
                        title="Approve"
                      >
                        {quickId === application.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => quickReview(application, "rejected")}
                        disabled={quickId === application.id}
                        className="rounded-md p-2 text-cream/45 transition hover:bg-red-400/10 hover:text-red-300 disabled:opacity-40"
                        aria-label="Reject application"
                        title="Reject"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => setReviewing(application)}
                    className="inline-flex items-center gap-1.5 rounded-md px-2 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.06em] text-cream/45 transition hover:bg-white/[0.06] hover:text-gold-200"
                  >
                    <Eye className="h-3.5 w-3.5" /> Review
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleting(application)}
                    disabled={demo}
                    className="rounded-md p-2 text-cream/45 transition hover:bg-red-400/10 hover:text-red-300 disabled:opacity-25"
                    aria-label="Delete application"
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

      <Dialog
        open={Boolean(reviewing)}
        onOpenChange={(open) => !open && setReviewing(null)}
        title={reviewing ? reviewing.name : "Application"}
        description={reviewing ? `${reviewing.referenceNo} · submitted ${formatDateTime(reviewing.submittedAt)}` : undefined}
        className="sm:max-w-2xl"
      >
        {reviewing && (
          <MembershipReview
            key={reviewing.id}
            application={reviewing}
            demo={demo}
            onUpdated={(updated) => {
              setItems((current) => current.map((item) => (item.id === updated.id ? updated : item)));
              setReviewing(null);
              router.refresh();
            }}
          />
        )}
      </Dialog>

      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Delete this application?"
        description={deleting ? `${deleting.name}'s application and notes will be permanently deleted.` : ""}
        loading={working}
        onConfirm={remove}
      />
    </>
  );
}

function MembershipReview({
  application,
  demo,
  onUpdated,
}: {
  application: MembershipDTO;
  demo: boolean;
  onUpdated: (application: MembershipDTO) => void;
}) {
  const [notes, setNotes] = React.useState(application.notes);
  const [status, setStatus] = React.useState<MembershipStatus>(application.status);
  const [pending, setPending] = React.useState<MembershipStatus | "notes" | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const save = async (nextStatus: MembershipStatus) => {
    setError(null);
    setPending(nextStatus === status ? "notes" : nextStatus);
    try {
      const { ok, payload } = await apiRequest(`/api/admin/membership/${application.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: nextStatus, notes }),
      });
      if (!ok) {
        setError(fromApiError(payload));
        return;
      }
      setStatus(nextStatus);
      toast.success(`Application marked ${nextStatus}`);
      onUpdated({ ...application, status: nextStatus, notes, reviewedAt: new Date().toISOString() });
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setPending(null);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge status={status} />
        <Badge variant="outline">{application.department}</Badge>
        <Badge variant="outline">{application.semester} semester</Badge>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Info label="Student ID" value={application.studentId} />
        <Info label="Phone" value={application.phone} icon={<Phone className="h-3.5 w-3.5" />} href={`tel:${application.phone}`} />
        <Info label="Email" value={application.email} icon={<Mail className="h-3.5 w-3.5" />} href={`mailto:${application.email}`} />
        <Info label="Reviewed" value={application.reviewedAt ? formatDate(application.reviewedAt) : "Not yet reviewed"} />
      </div>

      <ReviewText title="Motivation" text={application.motivation || "Not provided"} />
      {application.experience && <ReviewText title="Previous experience" text={application.experience} />}
      {application.activities && <ReviewText title="Preferred activities" text={application.activities} />}

      <Field label="Private reviewer notes" hint="Only visible to administrators. Not shown to the applicant.">
        <textarea
          className="input-base min-h-[100px] py-3"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Interview notes, follow-up actions, reasons for the decision…"
          disabled={demo}
        />
      </Field>

      {error && <p className="rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">{error}</p>}

      {demo ? (
        <p className="rounded-lg border border-amber-400/25 bg-amber-400/[0.06] px-4 py-3 text-xs text-amber-100/75">
          Connect MongoDB to review applications.
        </p>
      ) : (
        <div className="flex flex-wrap items-center justify-end gap-2 border-t border-white/[0.08] pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => save(status)}
            disabled={Boolean(pending)}
            className="h-10 px-4 text-xs"
          >
            {pending === "notes" && <Loader2 className="h-4 w-4 animate-spin" />}
            Save notes
          </Button>
          {status !== "rejected" && (
            <Button
              type="button"
              variant="destructive"
              onClick={() => save("rejected")}
              disabled={Boolean(pending)}
              className="h-10 px-4 text-xs"
            >
              {pending === "rejected" && <Loader2 className="h-4 w-4 animate-spin" />}
              Reject
            </Button>
          )}
          {status !== "approved" && (
            <Button
              type="button"
              onClick={() => save("approved")}
              disabled={Boolean(pending)}
              className="h-10 px-4 text-xs"
            >
              {pending === "approved" && <Loader2 className="h-4 w-4 animate-spin" />}
              <Check className="h-4 w-4" /> Approve
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

function Info({ label, value, icon, href }: { label: string; value: string; icon?: React.ReactNode; href?: string }) {
  return (
    <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] px-3.5 py-2.5">
      <p className="text-[0.55rem] font-semibold uppercase tracking-[0.14em] text-cream/30">{label}</p>
      {href ? (
        <a href={href} className="mt-1 flex items-center gap-1.5 truncate text-xs text-cream/75 hover:text-gold-200">
          {icon}
          {value}
        </a>
      ) : (
        <p className="mt-1 truncate text-xs text-cream/75">{value}</p>
      )}
    </div>
  );
}

function ReviewText({ title, text }: { title: string; text: string }) {
  return (
    <div>
      <p className="text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-gold-300/80">{title}</p>
      <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-cream/60">{text}</p>
    </div>
  );
}
