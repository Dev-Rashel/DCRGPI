"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import * as React from "react";
import { Megaphone, X } from "lucide-react";
import type { NoticeDTO } from "@/lib/types";

export function NoticeBar({ notices }: { notices: NoticeDTO[] }) {
  const [dismissed, setDismissed] = React.useState(false);
  const reduce = useReducedMotion();
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    if (notices.length < 2 || dismissed) return;
    const timer = window.setInterval(() => setIndex((value) => (value + 1) % notices.length), 6500);
    return () => window.clearInterval(timer);
  }, [notices.length, dismissed]);

  if (!notices.length || dismissed) return null;
  const active = notices[index];
  const important = notices.some((notice) => notice.isImportant);

  return (
    <div className="relative z-20 border-y border-gold-400/20 bg-gold-400/[0.07]">
      <div className="container-narrow flex items-center gap-3 py-3 text-sm sm:gap-4">
        <span className="flex shrink-0 items-center gap-2 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-gold-300">
          <Megaphone className="h-4 w-4" />
          {important ? "Important" : "Notice"}
        </span>
        <div className="relative min-h-[1.4rem] flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5"
            >
              <span className="text-cream/90">{active.title}</span>
              <span className="hidden text-xs text-cream/45 sm:inline">— {active.content}</span>
            </motion.div>
          </AnimatePresence>
        </div>
        <Link
          href="/#notices"
          className="hidden shrink-0 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-gold-300 hover:text-gold-200 sm:block"
        >
          {notices.length} updates
        </Link>
        <button
          type="button"
          aria-label="Dismiss notices"
          onClick={() => setDismissed(true)}
          className="shrink-0 rounded-full p-1.5 text-cream/40 transition hover:bg-white/10 hover:text-cream"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
