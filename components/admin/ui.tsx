import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight, Inbox } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { MembershipStatus, PostStatus, RegistrationStatus } from "@/lib/types";

export function AdminPageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="font-display text-2xl font-semibold text-cream sm:text-3xl">{title}</h2>
        {description && <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-cream/45">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2.5">{actions}</div>}
    </div>
  );
}

export function AdminButton({
  href,
  children,
  variant = "primary",
  target,
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "outline" | "ghost";
  target?: string;
}) {
  const styles = {
    primary: "bg-gold-400 text-ink-950 hover:bg-gold-300",
    outline: "border border-white/15 text-cream hover:border-gold-400/50 hover:text-gold-200",
    ghost: "text-cream/60 hover:bg-white/[0.05] hover:text-cream",
  }[variant];

  return (
    <Link
      href={href}
      target={target}
      className={cn("inline-flex h-10 items-center gap-2 rounded-full px-5 text-xs font-semibold uppercase tracking-[0.1em] transition", styles)}
    >
      {children}
    </Link>
  );
}

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  href,
  tone = "default",
}: {
  label: string;
  value: number | string;
  hint?: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  tone?: "default" | "gold" | "green" | "red" | "blue";
}) {
  const tones = {
    default: "text-cream/50 bg-white/[0.05]",
    gold: "text-gold-300 bg-gold-400/10",
    green: "text-emerald-300 bg-emerald-400/10",
    red: "text-red-300 bg-red-400/10",
    blue: "text-sky-300 bg-sky-400/10",
  };

  const content = (
    <div className="group surface flex h-full items-start justify-between gap-4 p-5 transition hover:border-gold-400/25">
      <div>
        <p className="text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-cream/35">{label}</p>
        <p className="mt-2 font-display text-3xl font-semibold text-cream">{value}</p>
        {hint && <p className="mt-1 text-[0.68rem] text-cream/35">{hint}</p>}
      </div>
      <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full", tones[tone])}>
        <Icon className="h-4 w-4" />
      </span>
    </div>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}

export function AdminEmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 px-6 py-16 text-center">
      <Icon className="mx-auto h-7 w-7 text-gold-400/50" />
      <p className="mt-4 font-display text-xl text-cream/80">{title}</p>
      {description && <p className="mx-auto mt-2 max-w-sm text-sm text-cream/40">{description}</p>}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { variant: "default" | "muted" | "success" | "warning" | "danger"; label: string }> = {
    published: { variant: "success", label: "Published" },
    draft: { variant: "muted", label: "Draft" },
    pending: { variant: "warning", label: "Pending" },
    approved: { variant: "success", label: "Approved" },
    rejected: { variant: "danger", label: "Rejected" },
    unread: { variant: "warning", label: "Unread" },
    read: { variant: "muted", label: "Read" },
    open: { variant: "success", label: "Registration open" },
    closed: { variant: "muted", label: "Registration closed" },
    "coming-soon": { variant: "warning", label: "Coming soon" },
    confirmed: { variant: "success", label: "Confirmed" },
    cancelled: { variant: "danger", label: "Cancelled" },
  };
  const item = map[status] ?? { variant: "muted" as const, label: status };
  return <Badge variant={item.variant}>{item.label}</Badge>;
}

export function MiniStat({ label, value, tone }: { label: string; value: number; tone?: string }) {
  return (
    <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] px-4 py-3">
      <p className="text-[0.55rem] font-semibold uppercase tracking-[0.16em] text-cream/30">{label}</p>
      <p className={cn("mt-1 font-display text-xl font-semibold text-cream", tone)}>{value}</p>
    </div>
  );
}

export function QuickAction({
  href,
  icon: Icon,
  label,
  description,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition hover:border-gold-400/30 hover:bg-white/[0.035]"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gold-400/10 text-gold-300">
        <Icon className="h-4 w-4" />
      </span>
      <span className="min-w-0">
        <span className="flex items-center gap-1.5 text-sm font-semibold text-cream/85">
          {label}
          <ArrowUpRight className="h-3 w-3 opacity-0 transition group-hover:opacity-100" />
        </span>
        <span className="mt-0.5 block text-[0.7rem] text-cream/35">{description}</span>
      </span>
    </Link>
  );
}

export function TableShell({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.015]">
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

export type { MembershipStatus, PostStatus, RegistrationStatus };
