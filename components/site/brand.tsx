import Image from "next/image";
import { Linkedin, Youtube } from "lucide-react";
import type { SiteSettings } from "@/lib/types";

export function Logo({ settings, size = "md" }: { settings: SiteSettings; size?: "sm" | "md" | "lg" }) {
  const dimensions = size === "lg" ? "h-14 w-14" : size === "sm" ? "h-9 w-9" : "h-11 w-11";
  return (
    <span
      className={`relative flex ${dimensions} shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gold-400/30 ${
        settings.logo ? "bg-white" : "bg-ink-800"
      }`}
    >
      {settings.logo ? (
        <Image
          src={settings.logo}
          alt="DCRGPI logo"
          fill
          sizes="56px"
          className="object-contain p-0.5"
          unoptimized={settings.logo.endsWith(".svg")}
        />
      ) : (
        <span className="font-display text-lg font-bold tracking-tight text-gold-300">DC</span>
      )}
    </span>
  );
}

export function SocialIcon({ platform }: { platform: string }) {
  const key = platform.toLowerCase();
  if (key.includes("facebook")) return <FacebookIcon />;
  if (key.includes("linkedin")) return <Linkedin className="h-4 w-4" />;
  if (key.includes("youtube")) return <Youtube className="h-4 w-4" />;
  if (key.includes("instagram")) return <InstagramIcon />;
  if (key === "x" || key.includes("twitter")) return <XIcon />;
  return <span className="text-[0.6rem] font-bold uppercase">{platform.slice(0, 2)}</span>;
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden>
      <path d="M13.5 21v-7h2.4l.4-3h-2.8V9.2c0-.9.3-1.5 1.6-1.5h1.3V5.1c-.2 0-1-.1-1.9-.1-1.9 0-3.3 1.2-3.3 3.4V11H8.7v3h2.5v7h2.3Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="3.6" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5" aria-hidden>
      <path d="M18.2 3h3.3l-7.2 8.2L22.7 21h-6.5l-5.1-6.6L5.3 21H2l7.7-8.8L1.7 3h6.7l4.6 6.1L18.2 3Zm-1.2 16h1.8L7.1 4.8H5.2L17 19Z" />
    </svg>
  );
}
