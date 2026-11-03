import type { ReactNode } from "react";
import Link from "next/link";
import { AlertTriangle, Info, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function Field({
  label,
  htmlFor,
  error,
  hint,
  required,
  children,
  className,
}: {
  label: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={htmlFor} className="flex items-center gap-1.5">
        {label}
        {required && <span className="text-gold-400">*</span>}
      </Label>
      {children}
      {hint && !error && <p className="text-[0.68rem] leading-relaxed text-cream/35">{hint}</p>}
      {error && (
        <p className="text-[0.7rem] text-red-300" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function FormSection({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("surface p-5 sm:p-6", className)}>
      <div className="mb-5 border-b border-white/[0.07] pb-4">
        <h3 className="font-display text-lg font-semibold text-cream">{title}</h3>
        {description && <p className="mt-1 text-xs leading-relaxed text-cream/40">{description}</p>}
      </div>
      {children}
    </section>
  );
}

export function FormGrid({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("grid gap-4 sm:grid-cols-2", className)}>{children}</div>;
}

export function FormError({ message }: { message?: string | null }) {
  if (!message) return null;
  return (
    <p role="alert" className="rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">
      {message}
    </p>
  );
}

export function InfoBanner({
  children,
  tone = "info",
}: {
  children: ReactNode;
  tone?: "info" | "warning" | "success";
}) {
  const styles = {
    info: "border-sky-400/25 bg-sky-400/[0.06] text-sky-100/80",
    warning: "border-amber-400/25 bg-amber-400/[0.06] text-amber-100/80",
    success: "border-emerald-400/25 bg-emerald-400/[0.06] text-emerald-100/80",
  }[tone];
  const Icon = tone === "info" ? Info : AlertTriangle;

  return (
    <div className={cn("flex items-start gap-3 rounded-xl border px-4 py-3 text-xs leading-relaxed", styles)}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <div>{children}</div>
    </div>
  );
}

export function DemoNotice({ show = true }: { show?: boolean }) {
  if (!show) return null;
  return (
    <InfoBanner tone="warning">
      <strong className="font-semibold">Demo mode.</strong> The database is not configured, so this content is
      read-only sample data. Add <code className="rounded bg-black/20 px-1">MONGODB_URI</code> to your environment to
      enable saving.
    </InfoBanner>
  );
}

export function SaveBar({
  cancelHref,
  submitLabel = "Save changes",
  isSubmitting,
  note,
  disabled = false,
}: {
  cancelHref: string;
  submitLabel?: string;
  isSubmitting?: boolean;
  note?: string;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col gap-3 border-t border-white/[0.08] pt-5 sm:flex-row sm:items-center sm:justify-between">
      <p className="max-w-md text-[0.68rem] leading-relaxed text-cream/35">{note}</p>
      <div className="flex shrink-0 items-center gap-3">
        <Link
          href={cancelHref}
          className="inline-flex h-10 items-center rounded-full border border-white/15 px-5 text-xs font-semibold uppercase tracking-[0.1em] text-cream/70 transition hover:border-white/30 hover:text-cream"
        >
          Cancel
        </Link>
        <Button
          type="submit"
          disabled={isSubmitting || disabled}
          className="h-10 px-6 text-xs uppercase tracking-[0.1em]"
        >
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {isSubmitting ? "Saving…" : submitLabel}
        </Button>
      </div>
    </div>
  );
}
