import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, FileText, LockKeyhole, ShieldCheck, Sparkles, UserCheck } from "lucide-react";
import { LoginForm } from "@/components/admin/login-form";
import { getSettings } from "@/lib/data";
import { Logo } from "@/components/site/brand";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

const FEATURES = [
  { icon: FileText, title: "Publish instantly", description: "Stories, notices and updates go live the moment you save." },
  { icon: CalendarDays, title: "Run every event", description: "Create events and manage registrations from one place." },
  { icon: UserCheck, title: "Review applications", description: "Approve members and track every applicant with ease." },
  { icon: ShieldCheck, title: "Secure by design", description: "Protected routes and encrypted, HTTP-only sessions." },
];

export default async function AdminLoginPage() {
  const settings = await getSettings();

  return (
    <div className="relative min-h-screen overflow-hidden bg-ink-950">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="admin-grid-bg absolute inset-0 opacity-40" />
        <div className="absolute -left-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-gold-400/[0.09] blur-3xl" />
        <div className="absolute -bottom-52 right-0 h-[36rem] w-[36rem] rounded-full bg-blue-500/[0.07] blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-400/40 to-transparent" />
      </div>

      <div className="relative mx-auto grid min-h-screen w-full max-w-7xl items-center gap-12 px-5 py-10 sm:px-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-20 lg:px-10 lg:py-16">
        <aside className="hidden flex-col justify-between gap-16 lg:flex">
          <Link href="/" className="inline-flex w-fit items-center gap-3">
            <Logo settings={settings} />
            <span className="flex flex-col leading-tight">
              <span className="font-display text-lg font-semibold text-cream">DCRGPI</span>
              <span className="text-[0.6rem] uppercase tracking-[0.22em] text-cream/40">Management system</span>
            </span>
          </Link>

          <div className="max-w-xl">
            <p className="eyebrow mb-6">Content studio</p>
            <h1 className="font-display text-5xl font-semibold leading-[1.04] text-cream xl:text-6xl">
              Run the club&apos;s <span className="gold-text italic">digital home</span> from one place.
            </h1>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-cream/50">
              Publish stories, manage events, review membership applications and keep every part of the public website
              up to date — no code required.
            </p>

            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              {FEATURES.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-4 transition hover:border-gold-400/25 hover:bg-white/[0.04]"
                >
                  <feature.icon className="h-4 w-4 text-gold-400" />
                  <p className="mt-3 text-xs font-semibold text-cream/85">{feature.title}</p>
                  <p className="mt-1 text-[0.68rem] leading-relaxed text-cream/40">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between gap-6 border-t border-white/[0.07] pt-6 text-[0.62rem] uppercase tracking-[0.18em] text-cream/25">
            <span>Rangpur Government Polytechnic Institute</span>
            <span className="flex items-center gap-1.5 text-gold-400/60">
              <Sparkles className="h-3 w-3" /> Think Bold. Speak Fearlessly.
            </span>
          </div>
        </aside>

        <div className="w-full max-w-md justify-self-center lg:justify-self-end">
          <div className="mb-8 lg:hidden">
            <Link href="/" className="inline-flex items-center gap-3">
              <Logo settings={settings} />
              <span className="flex flex-col leading-tight">
                <span className="font-display text-lg font-semibold text-cream">DCRGPI</span>
                <span className="text-[0.58rem] uppercase tracking-[0.2em] text-cream/40">Management system</span>
              </span>
            </Link>
          </div>

          <div className="relative">
            <div className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-gold-400/[0.05] blur-2xl" aria-hidden />
            <div className="surface relative overflow-hidden rounded-3xl p-6 shadow-card sm:p-8">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-400/40 to-transparent" />

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gold-400/30 bg-gold-400/10">
                <LockKeyhole className="h-5 w-5 text-gold-300" />
              </div>
              <p className="mt-5 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-gold-300">Admin access</p>
              <h2 className="mt-2 font-display text-3xl font-semibold text-cream sm:text-[2rem]">Welcome back</h2>
              <p className="mt-2 text-sm leading-relaxed text-cream/45">
                Sign in with your club administrator account to open the dashboard.
              </p>

              <div className="mt-7">
                <Suspense fallback={<div className="skeleton h-64 w-full" />}>
                  <LoginForm />
                </Suspense>
              </div>
            </div>
          </div>

          <p className="mt-6 flex items-start justify-center gap-2 text-center text-[0.66rem] leading-relaxed text-cream/30">
            <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-400/50" />
            <span>
              Access is monitored. Need an account or forgot your password? Contact the club&apos;s IT secretary.
            </span>
          </p>

          <Link
            href="/"
            className="mx-auto mt-4 flex w-fit items-center gap-1.5 text-[0.64rem] font-semibold uppercase tracking-[0.14em] text-cream/30 transition hover:text-gold-300"
          >
            View public website <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
