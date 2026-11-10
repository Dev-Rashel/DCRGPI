const TAGS = [
  "Think Bold",
  "নির্ভয়ে বলো",
  "Win with reason",
  "প্রতিটি কণ্ঠ গুরুত্বপূর্ণ",
  "Debate teaches thinking",
  "নেতৃত্ব গড়ে ওঠে মঞ্চে",
];

export function TagMarquee() {
  const row = [...TAGS, ...TAGS];

  return (
    <div className="relative overflow-hidden border-b border-white/[0.06] bg-ink-950/50 py-3.5">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-ink-950 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-ink-950 to-transparent" />
      <div className="marquee-track flex w-max items-center gap-8 whitespace-nowrap">
        {row.map((tag, index) => (
          <span
            key={`${tag}-${index}`}
            className="inline-flex items-center gap-8 text-[0.66rem] font-semibold uppercase tracking-[0.22em] text-cream/40"
          >
            {tag}
            <span className="h-1 w-1 rounded-full bg-gold-400/60" aria-hidden />
          </span>
        ))}
      </div>
    </div>
  );
}
