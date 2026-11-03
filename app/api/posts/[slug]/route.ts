import { handleApiError, ok, fail } from "@/lib/api";
import { getPostBySlug, logActivity } from "@/lib/data";
import { connectDB } from "@/lib/db";
import { Post } from "@/lib/models";
import { adminGuard } from "@/lib/route-helpers";
import { sanitizeRichText } from "@/lib/sanitize";
import { postSchema } from "@/lib/validation";

type Params = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    const { slug } = await params;
    const post = await getPostBySlug(slug);
    if (!post) return fail("Post not found", 404);
    return ok(post);
  } catch (error) {
    return handleApiError(error);
  }
}

/** PATCH and DELETE accept a MongoDB id in the same dynamic segment. */
export async function PATCH(request: Request, { params }: Params) {
  const guard = await adminGuard();
  if (guard.response) return guard.response;

  try {
    const { slug: id } = await params;
    if (!/^[a-f0-9]{24}$/i.test(id)) return fail("Invalid post id", 400);

    const payload = postSchema.partial().parse(await request.json());
    await connectDB();

    const update: Record<string, unknown> = { ...payload };
    if (payload.content) update.content = sanitizeRichText(payload.content);
    if (payload.status === "published") {
      const existing = await Post.findById(id).lean();
      if (!existing) return fail("Post not found", 404);
      update.publishedAt = payload.publishedAt
        ? new Date(payload.publishedAt)
        : existing.publishedAt ?? new Date();
      update.authorName = payload.authorName || existing.authorName;
    }
    if (payload.slug) {
      const conflict = await Post.findOne({ slug: payload.slug, _id: { $ne: id } }).lean();
      if (conflict) return fail("A post with this slug already exists", 409);
    }

    const post = await Post.findByIdAndUpdate(id, { $set: update }, { new: true, runValidators: true });
    if (!post) return fail("Post not found", 404);

    await logActivity({
      action: payload.status ? `Set status to ${payload.status}` : "Updated",
      entity: "Post",
      detail: post.title,
      actor: guard.session.name,
    });
    return ok({ id: String(post._id) });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const guard = await adminGuard();
  if (guard.response) return guard.response;

  try {
    const { slug: id } = await params;
    if (!/^[a-f0-9]{24}$/i.test(id)) return fail("Invalid post id", 400);
    await connectDB();
    const post = await Post.findByIdAndDelete(id);
    if (!post) return fail("Post not found", 404);
    await logActivity({ action: "Deleted", entity: "Post", detail: post.title, actor: guard.session.name });
    return ok({ id });
  } catch (error) {
    return handleApiError(error);
  }
}
