"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Lock, Menu, X } from "lucide-react";
import { Logo } from "./brand";
import { cn } from "@/lib/utils";
import type { SiteSettings } from "@/lib/types";

export function Navbar({ settings }: { settings: SiteSettings }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const links = React.useMemo(
    () => [...settings.navItems].filter((item) => item.visible).sort((a, b) => a.order - b.order),
    [settings.navItems]
  );

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  React.useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "border-b border-white/[0.08] bg-ink-950/85 py-3 backdrop-blur-xl"
          : "border-b border-transparent bg-gradient-to-b from-ink-950/80 to-transparent py-4 lg:py-5"
      )}
    >
      <div className="container-narrow flex items-center justify-between gap-4">
        <Link href="/" className="group flex items-center gap-3" aria-label="Debating Club of RPI — home">
          <Logo settings={settings} />
          <span className="flex flex-col leading-tight">
            <span className="font-display text-[1.02rem] font-semibold tracking-tight text-cream sm:text-[1.12rem]">
              Debating Club <span className="text-gold-400">of RPI</span>
            </span>
            <span className="hidden text-[0.6rem] uppercase tracking-[0.22em] text-cream/45 sm:block">
              Rangpur Govt. Polytechnic Institute
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Primary">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative rounded-full px-3.5 py-2 text-[0.82rem] font-medium transition-colors duration-300",
                isActive(item.href) ? "text-gold-300" : "text-cream/65 hover:text-cream"
              )}
            >
              {item.label}
              {isActive(item.href) && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute inset-x-3 -bottom-0.5 h-px bg-gold-400"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/login"
            className="hidden items-center gap-1.5 rounded-full px-3 py-2 text-[0.72rem] font-medium uppercase tracking-[0.12em] text-cream/40 transition hover:text-cream/80 xl:flex"
          >
            <Lock className="h-3.5 w-3.5" />
            Admin
          </Link>
          <Link
            href="/register"
            className="group hidden items-center gap-2 rounded-full bg-gold-400 px-5 py-2.5 text-[0.8rem] font-bold text-ink-950 shadow-[0_8px_24px_-10px_rgba(238,196,106,0.7)] transition hover:bg-gold-300 sm:inline-flex"
          >
            Join the Club
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-cream transition hover:border-gold-400/50 hover:text-gold-200 lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-x-0 bottom-0 top-[64px] z-40 overflow-y-auto border-t border-white/[0.07] bg-ink-950/97 backdrop-blur-2xl lg:hidden"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <nav className="container-narrow flex flex-col py-6" aria-label="Mobile">
              {[...links, { label: "Registration", href: "/register", visible: true, order: 99 }].map(
                (item, index) => (
                  <motion.div
                    key={item.href}
                    initial={reduce ? false : { opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + index * 0.045, duration: 0.3 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center justify-between border-b border-white/[0.06] py-4 font-display text-2xl transition-colors",
                        isActive(item.href) ? "text-gold-300" : "text-cream/85 hover:text-gold-200"
                      )}
                    >
                      {item.label}
                      <ArrowUpRight className="h-4 w-4 opacity-40" />
                    </Link>
                  </motion.div>
                )
              )}

              <div className="mt-8 flex flex-col gap-3">
                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
                  className="flex h-12 items-center justify-center rounded-full bg-gold-400 text-sm font-bold uppercase tracking-[0.12em] text-ink-950"
                >
                  Join the Club
                </Link>
                <Link
                  href="/admin/login"
                  onClick={() => setOpen(false)}
                  className="flex h-12 items-center justify-center gap-2 rounded-full border border-white/15 text-sm font-semibold text-cream/70"
                >
                  <Lock className="h-4 w-4" /> Admin Login
                </Link>
              </div>

              <p className="mt-10 pb-4 text-center text-xs uppercase tracking-[0.2em] text-cream/30">
                Think Bold · Speak Fearlessly
              </p>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
