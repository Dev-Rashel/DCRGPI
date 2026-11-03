"use client";

import * as React from "react";
import { Check, Copy, Facebook, Linkedin, Share2 } from "lucide-react";
import { toast } from "sonner";

export function ShareLinks({ title, path }: { title: string; path: string }) {
  const [copied, setCopied] = React.useState(false);
  const [url, setUrl] = React.useState(path);

  React.useEffect(() => {
    setUrl(`${window.location.origin}${path}`);
  }, [path]);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied to clipboard");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy the link");
    }
  };

  const links = [
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, icon: Facebook },
    { label: "X", href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`, icon: XIcon },
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, icon: Linkedin },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 inline-flex items-center gap-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-cream/40">
        <Share2 className="h-3.5 w-3.5" /> Share
      </span>
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${link.label}`}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-cream/60 transition hover:border-gold-400/50 hover:text-gold-300"
        >
          <link.icon className="h-4 w-4" />
        </a>
      ))}
      <button
        type="button"
        onClick={copy}
        aria-label="Copy link"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-cream/60 transition hover:border-gold-400/50 hover:text-gold-300"
      >
        {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
      </button>
    </div>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M18.2 3h3.3l-7.2 8.2L22.7 21h-6.5l-5.1-6.6L5.3 21H2l7.7-8.8L1.7 3h6.7l4.6 6.1L18.2 3Zm-1.2 16h1.8L7.1 4.8H5.2L17 19Z" />
    </svg>
  );
}
