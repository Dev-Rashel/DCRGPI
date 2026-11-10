"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarDays,
  ExternalLink,
  Images,
  LayoutDashboard,
  LogOut,
  Mail,
  Megaphone,
  Menu,
  Newspaper,
  Settings,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/site/brand";
import type { SessionUser, SiteSettings } from "@/lib/types";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Posts", href: "/admin/posts", icon: Newspaper },
  { label: "Events", href: "/admin/events", icon: CalendarDays },
  { label: "Leadership", href: "/admin/team", icon: Users },
  { label: "Membership", href: "/admin/membership", icon: UserPlus },
  { label: "Gallery", href: "/admin/gallery", icon: Images },
  { label: "Notices", href: "/admin/notices", icon: Megaphone },
  { label: "Messages", href: "/admin/messages", icon: Mail },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

const TITLES: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/posts": "Posts",
  "/admin/posts/new": "New post",
  "/admin/events": "Events",
  "/admin/events/new": "New event",
  "/admin/team": "Club leadership",
  "/admin/membership": "Membership applications",
  "/admin/gallery": "Gallery",
  "/admin/notices": "Notices",
  "/admin/messages": "Contact messages",
  "/admin/settings": "Website settings",
};

function titleFor(pathname: string) {
  if (TITLES[pathname]) return TITLES[pathname];
  if (pathname.startsWith("/admin/posts/")) return "Edit post";
  if (pathname.startsWith("/admin/events/") && pathname.endsWith("/registrations")) return "Event registrations";
  if (pathname.startsWith("/admin/events/")) return "Edit event";
  return "Admin";
}

export function AdminShell({
  session,
  settings,
  children,
}: {
  session: SessionUser;
  settings: SiteSettings;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [loggingOut, setLoggingOut] = React.useState(false);

  React.useEffect(() => setOpen(false), [pathname]);

  const logout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      toast.success("Signed out");
      router.push("/admin/login");
      router.refresh();
    } catch {
      toast.error("Could not sign out");
      setLoggingOut(false);
    }
  };

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname === href || pathname.startsWith(`${href}/`);

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-3 border-b border-white/[0.07] px-5">
        <Logo settings={settings} size="sm" />
        <div className="min-w-0">
          <p className="truncate font-display text-sm font-semibold text-cream">DCRGPI Admin</p>
          <p className="text-[0.58rem] uppercase tracking-[0.16em] text-cream/30">Content studio</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-5" aria-label="Admin navigation">
        <p className="mb-2 px-2 text-[0.55rem] font-semibold uppercase tracking-[0.2em] text-cream/25">Manage</p>
        <ul className="space-y-0.5">
          {NAV.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition",
                  isActive(item.href)
                    ? "bg-gold-400/10 text-gold-200"
                    : "text-cream/55 hover:bg-white/[0.04] hover:text-cream"
                )}
                aria-current={isActive(item.href) ? "page" : undefined}
              >
                <item.icon
                  className={cn(
                    "h-4 w-4 shrink-0",
                    isActive(item.href) ? "text-gold-400" : "text-cream/35 group-hover:text-cream/70"
                  )}
                />
                {item.label}
                {isActive(item.href) && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-gold-400" />}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-6 border-t border-white/[0.07] pt-5">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-cream/45 transition hover:bg-white/[0.04] hover:text-cream"
          >
            <ExternalLink className="h-4 w-4" /> View public site
          </Link>
        </div>
      </nav>

      <div className="border-t border-white/[0.07] p-3">
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-400/15 text-xs font-bold uppercase text-gold-300">
              {session.name.slice(0, 2)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-cream">{session.name}</p>
              <p className="truncate text-[0.6rem] text-cream/35">{session.email}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={logout}
            disabled={loggingOut}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-cream/55 transition hover:border-red-400/40 hover:text-red-300 disabled:opacity-50"
          >
            <LogOut className="h-3.5 w-3.5" /> {loggingOut ? "Signing out…" : "Sign out"}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-ink-950">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-white/[0.07] bg-ink-900/60 lg:block">
        {sidebar}
      </aside>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-ink-950/80 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 w-72 border-r border-white/[0.07] bg-ink-900 lg:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 32 }}
            >
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="absolute right-3 top-4 z-10 rounded-full p-2 text-cream/50 hover:bg-white/10 hover:text-cream"
                aria-label="Close menu"
              >
                <X className="h-4 w-4" />
              </button>
              {sidebar}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-white/[0.07] bg-ink-950/85 px-5 backdrop-blur-xl sm:px-7">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-lg border border-white/10 p-2 text-cream/70 lg:hidden"
            aria-label="Open menu"
            aria-expanded={open}
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="min-w-0">
            <h1 className="truncate font-display text-lg font-semibold text-cream">{titleFor(pathname)}</h1>
            <p className="hidden text-[0.6rem] uppercase tracking-[0.16em] text-cream/30 sm:block">
              DCRGPI · Management
            </p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="hidden items-center gap-1.5 rounded-full border border-white/10 px-3.5 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-cream/50 transition hover:border-gold-400/40 hover:text-gold-200 sm:flex"
            >
              Live site <ExternalLink className="h-3 w-3" />
            </Link>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold-400/15 text-[0.65rem] font-bold uppercase text-gold-300">
              {session.name.slice(0, 2)}
            </span>
          </div>
        </header>

        <main className="p-5 sm:p-7 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
