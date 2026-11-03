import { handleApiError, created, ok } from "@/lib/api";
import { logActivity, getPosts } from "@/lib/data";
import { connectDB } from "@/lib/db";
import { Post } from "@/lib/models";
import { adminGuard } from "@/lib/route-helpers";
import { sanitizeRichText } from "@/lib/sanitize";
import { postSchema } from "@/lib/validation";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") ?? 9)));
    const result = await getPosts({
      category: searchParams.get("category") ?? undefined,
      q: searchParams.get("q") ?? undefined,
      sort: searchParams.get("sort") === "oldest" ? "oldest" : "newest",
      page,
      limit,
      featuredOnly: searchParams.get("featured") === "true",
    });
    return ok(result);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  const guard = await adminGuard();
  if (guard.response) return guard.response;

  try {
    const payload = postSchema.parse(await request.json());
    await connectDB();

    const existing = await Post.findOne({ slug: payload.slug }).lean();
    if (existing) {
      return handleApiError(
        Object.assign(new Error("duplicate"), { code: 11000 })
      );
    }

    const status = payload.status;
    const post = await Post.create({
      ...payload,
      content: sanitizeRichText(payload.content),
      authorId: guard.session.id,
      authorName: payload.authorName || guard.session.name,
      publishedAt:
        status === "published"
          ? payload.publishedAt
            ? new Date(payload.publishedAt)
            : new Date()
          : payload.publishedAt
            ? new Date(payload.publishedAt)
            : null,
    });

    await logActivity({
      action: status === "published" ? "Published" : "Created draft",
      entity: "Post",
      detail: payload.title,
      actor: guard.session.name,
    });

    return created({ id: String(post._id), slug: post.slug });
  } catch (error) {
    return handleApiError(error);
  }
}
