import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  description,
  children,
  breadcrumb,
  showCta = true,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  children?: ReactNode;
  breadcrumb?: { label: string; href?: string }[];
  showCta?: boolean;
}) {
  return (
    <section className="relative overflow-hidden border-b border-white/[0.07] pb-16 pt-32 sm:pb-20 sm:pt-36 lg:pb-24 lg:pt-44">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-10 h-80 w-80 rounded-full bg-gold-400/[0.07] blur-3xl" />
        <div className="absolute right-0 top-40 h-64 w-64 rounded-full bg-blue-500/[0.06] blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold-400/30 to-transparent" />
      </div>
      <div className="container-narrow relative">
        {breadcrumb && (
          <nav aria-label="Breadcrumb" className="mb-7 flex flex-wrap items-center gap-2 text-[0.7rem] uppercase tracking-[0.18em] text-cream/40">
            <Link href="/" className="transition hover:text-gold-300">
              Home
            </Link>
            {breadcrumb.map((crumb) => (
              <span key={crumb.label} className="flex items-center gap-2">
                <span className="text-cream/20">/</span>
                {crumb.href ? (
                  <Link href={crumb.href} className="transition hover:text-gold-300">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-cream/70">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        <p className="eyebrow mb-5">{eyebrow}</p>
        <h1 className="max-w-4xl text-display-lg font-semibold text-cream">{title}</h1>
        {description && (
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-cream/60 sm:text-lg">{description}</p>
        )}
        {children && <div className="mt-8">{children}</div>}
        {showCta && (
          <Link
            href="/register"
            className="mt-8 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-gold-300 transition hover:text-gold-200"
          >
            Become a member <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>
    </section>
  );
}
