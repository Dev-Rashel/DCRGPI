import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import type { SiteSettings } from "@/lib/types";
import { Logo, SocialIcon } from "./brand";

export function Footer({ settings }: { settings: SiteSettings }) {
  const links = [...settings.navItems]
    .filter((item) => item.visible)
    .sort((a, b) => a.order - b.order);

  return (
    <footer className="relative overflow-hidden border-t border-white/[0.08] bg-ink-950">
      <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-gold-400/5 blur-3xl" />
      <div className="container-narrow relative py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_0.8fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-3">
              <Logo settings={settings} />
              <span className="flex flex-col leading-tight">
                <span className="font-display text-lg font-semibold text-cream">
                  DCRGPI
                </span>
                <span className="text-[0.6rem] uppercase tracking-[0.22em] text-cream/45">
                  Debating Club of Rangpur Govt. Polytechnic Institute
                </span>
              </span>
            </Link>
            <p className="mt-6 max-w-sm font-display text-2xl leading-snug text-cream/90">
              {settings.footerTagline}
            </p>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-cream/50">{settings.footerText}</p>
            <div className="mt-7 flex flex-wrap gap-2.5">
              {settings.socialLinks.map((link) => (
                <a
                  key={`${link.platform}-${link.url}`}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.platform}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-cream/60 transition hover:border-gold-400/50 hover:bg-gold-400/10 hover:text-gold-300"
                >
                  <SocialIcon platform={link.platform} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-cream/40">Explore</h2>
            <ul className="mt-5 space-y-3">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1.5 text-sm text-cream/65 transition hover:text-gold-300"
                  >
                    {link.label}
                    <ArrowUpRight className="h-3 w-3 opacity-0 transition group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/register" className="text-sm text-cream/65 transition hover:text-gold-300">
                  Membership Registration
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-cream/40">Get in touch</h2>
            <ul className="mt-5 space-y-4 text-sm text-cream/65">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                <span>{settings.instituteInfo}</span>
              </li>
              <li>
                <a
                  href={`mailto:${settings.contactInfo.email}`}
                  className="flex items-start gap-3 transition hover:text-gold-300"
                >
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                  <span>{settings.contactInfo.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={`tel:${settings.contactInfo.phone.replace(/\s+/g, "")}`}
                  className="flex items-start gap-3 transition hover:text-gold-300"
                >
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                  <span>{settings.contactInfo.phone}</span>
                </a>
              </li>
            </ul>
            <Link
              href="/contact"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-cream transition hover:border-gold-400/50 hover:text-gold-200"
            >
              Send a message <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/[0.07] pt-6 text-xs text-cream/35 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {settings.copyright}
          </p>
          <div className="flex flex-wrap items-center gap-5">
            <Link href="/admin/login" className="transition hover:text-cream/70">
              Admin
            </Link>
            <span className="hidden h-3 w-px bg-white/15 sm:block" />
            <p>{settings.instituteInfo}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
