import type { MetadataRoute } from "next";
import { getEvents, getPosts } from "@/lib/data";
import { absoluteUrl } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, events] = await Promise.all([
    getPosts({ limit: 500 }),
    getEvents({ limit: 500 }),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/about"), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/posts"), changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/events"), changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/team"), changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/gallery"), changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/register"), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/contact"), changeFrequency: "yearly", priority: 0.5 },
  ];

  const postRoutes: MetadataRoute.Sitemap = posts.items.map((post) => ({
    url: absoluteUrl(`/posts/${post.slug}`),
    lastModified: post.updatedAt ? new Date(post.updatedAt) : undefined,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const eventRoutes: MetadataRoute.Sitemap = events.items.map((event) => ({
    url: absoluteUrl(`/events/${event.slug}`),
    lastModified: event.updatedAt ? new Date(event.updatedAt) : undefined,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...postRoutes, ...eventRoutes];
}
