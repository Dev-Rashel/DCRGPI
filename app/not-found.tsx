import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-6 pt-24">
      <div className="max-w-lg text-center">
        <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full border border-gold-400/25 bg-gold-400/[0.06]">
          <Compass className="h-7 w-7 text-gold-400" />
        </div>
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-gold-300">Error 404</p>
        <h1 className="mt-4 font-display text-4xl font-semibold text-cream sm:text-5xl">This page left the debate</h1>
        <p className="mt-4 text-sm leading-relaxed text-cream/55">
          The page you are looking for may have been moved, unpublished, or never existed. Let&apos;s get you back to
          somewhere useful.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-gold-400 px-6 py-2.5 text-sm font-semibold text-ink-950 transition hover:bg-gold-300"
          >
            <ArrowLeft className="h-4 w-4" /> Back home
          </Link>
          <Link
            href="/posts"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-2.5 text-sm font-semibold text-cream transition hover:border-gold-400/50"
          >
            Read the latest
          </Link>
        </div>
      </div>
    </div>
  );
}
