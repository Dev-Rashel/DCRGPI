"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { toast } from "sonner";
import { ArrowLeft, ExternalLink, Eye, Sparkles } from "lucide-react";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ImageUpload } from "@/components/admin/image-upload";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { Field, FormError, FormGrid, FormSection, SaveBar } from "@/components/admin/form";
import { postSchema } from "@/lib/validation";
import { POST_CATEGORIES } from "@/lib/constants";
import { slugify } from "@/lib/utils";
import { apiRequest, fromApiError, toDateTimeLocal } from "@/lib/admin-utils";
import type { PostDTO } from "@/lib/types";

type FormValues = z.infer<typeof postSchema>;

const EMPTY: FormValues = {
  title: "",
  slug: "",
  category: "Club News",
  coverImage: "",
  excerpt: "",
  content: "",
  authorName: "Club Media Desk",
  status: "draft",
  isFeatured: false,
  publishedAt: "",
};

export function PostForm({ post, demo = false }: { post?: PostDTO; demo?: boolean }) {
  const router = useRouter();
  const [serverError, setServerError] = React.useState<string | null>(null);
  const slugEdited = React.useRef(Boolean(post));

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: post
      ? {
          title: post.title,
          slug: post.slug,
          category: (POST_CATEGORIES as readonly string[]).includes(post.category)
            ? (post.category as FormValues["category"])
            : "Club News",
          coverImage: post.coverImage,
          excerpt: post.excerpt,
          content: post.content,
          authorName: post.authorName,
          status: post.status,
          isFeatured: post.isFeatured,
          publishedAt: toDateTimeLocal(post.publishedAt),
        }
      : EMPTY,
  });

  const title = watch("title");
  const content = watch("content");
  const coverImage = watch("coverImage");
  const status = watch("status");
  const isFeatured = watch("isFeatured");

  React.useEffect(() => {
    if (slugEdited.current) return;
    if (title) setValue("slug", slugify(title));
  }, [title, setValue]);

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    const payload = {
      ...values,
      publishedAt: values.status === "published" ? values.publishedAt || new Date().toISOString() : values.publishedAt || null,
    };

    try {
      const { ok, payload: result } = await apiRequest(post ? `/api/posts/${post.id}` : "/api/posts", {
        method: post ? "PATCH" : "POST",
        body: JSON.stringify(payload),
      });
      if (!ok) {
        setServerError(fromApiError(result));
        return;
      }
      toast.success(post ? "Post updated" : "Post created");
      router.push("/admin/posts");
      router.refresh();
    } catch {
      setServerError("Network error. Please check your connection and try again.");
    }
  };

  const submitLabel = status === "published" ? "Save & publish" : "Save draft";

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/admin/posts"
          className="inline-flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-cream/40 transition hover:text-gold-300"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to posts
        </Link>
        {post && (
          <div className="flex items-center gap-2">
            <Link
              href={`/admin/posts/${post.id}/preview`}
              className="inline-flex h-9 items-center gap-2 rounded-full border border-white/15 px-4 text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-cream/65 transition hover:border-gold-400/40 hover:text-gold-200"
            >
              <Eye className="h-3.5 w-3.5" /> Preview
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
        )}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.65fr_1fr]">
        <div className="space-y-5">
          <FormSection title="Story" description="The headline, summary and full article body.">
            <div className="space-y-4">
              <Field label="Title" htmlFor="title" error={errors.title?.message} required>
                <Input id="title" placeholder="e.g. RPI Debaters Reach the Semi-Finals" {...register("title")} />
              </Field>

              <Field
                label="Slug"
                htmlFor="slug"
                error={errors.slug?.message}
                hint="Used in the public URL: /posts/your-slug"
                required
              >
                <div className="flex gap-2">
                  <Input id="slug" placeholder="rpi-debaters-semi-finals" {...register("slug", { onChange: () => (slugEdited.current = true) })} />
                  <button
                    type="button"
                    className="shrink-0 rounded-lg border border-white/10 px-3 text-[0.62rem] font-semibold uppercase tracking-[0.08em] text-cream/50 transition hover:border-gold-400/40 hover:text-gold-200"
                    onClick={() => {
                      slugEdited.current = false;
                      setValue("slug", slugify(title), { shouldValidate: true });
                    }}
                  >
                    Generate
                  </button>
                </div>
              </Field>

              <Field
                label="Excerpt"
                htmlFor="excerpt"
                error={errors.excerpt?.message}
                hint="A short summary shown on cards and in search results. Leave blank to auto-generate."
              >
                <Textarea id="excerpt" rows={3} placeholder="One or two sentences that capture the story." {...register("excerpt")} />
              </Field>

              <Field label="Article content" error={errors.content?.message} required>
                <RichTextEditor value={content} onChange={(html) => setValue("content", html, { shouldValidate: true })} />
              </Field>
            </div>
          </FormSection>

          <FormSection title="Cover image" description="Upload a landscape image (recommended 1600×900).">
            <ImageUpload
              value={coverImage}
              onChange={(url) => setValue("coverImage", url, { shouldValidate: true })}
              folder="posts"
            />
            {errors.coverImage?.message && <p className="mt-2 text-[0.7rem] text-red-300">{errors.coverImage.message}</p>}
          </FormSection>
        </div>

        <div className="space-y-5">
          <FormSection title="Publishing">
            <div className="space-y-4">
              <Field label="Status" htmlFor="status">
                <Select id="status" {...register("status")}>
                  <option value="draft">Draft — hidden from the public site</option>
                  <option value="published">Published — live on the website</option>
                </Select>
              </Field>

              <Field label="Category" htmlFor="category" error={errors.category?.message}>
                <Select id="category" {...register("category")}>
                  {POST_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field label="Publish date" htmlFor="publishedAt" hint="Leave blank to publish immediately.">
                <Input id="publishedAt" type="datetime-local" {...register("publishedAt")} />
              </Field>

              <div className="flex items-center justify-between gap-4 rounded-lg border border-white/[0.07] bg-white/[0.02] px-3.5 py-3">
                <div>
                  <p className="text-sm font-medium text-cream/85">Featured story</p>
                  <p className="text-[0.65rem] text-cream/35">Show this post in the homepage spotlight.</p>
                </div>
                <Switch checked={isFeatured} onCheckedChange={(checked) => setValue("isFeatured", checked)} label="Featured story" />
              </div>

              <Field label="Author" htmlFor="authorName" error={errors.authorName?.message}>
                <Input id="authorName" placeholder="Club Media Desk" {...register("authorName")} />
              </Field>
            </div>
          </FormSection>

          <FormSection title="SEO & sharing">
            <div className="space-y-2 text-xs leading-relaxed text-cream/45">
              <p className="flex items-center gap-2 text-cream/65">
                <Sparkles className="h-3.5 w-3.5 text-gold-400" /> Preview
              </p>
              <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-3">
                <p className="truncate text-[0.65rem] text-emerald-300/70">
                  dcrpi.vercel.app/posts/{watch("slug") || "your-slug"}
                </p>
                <p className="mt-1 line-clamp-2 font-display text-sm text-cream/80">
                  {title || "Your post title appears here"}
                </p>
                <p className="mt-1 line-clamp-2 text-[0.68rem] text-cream/35">
                  {watch("excerpt") || "Your excerpt appears here as the meta description."}
                </p>
              </div>
            </div>
          </FormSection>
        </div>
      </div>

      <FormError message={serverError} />
      <SaveBar
        cancelHref="/admin/posts"
        submitLabel={submitLabel}
        isSubmitting={isSubmitting}
        disabled={demo}
        note="Publishing makes the post publicly available immediately. Drafts remain private."
      />
    </form>
  );
}
