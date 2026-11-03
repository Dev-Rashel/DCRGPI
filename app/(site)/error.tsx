"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Home, RefreshCw } from "lucide-react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6 pt-24">
      <div className="max-w-md text-center">
        <p className="eyebrow justify-center">Something went wrong</p>
        <h1 className="mt-5 font-display text-4xl font-semibold text-cream">The floor is temporarily closed</h1>
        <p className="mt-4 text-sm leading-relaxed text-cream/55">
          We hit an unexpected error while loading this page. Please try again, or head back to the homepage.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-full bg-gold-400 px-6 py-2.5 text-sm font-semibold text-ink-950"
          >
            <RefreshCw className="h-4 w-4" /> Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-2.5 text-sm font-semibold text-cream"
          >
            <Home className="h-4 w-4" /> Home
          </Link>
        </div>
      </div>
    </div>
  );
}
