"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowRight, CalendarDays, Sparkles } from "lucide-react";
import type { SiteSettings } from "@/lib/types";

export function Hero({ settings }: { settings: SiteSettings }) {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 700], [0, reduce ? 0 : 110]);
  const contentY = useTransform(scrollY, [0, 600], [0, reduce ? 0 : 45]);
  const opacity = useTransform(scrollY, [0, 500], [1, reduce ? 1 : 0.35]);

  const words = settings.heroTitle.split(" ");
  const overlay = Math.min(95, Math.max(0, settings.heroOverlay)) / 100;

  return (
    <section className="relative flex min-h-[94svh] items-center overflow-hidden pb-20 pt-28 sm:min-h-screen sm:pb-24 sm:pt-32">
      <motion.div className="absolute inset-0 -z-10" style={{ y: bgY }}>
        {settings.heroImage ? (
          <Image
            src={settings.heroImage}
            alt=""
            fill
            priority
            sizes="100vw"
            className="scale-[1.08] object-cover"
            style={{ objectPosition: settings.heroImagePosition }}
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-ink-700 via-ink-900 to-ink-950" />
        )}
      </motion.div>

      <div
        className="absolute inset-0 -z-10"
        style={{
          background: `linear-gradient(to top, #05070d 4%, rgba(5,7,13,${Math.min(0.96, overlay + 0.18)}) 42%, rgba(5,7,13,${overlay}) 100%)`,
        }}
      />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_75%_20%,rgba(238,196,106,0.13),transparent_45%)]" />

      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
        <motion.div
          className="absolute right-[8%] top-[22%] h-56 w-56 rounded-full border border-gold-400/20"
          animate={reduce ? undefined : { y: [0, -18, 0], rotate: [0, 8, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute right-[13%] top-[28%] h-32 w-32 rounded-full border border-white/10"
          animate={reduce ? undefined : { y: [0, 22, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute -left-24 bottom-10 h-72 w-72 rounded-full bg-gold-400/[0.06] blur-3xl" />
        <motion.div
          className="absolute left-[12%] top-[30%] h-1.5 w-1.5 rounded-full bg-gold-300"
          animate={reduce ? undefined : { opacity: [0.2, 1, 0.2], scale: [1, 1.8, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute right-[32%] bottom-[28%] h-1 w-1 rounded-full bg-cream/60"
          animate={reduce ? undefined : { opacity: [0.1, 0.8, 0.1] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1.4 }}
        />
      </div>

      <motion.div className="container-narrow relative" style={{ y: contentY, opacity }}>
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="eyebrow mb-6 sm:mb-8"
        >
          {settings.heroEyebrow}
        </motion.p>

        <h1 className="max-w-5xl text-display-xl font-semibold text-cream">
          {words.map((word, index) => (
            <span key={`${word}-${index}`} className="inline-block overflow-hidden pb-2 pr-[0.24em] align-bottom">
              <motion.span
                className={`inline-block ${index === words.length - 1 ? "gold-text italic" : ""}`}
                initial={reduce ? false : { y: "110%", rotate: 3 }}
                animate={{ y: 0, rotate: 0 }}
                transition={{ duration: 0.85, delay: 0.18 + index * 0.09, ease: [0.22, 1, 0.36, 1] }}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-6 max-w-xl text-base leading-relaxed text-cream/70 sm:text-lg"
        >
          {settings.heroSubtitle}
        </motion.p>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.72 }}
          className="mt-9 flex flex-wrap items-center gap-3 sm:gap-4"
        >
          <Link
            href={settings.heroPrimaryCtaHref || "/register"}
            className="group inline-flex h-12 items-center gap-2.5 rounded-full bg-gold-400 px-7 text-sm font-bold text-ink-950 shadow-[0_16px_40px_-14px_rgba(238,196,106,0.8)] transition hover:bg-gold-300 sm:h-13 sm:px-8"
          >
            {settings.heroPrimaryCtaText}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <Link
            href={settings.heroSecondaryCtaHref || "/events"}
            className="inline-flex h-12 items-center gap-2.5 rounded-full border border-white/25 bg-white/[0.04] px-7 text-sm font-semibold text-cream backdrop-blur-sm transition hover:border-gold-400/60 hover:bg-gold-400/10 sm:h-13 sm:px-8"
          >
            <CalendarDays className="h-4 w-4 text-gold-300" />
            {settings.heroSecondaryCtaText}
          </Link>
        </motion.div>

        <motion.div
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.95 }}
          className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 text-[0.68rem] uppercase tracking-[0.18em] text-cream/40 sm:mt-16"
        >
          <span className="inline-flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-gold-400" />
            Est. 2019
          </span>
          <span className="hidden h-3 w-px bg-white/15 sm:block" />
          <span>{settings.stats[0]?.value ?? 180}+ active members</span>
          <span className="hidden h-3 w-px bg-white/15 sm:block" />
          <span>Rangpur, Bangladesh</span>
        </motion.div>
      </motion.div>

      <motion.a
        href="#about"
        aria-label="Scroll to explore"
        className="absolute inset-x-0 bottom-6 mx-auto hidden w-fit items-center gap-2 text-[0.62rem] uppercase tracking-[0.22em] text-cream/40 transition hover:text-gold-300 sm:flex"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
      >
        Scroll to explore
        <span className="flex h-9 w-5 items-start justify-center rounded-full border border-white/20 p-1">
          <motion.span
            className="h-1.5 w-1 rounded-full bg-gold-400"
            animate={reduce ? undefined : { y: [0, 12, 0], opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
        <ArrowDown className="h-3 w-3" />
      </motion.a>
    </section>
  );
}
