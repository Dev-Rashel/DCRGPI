import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Clock, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PostCard } from "@/components/site/post-card";
import { ShareLinks } from "@/components/site/share-links";
import { Reveal } from "@/components/site/reveal";
import { getPostBySlug, getRelatedPosts, getSettings } from "@/lib/data";
import { sanitizeRichText } from "@/lib/sanitize";
import { absoluteUrl, formatDate, readingTime } from "@/lib/utils";
import { PostPlaceholder } from "@/components/site/placeholders";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post not found" };

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/posts/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: absoluteUrl(`/posts/${post.slug}`),
      publishedTime: post.publishedAt ?? undefined,
      authors: [post.authorName],
      images: post.coverImage ? [{ url: post.coverImage, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

export default async function PostDetailPage({ params }: Params) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const [related, settings] = await Promise.all([getRelatedPosts(post.slug, post.category), getSettings()]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: post.title,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: { "@type": "Organization", name: post.authorName },
    publisher: { "@type": "Organization", name: "DCRGPI" },
    image: post.coverImage || undefined,
    description: post.excerpt,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <article>
        <header className="relative overflow-hidden pb-10 pt-28 sm:pb-14 sm:pt-32">
          <div className="absolute inset-0">
            {post.coverImage ? (
              <Image src={post.coverImage} alt="" fill priority sizes="100vw" className="object-cover opacity-45" />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-ink-700 to-ink-950" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/85 to-ink-950/60" />
          </div>
          <div className="container-narrow relative">
            <Link
              href="/posts"
              className="mb-8 inline-flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-cream/50 transition hover:text-gold-300"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> All posts
            </Link>
            <div className="flex flex-wrap items-center gap-3">
              <Badge>{post.category}</Badge>
              {post.isFeatured && <Badge variant="muted">Featured</Badge>}
            </div>
            <h1 className="mt-5 max-w-4xl text-display-lg font-semibold text-cream">{post.title}</h1>
            {post.excerpt && <p className="mt-5 max-w-2xl text-base leading-relaxed text-cream/60">{post.excerpt}</p>}
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-[0.7rem] uppercase tracking-[0.14em] text-cream/45">
              <span className="inline-flex items-center gap-2">
                <User className="h-3.5 w-3.5 text-gold-400" /> {post.authorName}
              </span>
              <span className="inline-flex items-center gap-2">
                <CalendarDays className="h-3.5 w-3.5 text-gold-400" />
                <time dateTime={post.publishedAt ?? undefined}>{formatDate(post.publishedAt ?? post.createdAt)}</time>
              </span>
              <span className="inline-flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-gold-400" /> {readingTime(post.content)} min read
              </span>
            </div>
          </div>
        </header>

        <div className="container-narrow pb-20">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div>
              <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-2xl border border-white/10">
                {post.coverImage ? (
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 70vw"
                    className="object-cover"
                  />
                ) : (
                  <PostPlaceholder title={post.title} />
                )}
              </div>
              <div
                className="prose-editorial max-w-none"
                dangerouslySetInnerHTML={{ __html: sanitizeRichText(post.content) }}
              />
              <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.08] pt-6">
                <ShareLinks title={post.title} path={`/posts/${post.slug}`} />
                <Link
                  href="/posts"
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-cream/50 transition hover:text-gold-300"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Back to all posts
                </Link>
              </div>
            </div>

            <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
              <div className="surface p-6">
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-gold-300">Written by</p>
                <p className="mt-3 font-display text-xl text-cream">{post.authorName}</p>
                <p className="mt-2 text-sm leading-relaxed text-cream/50">
                  Publishing on behalf of DCRGPI.
                </p>
              </div>
              <div className="surface p-6">
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-gold-300">Club</p>
                <p className="mt-3 text-sm leading-relaxed text-cream/60">{settings.footerTagline}</p>
                <Link href="/about" className="mt-4 inline-block text-xs font-semibold uppercase tracking-[0.14em] text-gold-300">
                  About the club
                </Link>
              </div>
              <div className="surface p-6">
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-gold-300">Join us</p>
                <p className="mt-3 text-sm leading-relaxed text-cream/60">
                  Applications are open to every RGPI student, from every department.
                </p>
                <Link
                  href="/register"
                  className="mt-4 inline-flex h-10 items-center justify-center rounded-full bg-gold-400 px-5 text-xs font-bold text-ink-950 transition hover:bg-gold-300"
                >
                  Apply for membership
                </Link>
              </div>
            </aside>
          </div>

          {related.length > 0 && (
            <section className="mt-20 border-t border-white/[0.08] pt-12">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="eyebrow mb-3">Keep reading</p>
                  <h2 className="font-display text-3xl font-semibold text-cream">Related stories</h2>
                </div>
                <Link href="/posts" className="text-xs font-semibold uppercase tracking-[0.14em] text-gold-300">
                  View all
                </Link>
              </div>
              <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((item, index) => (
                  <Reveal key={item.id} delay={index * 0.05}>
                    <PostCard post={item} />
                  </Reveal>
                ))}
              </div>
            </section>
          )}
        </div>
      </article>
    </>
  );
}
