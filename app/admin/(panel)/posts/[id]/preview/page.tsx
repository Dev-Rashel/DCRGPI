import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Clock, ExternalLink, Pencil, UserRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getPostById } from "@/lib/data";
import { sanitizeRichText } from "@/lib/sanitize";
import { formatDate, readingTime } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Post preview", robots: { index: false, follow: false } };

export default async function PostPreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getPostById(id);
  if (!post) notFound();

  const html = sanitizeRichText(post.content);

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <Link
          href={`/admin/posts/${post.id}`}
          className="inline-flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-cream/40 transition hover:text-gold-300"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to editor
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/posts/${post.id}`}
            className="inline-flex h-9 items-center gap-2 rounded-full border border-white/15 px-4 text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-cream/65 transition hover:border-gold-400/40 hover:text-gold-200"
          >
            <Pencil className="h-3.5 w-3.5" /> Edit
          </Link>
          {post.status === "published" && (
            <Link
              href={`/posts/${post.slug}`}
              target="_blank"
              className="inline-flex h-9 items-center gap-2 rounded-full border border-white/15 px-4 text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-cream/65 transition hover:border-gold-400/40 hover:text-gold-200"
            >
              Live post <ExternalLink className="h-3 w-3" />
            </Link>
          )}
        </div>
      </div>

      <div className="mb-4 flex items-center gap-2 rounded-lg border border-amber-400/25 bg-amber-400/[0.06] px-4 py-2.5 text-xs text-amber-100/75">
        <span className="font-semibold uppercase tracking-[0.1em]">Preview</span>
        <span className="text-amber-100/40">·</span>
        This is how the post appears to readers. Drafts are not publicly visible.
      </div>

      <article className="surface overflow-hidden">
        {post.coverImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.coverImage} alt="" className="aspect-[21/9] w-full object-cover" />
        )}
        <div className="mx-auto max-w-3xl px-5 py-8 sm:px-8 sm:py-10">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{post.category}</Badge>
            <Badge variant={post.status === "published" ? "success" : "muted"}>{post.status}</Badge>
            {post.isFeatured && <Badge variant="warning">Featured</Badge>}
          </div>
          <h1 className="mt-4 font-display text-3xl font-semibold leading-tight text-cream sm:text-4xl">{post.title}</h1>
          {post.excerpt && <p className="mt-4 text-base leading-relaxed text-cream/55">{post.excerpt}</p>}
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-white/[0.08] py-3 text-[0.68rem] uppercase tracking-[0.1em] text-cream/35">
            <span className="inline-flex items-center gap-1.5">
              <UserRound className="h-3.5 w-3.5" /> {post.authorName}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" /> {post.publishedAt ? formatDate(post.publishedAt) : "Unpublished"}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" /> {readingTime(html)} min read
            </span>
          </div>
          <div className="prose-editorial mt-7" dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </article>
    </div>
  );
}
