import { cn } from "@/lib/utils";

/** Decorative fallback used whenever an administrator has not uploaded artwork. */
export function PostPlaceholder({ title, className }: { title: string; className?: string }) {
  const letters = title
    .split(" ")
    .filter((word) => word.length > 3)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");
  return (
    <div
      className={cn(
        "relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br from-ink-700 via-ink-800 to-ink-950",
        className
      )}
      aria-hidden
    >
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full border border-gold-400/15" />
      <div className="absolute -bottom-10 -left-6 h-36 w-36 rounded-full border border-white/[0.05]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(238,196,106,0.14),transparent_55%)]" />
      <span className="font-display text-5xl font-semibold tracking-tight text-gold-400/35">{letters || "DCRGPI"}</span>
    </div>
  );
}

export function GalleryPlaceholder({ caption, className }: { caption?: string; className?: string }) {
  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center bg-gradient-to-br from-ink-700 to-ink-950 px-4 text-center",
        className
      )}
      aria-hidden
    >
      <span className="font-display text-lg text-gold-400/30">{caption || "DCRGPI"}</span>
    </div>
  );
}
