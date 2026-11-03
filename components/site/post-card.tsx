import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate, readingTime } from "@/lib/utils";
import type { PostDTO } from "@/lib/types";
import { PostPlaceholder } from "./placeholders";

export function PostCard({ post, priority = false }: { post: PostDTO; priority?: boolean }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02] transition duration-500 hover:-translate-y-1 hover:border-gold-400/30 hover:shadow-card">
      <Link href={`/posts/${post.slug}`} className="relative block aspect-[16/10] overflow-hidden" aria-label={post.title}>
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt=""
            fill
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition duration-700 group-hover:scale-105"
          />
        ) : (
          <PostPlaceholder title={post.title} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/75 via-transparent to-transparent" />
        <div className="absolute left-4 top-4">
          <Badge>{post.category}</Badge>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex items-center gap-3 text-[0.68rem] uppercase tracking-[0.14em] text-cream/40">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5" />
            {formatDate(post.publishedAt ?? post.createdAt)}
          </span>
          <span className="h-1 w-1 rounded-full bg-cream/25" />
          <span>{readingTime(post.content)} min read</span>
        </div>
        <h3 className="font-display text-xl font-semibold leading-snug text-cream transition group-hover:text-gold-200">
          <Link href={`/posts/${post.slug}`}>{post.title}</Link>
        </h3>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-cream/55">
          {post.excerpt || post.content.replace(/<[^>]*>/g, "").slice(0, 150)}
        </p>
        <div className="mt-6 flex items-center justify-between border-t border-white/[0.06] pt-4">
          <span className="text-[0.68rem] uppercase tracking-[0.14em] text-cream/35">{post.authorName}</span>
          <Link
            href={`/posts/${post.slug}`}
            className="inline-flex items-center gap-1 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-gold-300 transition hover:text-gold-200"
          >
            Read <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
