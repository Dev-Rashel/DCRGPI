import type { Metadata } from "next";
import Link from "next/link";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  FileText,
  Images,
  Megaphone,
  Newspaper,
  Plus,
  UserPlus,
  Users,
} from "lucide-react";
import { formatDate, formatDateTime } from "@/lib/utils";
import {
  getContactMessages,
  getDashboardStats,
  getEvents,
  getMembershipApplications,
  getRecentActivity,
  getSettings,
} from "@/lib/data";
import { AdminButton, AdminPageHeader, QuickAction, StatCard, StatusBadge } from "@/components/admin/ui";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Dashboard" };

export default async function AdminDashboardPage() {
  const [stats, activity, pending, messages, upcoming, settings] = await Promise.all([
    getDashboardStats(),
    getRecentActivity(6),
    getMembershipApplications({ status: "pending", limit: 4 }),
    getContactMessages({ status: "unread", limit: 4 }),
    getEvents({ phase: "upcoming", limit: 3 }),
    getSettings(),
  ]);

  return (
    <div>
      <AdminPageHeader
        title="Club overview"
        description={`Welcome back. Here is what is happening with ${settings.footerTagline ? "the club" : "DCRGPI"} right now.`}
        actions={
          <>
            <AdminButton href="/admin/posts/new" variant="primary">
              <Plus className="h-3.5 w-3.5" /> New post
            </AdminButton>
            <AdminButton href="/admin/events/new" variant="outline">
              <CalendarDays className="h-3.5 w-3.5" /> New event
            </AdminButton>
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total posts" value={stats.totalPosts} hint={`${stats.publishedPosts} published · ${stats.draftPosts} drafts`} icon={Newspaper} href="/admin/posts" tone="gold" />
        <StatCard label="Upcoming events" value={stats.upcomingEvents} hint={`${stats.totalEvents} events in total`} icon={CalendarDays} href="/admin/events" tone="blue" />
        <StatCard label="Members" value={stats.totalMembers} hint={`${stats.pendingRegistrations} pending review`} icon={Users} href="/admin/membership" tone="green" />
        <StatCard label="Contact messages" value={stats.contactMessages} hint={`${stats.unreadMessages} unread`} icon={UserPlus} href="/admin/messages" tone={stats.unreadMessages ? "red" : "default"} />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Gallery photos" value={stats.galleryItems} icon={Images} href="/admin/gallery" />
        <StatCard label="Leadership profiles" value={stats.teamMembers} icon={Users} href="/admin/team" />
        <StatCard label="Notices" value={stats.notices} icon={Megaphone} href="/admin/notices" />
        <StatCard label="Published posts" value={stats.publishedPosts} icon={CheckCircle2} href="/admin/posts?status=published" tone="green" />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="space-y-6">
          <section className="surface p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-gold-300">Needs attention</p>
                <h3 className="mt-1 font-display text-xl font-semibold text-cream">Pending applications</h3>
              </div>
              <Link href="/admin/membership?status=pending" className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-cream/40 hover:text-gold-300">
                View all
              </Link>
            </div>
            <div className="mt-4 space-y-2">
              {pending.items.length ? (
                pending.items.map((application) => (
                  <Link
                    key={application.id}
                    href="/admin/membership?status=pending"
                    className="flex items-center gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3.5 transition hover:border-gold-400/25"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-400/10 text-[0.65rem] font-bold text-gold-300">
                      {application.name.slice(0, 2).toUpperCase()}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-cream/90">{application.name}</p>
                      <p className="truncate text-[0.68rem] text-cream/35">
                        {application.department} · {application.semester} semester · {application.referenceNo}
                      </p>
                    </div>
                    <span className="shrink-0 text-[0.65rem] text-cream/30">{formatDate(application.submittedAt)}</span>
                  </Link>
                ))
              ) : (
                <div className="flex items-center gap-3 rounded-lg border border-dashed border-white/10 p-4 text-sm text-cream/40">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" /> No pending applications — all caught up.
                </div>
              )}
            </div>
          </section>

          <section className="surface p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-gold-300">Inbox</p>
                <h3 className="mt-1 font-display text-xl font-semibold text-cream">Unread messages</h3>
              </div>
              <Link href="/admin/messages" className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-cream/40 hover:text-gold-300">
                Open inbox
              </Link>
            </div>
            <div className="mt-4 space-y-2">
              {messages.length ? (
                messages.map((message) => (
                  <Link
                    key={message.id}
                    href="/admin/messages"
                    className="block rounded-lg border border-white/[0.06] bg-white/[0.02] p-3.5 transition hover:border-gold-400/25"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="truncate text-sm font-medium text-cream/90">{message.subject}</p>
                      <span className="shrink-0 text-[0.65rem] text-cream/30">{formatDate(message.submittedAt)}</span>
                    </div>
                    <p className="mt-0.5 truncate text-[0.68rem] text-cream/35">
                      {message.name} · {message.email}
                    </p>
                  </Link>
                ))
              ) : (
                <div className="flex items-center gap-3 rounded-lg border border-dashed border-white/10 p-4 text-sm text-cream/40">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Inbox is clear.
                </div>
              )}
            </div>
          </section>

          <section className="surface p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-gold-300">Calendar</p>
                <h3 className="mt-1 font-display text-xl font-semibold text-cream">Next up</h3>
              </div>
              <Link href="/admin/events" className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-cream/40 hover:text-gold-300">
                Manage events
              </Link>
            </div>
            <div className="mt-4 space-y-2">
              {upcoming.items.length ? (
                upcoming.items.map((event) => (
                  <div key={event.id} className="flex items-center gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3.5">
                    <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-lg border border-gold-400/20 bg-gold-400/[0.06]">
                      <span className="text-[0.55rem] uppercase tracking-wide text-gold-300">
                        {new Date(event.startDate).toLocaleString("en-GB", { month: "short" })}
                      </span>
                      <span className="font-display text-sm font-semibold text-cream">
                        {new Date(event.startDate).getDate()}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-cream/90">{event.title}</p>
                      <p className="truncate text-[0.68rem] text-cream/35">
                        {formatDateTime(event.startDate)} · {event.venue}
                      </p>
                    </div>
                    <StatusBadge status={event.registrationStatus} />
                  </div>
                ))
              ) : (
                <p className="rounded-lg border border-dashed border-white/10 p-4 text-sm text-cream/40">
                  No upcoming events scheduled.
                </p>
              )}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="surface p-6">
            <h3 className="font-display text-lg font-semibold text-cream">Quick actions</h3>
            <div className="mt-4 space-y-2">
              <QuickAction href="/admin/posts/new" icon={Plus} label="Write a post" description="Publish news or an article" />
              <QuickAction href="/admin/events/new" icon={CalendarDays} label="Create an event" description="Open registrations in minutes" />
              <QuickAction href="/admin/team" icon={Users} label="Update leadership" description="Add or reorder committee profiles" />
              <QuickAction href="/admin/gallery" icon={Images} label="Upload photos" description="Add moments to an album" />
              <QuickAction href="/admin/settings" icon={FileText} label="Edit website content" description="Hero, about, footer and more" />
            </div>
          </section>

          <section className="surface p-6">
            <h3 className="font-display text-lg font-semibold text-cream">Recent activity</h3>
            <ol className="mt-4 space-y-3.5">
              {activity.length ? (
                activity.map((item) => (
                  <li key={item.id} className="flex gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-400/70" />
                    <div className="min-w-0">
                      <p className="text-xs leading-relaxed text-cream/70">
                        <span className="font-semibold text-cream/90">{item.action}</span>{" "}
                        {item.entity.toLowerCase()}
                        {item.detail && <span className="text-cream/45"> — {item.detail}</span>}
                      </p>
                      <p className="mt-0.5 text-[0.6rem] uppercase tracking-[0.1em] text-cream/25">
                        {item.actor} · {formatDate(item.createdAt)}
                      </p>
                    </div>
                  </li>
                ))
              ) : (
                <li className="text-sm text-cream/40">No activity recorded yet.</li>
              )}
            </ol>
          </section>

          <section className="rounded-2xl border border-gold-400/20 bg-gold-400/[0.05] p-6">
            <Clock className="h-5 w-5 text-gold-300" />
            <h3 className="mt-3 font-display text-lg font-semibold text-cream">Content tip</h3>
            <p className="mt-2 text-xs leading-relaxed text-cream/50">
              Anything you publish appears on the public site immediately. Drafts stay private until you are ready.
              Remember to upload a cover image for every post and event.
            </p>
            <Link href="/admin/posts" className="mt-4 inline-flex items-center gap-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-gold-300">
              Review content <Badge variant="outline">{stats.draftPosts} drafts</Badge>
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
