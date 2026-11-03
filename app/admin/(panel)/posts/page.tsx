import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, Newspaper, Plus, Search, Star } from "lucide-react";
import { AdminButton, AdminEmptyState, AdminPageHeader, TableShell } from "@/components/admin/ui";
import { PostActions } from "@/components/admin/post-actions";
import { DemoNotice } from "@/components/admin/form";
import { Badge } from "@/components/ui/badge";
import { Input, Select } from "@/components/ui/input";
import { demoMode, getPosts } from "@/lib/data";
import { POST_CATEGORIES } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import type { PostStatus } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Posts" };

type SearchParams = Promise<{ q?: string; status?: string; category?: string; page?: string }>;

const PAGE_SIZE = 10;

export default async function AdminPostsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const demo = demoMode();
  const q = params.q?.trim() ?? "";
  const status = params.status === "published" || params.status === "draft" ? params.status : "all";
  const category = params.category && POST_CATEGORIES.includes(params.category as never) ? params.category : "";
  const page = Math.max(1, Number(params.page ?? 1) || 1);

  const result = await getPosts({
    includeDrafts: true,
    q: q || undefined,
    category: category || undefined,
    status: status === "all" ? undefined : (status as PostStatus),
    page,
    limit: PAGE_SIZE,
    sort: "newest",
  });

  const hrefFor = (next: { status?: string; page?: number }) => {
    const search = new URLSearchParams();
    if (q) search.set("q", q);
    if (category) search.set("category", category);
    const nextStatus = next.status ?? status;
    if (nextStatus !== "all") search.set("status", nextStatus);
    if (next.page && next.page > 1) search.set("page", String(next.page));
    const query = search.toString();
    return query ? `/admin/posts?${query}` : "/admin/posts";
  };

  return (
    <div>
      <AdminPageHeader
        title="Posts & articles"
        description="Write club news, achievements and debate articles. Drafts stay private until published."
        actions={
          <AdminButton href="/admin/posts/new">
            <Plus className="h-3.5 w-3.5" /> New post
          </AdminButton>
        }
      />

      <div className="mb-4 space-y-3">
        <DemoNotice show={demo} />
        <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { key: "all", label: "All", count: result.total },
              { key: "published", label: "Published" },
              { key: "draft", label: "Drafts" },
            ].map((tab) => (
              <Link
                key={tab.key}
                href={hrefFor({ status: tab.key, page: 1 })}
                className={`rounded-full border px-3.5 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.08em] transition ${
                  status === tab.key
                    ? "border-gold-400/40 bg-gold-400/10 text-gold-200"
                    : "border-white/10 text-cream/45 hover:border-white/25 hover:text-cream/80"
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </div>

          <form action="/admin/posts" method="get" className="flex flex-wrap items-center gap-2">
            {status !== "all" && <input type="hidden" name="status" value={status} />}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-cream/30" />
              <Input
                name="q"
                defaultValue={q}
                placeholder="Search posts…"
                className="h-9 w-52 pl-8 text-xs"
                aria-label="Search posts"
              />
            </div>
            <Select name="category" defaultValue={category} className="h-9 w-40 text-xs" aria-label="Filter by category">
              <option value="">All categories</option>
              {POST_CATEGORIES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Select>
            <button
              type="submit"
              className="h-9 rounded-lg border border-white/10 px-3 text-[0.65rem] font-semibold uppercase tracking-[0.08em] text-cream/60 transition hover:border-gold-400/40 hover:text-gold-200"
            >
              Filter
            </button>
          </form>
        </div>
      </div>

      {result.items.length === 0 ? (
        <AdminEmptyState
          icon={Newspaper}
          title={q || category || status !== "all" ? "No matching posts" : "No posts yet"}
          description={
            q || category || status !== "all"
              ? "Try removing a filter or searching for different keywords."
              : "Start by writing the club's first story."
          }
          action={<AdminButton href="/admin/posts/new">Write a post</AdminButton>}
        />
      ) : (
        <TableShell>
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/[0.07] text-[0.58rem] uppercase tracking-[0.14em] text-cream/30">
                <th className="px-4 py-3 font-semibold">Post</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Published</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {result.items.map((post) => (
                <tr key={post.id} className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02]">
                  <td className="max-w-[380px] px-4 py-3.5">
                    <Link href={`/admin/posts/${post.id}`} className="group flex items-center gap-3">
                      <span className="relative h-10 w-14 shrink-0 overflow-hidden rounded-md border border-white/10 bg-ink-800">
                        {post.coverImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={post.coverImage} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <span className="flex h-full w-full items-center justify-center text-cream/20">
                            <Newspaper className="h-4 w-4" />
                          </span>
                        )}
                      </span>
                      <span className="min-w-0">
                        <span className="flex items-center gap-1.5">
                          <span className="truncate font-medium text-cream/85 group-hover:text-gold-200">{post.title}</span>
                          {post.isFeatured && <Star className="h-3 w-3 shrink-0 fill-gold-400 text-gold-400" />}
                        </span>
                        <span className="mt-0.5 block truncate text-[0.65rem] text-cream/30">/posts/{post.slug}</span>
                      </span>
                    </Link>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-cream/50">{post.category}</td>
                  <td className="px-4 py-3.5">
                    <Badge variant={post.status === "published" ? "success" : "muted"}>{post.status}</Badge>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-cream/40">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays className="h-3 w-3" />
                      {post.publishedAt ? formatDate(post.publishedAt) : "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <PostActions id={post.id} slug={post.slug} status={post.status} demo={demo} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableShell>
      )}

      {result.pages > 1 && (
        <div className="mt-4 flex items-center justify-between gap-4 text-xs text-cream/40">
          <p>
            Page {result.page} of {result.pages} · {result.total} posts
          </p>
          <div className="flex items-center gap-2">
            <Link
              href={hrefFor({ page: result.page - 1 })}
              aria-disabled={result.page <= 1}
              className={`rounded-full border border-white/10 px-3.5 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.08em] transition hover:border-gold-400/40 hover:text-gold-200 ${
                result.page <= 1 ? "pointer-events-none opacity-40" : ""
              }`}
            >
              Previous
            </Link>
            <Link
              href={hrefFor({ page: result.page + 1 })}
              aria-disabled={result.page >= result.pages}
              className={`rounded-full border border-white/10 px-3.5 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.08em] transition hover:border-gold-400/40 hover:text-gold-200 ${
                result.page >= result.pages ? "pointer-events-none opacity-40" : ""
              }`}
            >
              Next
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
