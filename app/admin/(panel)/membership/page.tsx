import type { Metadata } from "next";
import Link from "next/link";
import { Download, Search, UserPlus } from "lucide-react";
import { AdminEmptyState, AdminPageHeader, TableShell } from "@/components/admin/ui";
import { DemoNotice } from "@/components/admin/form";
import { MembershipManager } from "@/components/admin/membership-manager";
import { Input } from "@/components/ui/input";
import { demoMode, getMembershipApplications } from "@/lib/data";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Membership applications" };

type SearchParams = Promise<{ q?: string; status?: string; page?: string }>;

const PAGE_SIZE = 20;

export default async function AdminMembershipPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const q = params.q?.trim() ?? "";
  const status = ["pending", "approved", "rejected"].includes(params.status ?? "") ? params.status! : "all";
  const page = Math.max(1, Number(params.page ?? 1) || 1);
  const demo = demoMode();

  const [result, all, pending, approved, rejected] = await Promise.all([
    getMembershipApplications({ status, q: q || undefined, page, limit: PAGE_SIZE }),
    getMembershipApplications({ limit: 1 }),
    getMembershipApplications({ status: "pending", limit: 1 }),
    getMembershipApplications({ status: "approved", limit: 1 }),
    getMembershipApplications({ status: "rejected", limit: 1 }),
  ]);

  const counts = { all: all.total, pending: pending.total, approved: approved.total, rejected: rejected.total };

  const hrefFor = (next: { status?: string; page?: number }) => {
    const search = new URLSearchParams();
    if (q) search.set("q", q);
    const nextStatus = next.status ?? status;
    if (nextStatus !== "all") search.set("status", nextStatus);
    if (next.page && next.page > 1) search.set("page", String(next.page));
    const query = search.toString();
    return query ? `/admin/membership?${query}` : "/admin/membership";
  };

  return (
    <div>
      <AdminPageHeader
        title="Membership applications"
        description="Review applications, approve new members and keep private notes for the membership committee."
        actions={
          demo ? undefined : (
            <a
              href="/api/admin/membership/export"
              className="inline-flex h-10 items-center gap-2 rounded-full border border-white/15 px-5 text-xs font-semibold uppercase tracking-[0.1em] text-cream transition hover:border-gold-400/50 hover:text-gold-200"
            >
              <Download className="h-3.5 w-3.5" /> Export CSV
            </a>
          )
        }
      />

      <div className="mb-4 space-y-3">
        <DemoNotice show={demo} />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { key: "all", label: "All applications" },
              { key: "pending", label: "Pending" },
              { key: "approved", label: "Approved" },
              { key: "rejected", label: "Rejected" },
            ].map((tab) => (
              <Link
                key={tab.key}
                href={hrefFor({ status: tab.key, page: 1 })}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.08em] transition ${
                  status === tab.key
                    ? "border-gold-400/40 bg-gold-400/10 text-gold-200"
                    : "border-white/10 text-cream/45 hover:border-white/25 hover:text-cream/80"
                }`}
              >
                {tab.label}
                <span className={`text-[0.6rem] ${status === tab.key ? "text-gold-300/70" : "text-cream/25"}`}>
                  {counts[tab.key as keyof typeof counts]}
                </span>
              </Link>
            ))}
          </div>

          <form action="/admin/membership" method="get" className="flex items-center gap-2">
            {status !== "all" && <input type="hidden" name="status" value={status} />}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-cream/30" />
              <Input name="q" defaultValue={q} placeholder="Name, ID, email or reference…" className="h-9 w-60 pl-8 text-xs" aria-label="Search applications" />
            </div>
            <button
              type="submit"
              className="h-9 rounded-lg border border-white/10 px-3 text-[0.65rem] font-semibold uppercase tracking-[0.08em] text-cream/60 transition hover:border-gold-400/40 hover:text-gold-200"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {result.items.length === 0 ? (
        <AdminEmptyState
          icon={UserPlus}
          title={q || status !== "all" ? "No matching applications" : "No applications yet"}
          description={
            q || status !== "all"
              ? "Try a different search term or status filter."
              : "Applications submitted through the public membership form will appear here."
          }
        />
      ) : (
        <TableShell>
          <MembershipManager initialItems={result.items} demo={demo} />
        </TableShell>
      )}

      {result.pages > 1 && (
        <div className="mt-4 flex items-center justify-between gap-4 text-xs text-cream/40">
          <p>
            Page {result.page} of {result.pages} · {result.total} applications
          </p>
          <div className="flex items-center gap-2">
            <Link
              href={hrefFor({ page: result.page - 1 })}
              className={`rounded-full border border-white/10 px-3.5 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.08em] transition hover:border-gold-400/40 hover:text-gold-200 ${
                result.page <= 1 ? "pointer-events-none opacity-40" : ""
              }`}
            >
              Previous
            </Link>
            <Link
              href={hrefFor({ page: result.page + 1 })}
              className={`rounded-full border border-white/10 px-3.5 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.08em] transition hover:border-gold-400/40 hover:text-gold-200 ${
                result.page >= result.pages ? "pointer-events-none opacity-40" : ""
              }`}
            >
              Next
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
