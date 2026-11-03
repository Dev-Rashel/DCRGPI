"use client";

import * as React from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Images, X, ZoomIn } from "lucide-react";
import type { GalleryItemDTO } from "@/lib/types";
import { GalleryPlaceholder } from "./placeholders";

export function GalleryExplorer({ items }: { items: GalleryItemDTO[] }) {
  const [album, setAlbum] = React.useState("All");
  const [active, setActive] = React.useState<number | null>(null);
  const [mounted, setMounted] = React.useState(false);
  const reduce = useReducedMotion();

  React.useEffect(() => setMounted(true), []);

  const albums = React.useMemo(
    () => ["All", ...Array.from(new Set(items.map((item) => item.album).filter(Boolean)))],
    [items]
  );

  const filtered = React.useMemo(
    () => (album === "All" ? items : items.filter((item) => item.album === album)),
    [items, album]
  );

  const close = React.useCallback(() => setActive(null), []);
  const next = React.useCallback(
    () => setActive((value) => (value === null ? null : (value + 1) % filtered.length)),
    [filtered.length]
  );
  const prev = React.useCallback(
    () => setActive((value) => (value === null ? null : (value - 1 + filtered.length) % filtered.length)),
    [filtered.length]
  );

  React.useEffect(() => {
    if (active === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") next();
      if (event.key === "ArrowLeft") prev();
    };
    document.addEventListener("keydown", onKey);
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = original;
    };
  }, [active, close, next, prev]);

  const current = active !== null ? filtered[active] : null;

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center gap-2">
        {albums.map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => {
              setAlbum(name);
              setActive(null);
            }}
            className={`rounded-full border px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.1em] transition ${
              album === name
                ? "border-gold-400/60 bg-gold-400/15 text-gold-200"
                : "border-white/10 text-cream/50 hover:border-white/25 hover:text-cream/85"
            }`}
            aria-pressed={album === name}
          >
            {name}
            <span className="ml-2 text-[0.6rem] opacity-50">
              {name === "All" ? items.length : items.filter((item) => item.album === name).length}
            </span>
          </button>
        ))}
      </div>

      {filtered.length ? (
        <div className="columns-2 gap-3 sm:columns-3 lg:columns-4 [&>*]:mb-3">
          {filtered.map((item, index) => (
            <motion.button
              key={item.id}
              type="button"
              onClick={() => setActive(index)}
              className="group relative block w-full overflow-hidden rounded-xl border border-white/[0.07] text-left focus-visible:ring-2 focus-visible:ring-gold-400"
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.45, delay: (index % 4) * 0.04 }}
              aria-label={`Open image: ${item.caption || item.album}`}
            >
              <div className={`relative w-full ${index % 7 === 0 ? "aspect-[3/4]" : index % 5 === 0 ? "aspect-square" : "aspect-[4/3]"}`}>
                <Image
                  src={item.imageUrl}
                  alt={item.caption || `Photo from ${item.album}`}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-transparent to-transparent opacity-60 transition group-hover:opacity-90" />
                <div className="absolute inset-x-0 bottom-0 translate-y-1 p-3.5 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <p className="text-[0.58rem] uppercase tracking-[0.16em] text-gold-300">{item.album}</p>
                  {item.caption && <p className="mt-1 line-clamp-2 text-xs text-cream/85">{item.caption}</p>}
                </div>
                <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-ink-950/70 text-cream/80 opacity-0 backdrop-blur transition group-hover:opacity-100">
                  <ZoomIn className="h-3.5 w-3.5" />
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-white/10 py-20 text-center">
          <Images className="mx-auto h-8 w-8 text-gold-400/50" />
          <p className="mt-4 font-display text-2xl text-cream/80">No photos in this album yet</p>
          <p className="mt-2 text-sm text-cream/45">New moments are added after every event.</p>
        </div>
      )}

      {mounted &&
        createPortal(
          <AnimatePresence>
            {current && (
              <motion.div
                className="fixed inset-0 z-[120] flex flex-col bg-ink-950/96 backdrop-blur-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                role="dialog"
                aria-modal="true"
                aria-label="Image viewer"
              >
                <div className="flex items-center justify-between px-5 py-4 sm:px-8">
                  <p className="text-[0.65rem] uppercase tracking-[0.18em] text-cream/50">
                    {active !== null ? `${active + 1} / ${filtered.length}` : ""} · {current.album}
                  </p>
                  <button
                    type="button"
                    onClick={close}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-cream transition hover:bg-white/10"
                    aria-label="Close image viewer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="relative flex flex-1 items-center justify-center px-4 pb-4 sm:px-16">
                  <button
                    type="button"
                    onClick={prev}
                    aria-label="Previous image"
                    className="absolute left-2 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-ink-900/70 text-cream backdrop-blur transition hover:border-gold-400/50 sm:left-5"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <motion.div
                    key={current.id}
                    initial={reduce ? false : { opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.25 }}
                    className="relative max-h-full w-full max-w-5xl"
                  >
                    <div className="relative mx-auto max-h-[72vh] w-fit">
                      <Image
                        src={current.imageUrl}
                        alt={current.caption || "Gallery image"}
                        width={1400}
                        height={1000}
                        className="max-h-[72vh] w-auto rounded-xl object-contain"
                      />
                    </div>
                    {current.caption && (
                      <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-cream/70">{current.caption}</p>
                    )}
                  </motion.div>
                  <button
                    type="button"
                    onClick={next}
                    aria-label="Next image"
                    className="absolute right-2 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-ink-900/70 text-cream backdrop-blur transition hover:border-gold-400/50 sm:right-5"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}
