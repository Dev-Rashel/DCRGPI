import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";

export function MembershipCta() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <div className="container-narrow">
        <div className="relative overflow-hidden rounded-3xl border border-gold-400/20 bg-gradient-to-br from-ink-800 via-ink-900 to-ink-950 px-6 py-14 sm:px-12 sm:py-20 lg:px-16">
          <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-gold-400/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(238,196,106,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(238,196,106,0.5) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
          <div className="relative max-w-2xl">
            <p className="eyebrow mb-5">Your voice belongs here</p>
            <h2 className="text-display-lg font-semibold text-cream">
              The stage is set. <span className="gold-text italic">Will you speak?</span>
            </h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-cream/65">
              Join a community that will challenge your thinking, sharpen your voice and stand beside you every time
              you take the floor. No experience needed — just the courage to begin.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="/register"
                className="group inline-flex h-12 items-center gap-2.5 rounded-full bg-gold-400 px-7 text-sm font-bold text-ink-950 transition hover:bg-gold-300"
              >
                Apply for membership
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
              <Link
                href="/about"
                className="inline-flex h-12 items-center gap-2.5 rounded-full border border-white/20 px-6 text-sm font-semibold text-cream transition hover:border-gold-400/50 hover:text-gold-200"
              >
                <Play className="h-3.5 w-3.5" /> Learn about us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
