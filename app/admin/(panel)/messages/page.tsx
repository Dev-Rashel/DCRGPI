import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Search } from "lucide-react";
import { AdminEmptyState, AdminPageHeader } from "@/components/admin/ui";
import { DemoNotice } from "@/components/admin/form";
import { MessagesManager } from "@/components/admin/messages-manager";
import { Input } from "@/components/ui/input";
import { demoMode, getContactMessages } from "@/lib/data";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Contact messages" };

type SearchParams = Promise<{ q?: string; status?: string }>;

export default async function AdminMessagesPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const q = params.q?.trim() ?? "";
  const status = params.status === "unread" || params.status === "read" ? params.status : "all";
  const demo = demoMode();

  const [items, all, unread] = await Promise.all([
    getContactMessages({ status, q: q || undefined, limit: 200 }),
    getContactMessages({ limit: 500 }),
    getContactMessages({ status: "unread", limit: 500 }),
  ]);

  const hrefFor = (nextStatus: string) => {
    const search = new URLSearchParams();
    if (q) search.set("q", q);
    if (nextStatus !== "all") search.set("status", nextStatus);
    const query = search.toString();
    return query ? `/admin/messages?${query}` : "/admin/messages";
  };

  return (
    <div>
      <AdminPageHeader
        title="Contact messages"
        description="Enquiries from the public contact form. Mark messages as read, reply by email and keep the inbox tidy."
      />

      <div className="mb-4 space-y-3">
        <DemoNotice show={demo} />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { key: "all", label: "All messages", count: all.length },
              { key: "unread", label: "Unread", count: unread.length },
              { key: "read", label: "Read", count: Math.max(0, all.length - unread.length) },
            ].map((tab) => (
              <Link
                key={tab.key}
                href={hrefFor(tab.key)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.08em] transition ${
                  status === tab.key
                    ? "border-gold-400/40 bg-gold-400/10 text-gold-200"
                    : "border-white/10 text-cream/45 hover:border-white/25 hover:text-cream/80"
                }`}
              >
                {tab.label}
                <span className={`text-[0.6rem] ${status === tab.key ? "text-gold-300/70" : "text-cream/25"}`}>{tab.count}</span>
              </Link>
            ))}
          </div>

          <form action="/admin/messages" method="get" className="flex items-center gap-2">
            {status !== "all" && <input type="hidden" name="status" value={status} />}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-cream/30" />
              <Input name="q" defaultValue={q} placeholder="Search messages…" className="h-9 w-56 pl-8 text-xs" aria-label="Search messages" />
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

      {items.length === 0 ? (
        <AdminEmptyState
          icon={Mail}
          title={q || status !== "all" ? "No matching messages" : "Inbox is clear"}
          description={
            q || status !== "all"
              ? "Try a different search term or status filter."
              : "Messages sent through the public contact form will appear here."
          }
        />
      ) : (
        <MessagesManager initialItems={items} demo={demo} />
      )}
    </div>
  );
}
