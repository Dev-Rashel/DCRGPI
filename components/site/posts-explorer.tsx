"use client";

import * as React from "react";
import Link from "next/link";
import { Filter, Search, SlidersHorizontal, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PostCard } from "@/components/site/post-card";
import { POST_CATEGORIES } from "@/lib/constants";
import type { PostDTO } from "@/lib/types";

const PAGE_SIZE = 9;

export function PostsExplorer({ posts }: { posts: PostDTO[] }) {
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState("All");
  const [sort, setSort] = React.useState<"newest" | "oldest">("newest");
  const [page, setPage] = React.useState(1);
  const [filtersOpen, setFiltersOpen] = React.useState(false);

  const filtered = React.useMemo(() => {
    let items = [...posts];
    if (category !== "All") items = items.filter((post) => post.category === category);
    if (query.trim()) {
      const needle = query.trim().toLowerCase();
      items = items.filter(
        (post) =>
          post.title.toLowerCase().includes(needle) ||
          post.excerpt.toLowerCase().includes(needle) ||
          post.content.replace(/<[^>]*>/g, " ").toLowerCase().includes(needle)
      );
    }
    items.sort((a, b) => {
      const aTime = new Date(a.publishedAt ?? a.createdAt).getTime();
      const bTime = new Date(b.publishedAt ?? b.createdAt).getTime();
      return sort === "newest" ? bTime - aTime : aTime - bTime;
    });
    return items;
  }, [posts, category, query, sort]);

  React.useEffect(() => {
    setPage(1);
  }, [query, category, sort]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const activeFilters = (category !== "All" ? 1 : 0) + (query ? 1 : 0);

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-cream/35" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search stories, announcements, ideas…"
              aria-label="Search posts"
              className="input-base h-11 pl-10"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-cream/40 hover:text-cream"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFiltersOpen((value) => !value)}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-white/12 px-4 text-xs font-semibold uppercase tracking-[0.1em] text-cream/70 transition hover:border-gold-400/40 hover:text-cream lg:hidden"
              aria-expanded={filtersOpen}
            >
              <SlidersHorizontal className="h-4 w-4" /> Filters
              {activeFilters > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-gold-400 px-1 text-[0.6rem] text-ink-950">
                  {activeFilters}
                </span>
              )}
            </button>
            <div className="relative hidden sm:block">
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as "newest" | "oldest")}
                aria-label="Sort posts"
                className="input-base h-11 w-40 appearance-none pr-8 text-xs"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
              </select>
            </div>
          </div>
        </div>

        <div className={`${filtersOpen ? "block" : "hidden"} lg:block`}>
          <div className="flex flex-wrap items-center gap-2 border-t border-white/[0.06] pt-4">
            <span className="mr-1 inline-flex items-center gap-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-cream/35">
              <Filter className="h-3.5 w-3.5" /> Category
            </span>
            {["All", ...POST_CATEGORIES].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={`rounded-full border px-3.5 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.08em] transition ${
                  category === item
                    ? "border-gold-400/60 bg-gold-400/15 text-gold-200"
                    : "border-white/10 bg-transparent text-cream/50 hover:border-white/25 hover:text-cream/85"
                }`}
                aria-pressed={category === item}
              >
                {item}
              </button>
            ))}
            <div className="ml-auto sm:hidden">
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as "newest" | "oldest")}
                aria-label="Sort posts"
                className="input-base h-9 w-36 text-xs"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between gap-4">
        <p className="text-xs uppercase tracking-[0.14em] text-cream/40">
          {filtered.length} {filtered.length === 1 ? "story" : "stories"}
          {category !== "All" && <span className="text-gold-300"> · {category}</span>}
        </p>
        {page > 1 && (
          <p className="text-xs uppercase tracking-[0.14em] text-cream/40">
            Page {page} of {pages}
          </p>
        )}
      </div>

      {visible.length ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-white/10 py-20 text-center">
          <p className="font-display text-2xl text-cream/80">No stories match your search</p>
          <p className="mt-2 text-sm text-cream/45">Try a different keyword or category.</p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setCategory("All");
            }}
            className="mt-6 rounded-full border border-white/15 px-5 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-cream transition hover:border-gold-400/50"
          >
            Reset filters
          </button>
        </div>
      )}

      {pages > 1 && (
        <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            disabled={page === 1}
            onClick={() => setPage((value) => Math.max(1, value - 1))}
            className="rounded-full border border-white/12 px-4 py-2 text-xs font-semibold text-cream/70 transition hover:border-gold-400/40 disabled:opacity-30"
          >
            Previous
          </button>
          {Array.from({ length: pages }).map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setPage(index + 1)}
              className={`h-9 w-9 rounded-full text-xs font-semibold transition ${
                page === index + 1
                  ? "bg-gold-400 text-ink-950"
                  : "border border-white/12 text-cream/60 hover:border-gold-400/40 hover:text-cream"
              }`}
              aria-current={page === index + 1 ? "page" : undefined}
            >
              {index + 1}
            </button>
          ))}
          <button
            type="button"
            disabled={page === pages}
            onClick={() => setPage((value) => Math.min(pages, value + 1))}
            className="rounded-full border border-white/12 px-4 py-2 text-xs font-semibold text-cream/70 transition hover:border-gold-400/40 disabled:opacity-30"
          >
            Next
          </button>
        </div>
      )}

      {!posts.length && (
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-gold-400/20 bg-gold-400/[0.05] p-5">
          <p className="text-sm text-cream/70">No posts published yet. Check back soon or explore our events.</p>
          <Link href="/events" className="text-xs font-semibold uppercase tracking-[0.14em] text-gold-300">
            View events
          </Link>
        </div>
      )}
    </div>
  );
}
