import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { ArrowUpRight, Lock, ShieldCheck, Sparkles } from "lucide-react";
import { LoginForm } from "@/components/admin/login-form";
import { getSettings } from "@/lib/data";
import { Logo } from "@/components/site/brand";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const settings = await getSettings();

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
      <div className="relative hidden overflow-hidden bg-ink-900 lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(238,196,106,0.14),transparent_55%)]" />
        <div className="admin-grid-bg absolute inset-0 opacity-60" />
        <div className="relative p-12">
          <Link href="/" className="inline-flex items-center gap-3">
            <Logo settings={settings} />
            <span className="flex flex-col leading-tight">
              <span className="font-display text-lg font-semibold text-cream">
                Debating Club <span className="text-gold-400">of RPI</span>
              </span>
              <span className="text-[0.6rem] uppercase tracking-[0.22em] text-cream/40">Management system</span>
            </span>
          </Link>
        </div>
        <div className="relative px-12">
          <p className="eyebrow mb-5">Content studio</p>
          <h1 className="max-w-lg font-display text-5xl font-semibold leading-[1.05] text-cream">
            Run the club&apos;s <span className="gold-text italic">digital home</span> from one place.
          </h1>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-cream/50">
            Publish stories, manage events, review membership applications and keep every part of the public website
            up to date — no code required.
          </p>
          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            {[
              { icon: Sparkles, text: "Manage all public content" },
              { icon: ShieldCheck, text: "Role-protected admin access" },
              { icon: Lock, text: "Secure, HTTP-only sessions" },
              { icon: ArrowUpRight, text: "Changes go live instantly" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-2.5 rounded-lg border border-white/[0.07] bg-white/[0.02] px-4 py-3">
                <item.icon className="h-4 w-4 text-gold-400" />
                <span className="text-xs text-cream/60">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="relative p-12 text-[0.65rem] uppercase tracking-[0.18em] text-cream/25">
          Rangpur Government Polytechnic Institute
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <div className="mb-10 lg:hidden">
            <Link href="/" className="inline-flex items-center gap-3">
              <Logo settings={settings} />
              <span className="font-display text-lg font-semibold text-cream">
                Debating Club <span className="text-gold-400">of RPI</span>
              </span>
            </Link>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-gold-400/30 bg-gold-400/10">
            <Lock className="h-5 w-5 text-gold-300" />
          </div>
          <h2 className="mt-5 font-display text-3xl font-semibold text-cream">Admin sign in</h2>
          <p className="mt-2 text-sm text-cream/45">Authorized club administrators only.</p>
          <div className="mt-8">
            <Suspense fallback={<div className="skeleton h-64 w-full" />}>
              <LoginForm />
            </Suspense>
          </div>
          <p className="mt-8 text-center text-[0.65rem] leading-relaxed text-cream/25">
            Access is monitored. If you have forgotten your credentials, contact the club&apos;s IT secretary.
          </p>
        </div>
      </div>
    </div>
  );
}
