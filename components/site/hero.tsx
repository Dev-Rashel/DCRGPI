"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowRight, CalendarDays, Sparkles, Users } from "lucide-react";
import type { SiteSettings } from "@/lib/types";

export function Hero({ settings }: { settings: SiteSettings }) {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const contentY = useTransform(scrollY, [0, 600], [0, reduce ? 0 : 45]);
  const opacity = useTransform(scrollY, [0, 500], [1, reduce ? 1 : 0.35]);

  const words = settings.heroTitle.split(" ");
  const overlay = Math.min(95, Math.max(0, settings.heroOverlay)) / 100;

  return (
    <section className="relative flex min-h-[94svh] items-center overflow-hidden bg-ink-950 pb-20 pt-28 sm:min-h-screen sm:pb-24 sm:pt-32">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(238,196,106,0.12),transparent_48%),radial-gradient(circle_at_86%_80%,rgba(59,130,246,0.1),transparent_46%)]" />
        <div className="absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-gold-400/[0.05] blur-3xl" />
        <div className="absolute -right-20 top-10 h-80 w-80 rounded-full bg-blue-500/[0.05] blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-400/30 to-transparent" />
      </div>

      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
        <motion.div
          className="absolute left-[8%] top-[24%] h-40 w-40 rounded-full border border-gold-400/15"
          animate={reduce ? undefined : { y: [0, -18, 0], rotate: [0, 8, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[16%] right-[6%] h-24 w-24 rounded-full border border-white/10"
          animate={reduce ? undefined : { y: [0, 22, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute left-[12%] top-[30%] h-1.5 w-1.5 rounded-full bg-gold-300"
          animate={reduce ? undefined : { opacity: [0.2, 1, 0.2], scale: [1, 1.8, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-[28%] right-[32%] h-1 w-1 rounded-full bg-cream/60"
          animate={reduce ? undefined : { opacity: [0.1, 0.8, 0.1] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1.4 }}
        />
      </div>

      <motion.div className="container-narrow relative" style={{ y: contentY, opacity }}>
        <div className="grid items-center gap-12 lg:grid-cols-[1.04fr_0.96fr] lg:gap-16">
          <div>
            <motion.p
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="eyebrow mb-6 sm:mb-8"
            >
              {settings.heroEyebrow}
            </motion.p>

            <h1 className="max-w-3xl text-display-lg font-semibold text-cream">
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
          </div>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto w-full max-w-md lg:max-w-none"
          >
            <div
              className="pointer-events-none absolute -inset-3 rounded-[2rem] border border-gold-400/20 bg-gold-400/[0.03]"
              aria-hidden
            />
            <div className="relative aspect-[4/3] max-h-[420px] overflow-hidden rounded-[1.6rem] border border-white/10 bg-ink-800 shadow-card">
              {settings.heroImage ? (
                <Image
                  src={settings.heroImage}
                  alt="DCRGPI members"
                  fill
                  priority
                  sizes="(max-width: 1024px) 90vw, 44vw"
                  className="object-cover"
                  style={{ objectPosition: settings.heroImagePosition }}
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-ink-700 via-ink-800 to-ink-950 px-8 text-center">
                  <Users className="h-10 w-10 text-gold-400/60" />
                  <p className="text-sm leading-relaxed text-cream/50">
                    Add a group photo from the admin settings panel.
                  </p>
                </div>
              )}
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(to top, rgba(5,7,13,${Math.min(
                    0.95,
                    overlay + 0.2
                  )}) 4%, rgba(5,7,13,${overlay * 0.45}) 45%, rgba(5,7,13,${overlay * 0.1}) 100%)`,
                }}
              />
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                <p className="eyebrow mb-2 text-gold-300">Our debaters</p>
                <p className="font-display text-xl font-semibold text-cream">DCRGPI</p>
                <p className="mt-1 text-xs text-cream/60">Rangpur Government Polytechnic Institute</p>
              </div>
            </div>
            <div className="absolute -right-3 -top-3 flex items-center gap-2 rounded-full border border-gold-400/30 bg-ink-950/90 px-4 py-2 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-gold-300 shadow-card backdrop-blur sm:-right-5 sm:-top-5">
              <Sparkles className="h-3.5 w-3.5" />
              DCRGPI Debaters
            </div>
          </motion.div>
        </div>
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
