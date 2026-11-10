import { connectDB, isDbConfigured } from "./db";
import {
  Activity,
  ContactMessage,
  Event,
  EventRegistration,
  GalleryItem,
  Membership,
  Notice,
  Post,
  Settings,
  TeamMember,
} from "./models";
import { DEFAULT_SETTINGS, SAMPLE_EVENTS, SAMPLE_GALLERY, SAMPLE_MEMBERSHIP, SAMPLE_MESSAGES, SAMPLE_NOTICES, SAMPLE_POSTS, SAMPLE_TEAM } from "./sample-data";
import type {
  ActivityItem,
  ContactMessageDTO,
  DashboardStats,
  EventDTO,
  EventPhase,
  GalleryItemDTO,
  MembershipDTO,
  NoticeDTO,
  PostDTO,
  SiteSettings,
  TeamMemberDTO,
} from "./types";
import { DEFAULT_SECTIONS } from "./constants";

const PAGE_SIZE = 9;

export function demoMode() {
  return !isDbConfigured();
}

async function db() {
  return connectDB();
}

function iso(value: unknown): string | null {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(String(value));
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function sortByOrder<T extends { order: number }>(items: T[]) {
  return [...items].sort((a, b) => a.order - b.order);
}

/* -------------------------------------------------------------------------- */
/*                                  Settings                                  */
/* -------------------------------------------------------------------------- */

export async function getSettings(): Promise<SiteSettings> {
  if (!(await db())) return DEFAULT_SETTINGS;
  try {
    const doc = await Settings.findOne({ key: "site" }).lean();
    if (!doc) return DEFAULT_SETTINGS;

    return {
      logo: doc.logo ?? "",
      heroImage: doc.heroImage || DEFAULT_SETTINGS.heroImage,
      heroImagePosition: doc.heroImagePosition ?? "center",
      heroOverlay: doc.heroOverlay ?? DEFAULT_SETTINGS.heroOverlay,
      heroEyebrow: doc.heroEyebrow ?? DEFAULT_SETTINGS.heroEyebrow,
      heroTitle: doc.heroTitle || DEFAULT_SETTINGS.heroTitle,
      heroSubtitle: doc.heroSubtitle || DEFAULT_SETTINGS.heroSubtitle,
      heroPrimaryCtaText: doc.heroPrimaryCtaText || DEFAULT_SETTINGS.heroPrimaryCtaText,
      heroPrimaryCtaHref: doc.heroPrimaryCtaHref || DEFAULT_SETTINGS.heroPrimaryCtaHref,
      heroSecondaryCtaText: doc.heroSecondaryCtaText || DEFAULT_SETTINGS.heroSecondaryCtaText,
      heroSecondaryCtaHref: doc.heroSecondaryCtaHref || DEFAULT_SETTINGS.heroSecondaryCtaHref,
      aboutContent: doc.aboutContent || DEFAULT_SETTINGS.aboutContent,
      history: doc.history || DEFAULT_SETTINGS.history,
      mission: doc.mission || DEFAULT_SETTINGS.mission,
      vision: doc.vision || DEFAULT_SETTINGS.vision,
      objectives: doc.objectives?.length ? [...doc.objectives] : DEFAULT_SETTINGS.objectives,
      coreValues: doc.coreValues?.length
        ? doc.coreValues.map((value) => ({ title: value.title, description: value.description ?? "" }))
        : DEFAULT_SETTINGS.coreValues,
      footerTagline: doc.footerTagline || DEFAULT_SETTINGS.footerTagline,
      footerText: doc.footerText || DEFAULT_SETTINGS.footerText,
      instituteInfo: doc.instituteInfo || DEFAULT_SETTINGS.instituteInfo,
      copyright: doc.copyright || DEFAULT_SETTINGS.copyright,
      contactInfo: {
        email: doc.contactInfo?.email || DEFAULT_SETTINGS.contactInfo.email,
        phone: doc.contactInfo?.phone || DEFAULT_SETTINGS.contactInfo.phone,
        address: doc.contactInfo?.address || DEFAULT_SETTINGS.contactInfo.address,
        mapUrl: doc.contactInfo?.mapUrl || DEFAULT_SETTINGS.contactInfo.mapUrl,
      },
      socialLinks: doc.socialLinks?.length
        ? doc.socialLinks.map((link) => ({ platform: link.platform, url: link.url }))
        : DEFAULT_SETTINGS.socialLinks,
      navItems: doc.navItems?.length
        ? sortByOrder(
            doc.navItems.map((item) => ({
              label: item.label,
              href: item.href,
              visible: item.visible ?? true,
              order: item.order ?? 0,
            }))
          )
        : DEFAULT_SETTINGS.navItems,
      sectionSettings: doc.sectionSettings?.length
        ? sortByOrder(
            doc.sectionSettings.map((section) => ({
              key: section.key,
              label: section.label,
              visible: section.visible ?? true,
              order: section.order ?? 0,
            }))
          )
        : DEFAULT_SECTIONS,
      stats: doc.stats?.length
        ? doc.stats.map((stat) => ({ label: stat.label, value: stat.value ?? 0, suffix: stat.suffix ?? "" }))
        : DEFAULT_SETTINGS.stats,
      themeAccent: doc.themeAccent || DEFAULT_SETTINGS.themeAccent,
    };
  } catch (error) {
    console.error("[data] getSettings failed:", error);
    return DEFAULT_SETTINGS;
  }
}

/* -------------------------------------------------------------------------- */
/*                                    Posts                                   */
/* -------------------------------------------------------------------------- */

type PostQuery = {
  category?: string;
  q?: string;
  sort?: "newest" | "oldest";
  page?: number;
  limit?: number;
  includeDrafts?: boolean;
  featuredOnly?: boolean;
  status?: "draft" | "published";
};

function mapPost(doc: Record<string, any>): PostDTO {
  return {
    id: String(doc._id),
    title: doc.title,
    slug: doc.slug,
    category: doc.category,
    coverImage: doc.coverImage ?? "",
    excerpt: doc.excerpt ?? "",
    content: doc.content,
    authorName: doc.authorName ?? "Club Media Desk",
    status: doc.status,
    isFeatured: Boolean(doc.isFeatured),
    publishedAt: iso(doc.publishedAt),
    createdAt: iso(doc.createdAt) ?? new Date().toISOString(),
    updatedAt: iso(doc.updatedAt) ?? new Date().toISOString(),
  };
}

export async function getPosts(options: PostQuery = {}) {
  const { category, q, sort = "newest", page = 1, limit = PAGE_SIZE, includeDrafts = false, featuredOnly = false, status } = options;

  if (!(await db())) {
    let items = [...SAMPLE_POSTS];
    if (!includeDrafts) items = items.filter((post) => post.status === "published");
    if (status) items = items.filter((post) => post.status === status);
    if (category) items = items.filter((post) => post.category === category);
    if (featuredOnly) items = items.filter((post) => post.isFeatured);
    if (q) {
      const needle = q.toLowerCase();
      items = items.filter(
        (post) =>
          post.title.toLowerCase().includes(needle) ||
          post.excerpt.toLowerCase().includes(needle) ||
          post.content.toLowerCase().includes(needle)
      );
    }
    items.sort((a, b) =>
      sort === "oldest"
        ? new Date(a.publishedAt ?? a.createdAt).getTime() - new Date(b.publishedAt ?? b.createdAt).getTime()
        : new Date(b.publishedAt ?? b.createdAt).getTime() - new Date(a.publishedAt ?? a.createdAt).getTime()
    );
    const total = items.length;
    const start = (page - 1) * limit;
    return { items: items.slice(start, start + limit), total, page, pages: Math.max(1, Math.ceil(total / limit)) };
  }

  try {
    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;
    else if (!includeDrafts) filter.status = "published";
    if (category) filter.category = category;
    if (featuredOnly) filter.isFeatured = true;
    if (q) {
      const regex = new RegExp(escapeRegex(q), "i");
      filter.$or = [{ title: regex }, { excerpt: regex }, { content: regex }];
    }

    const total = await Post.countDocuments(filter);
    const items = await Post.find(filter)
      .sort({ publishedAt: sort === "oldest" ? 1 : -1, createdAt: sort === "oldest" ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return {
      items: items.map((post) => mapPost(post as unknown as Record<string, any>)),
      total,
      page,
      pages: Math.max(1, Math.ceil(total / limit)),
    };
  } catch (error) {
    console.error("[data] getPosts failed:", error);
    return { items: [], total: 0, page, pages: 1 };
  }
}

export async function getPostBySlug(slug: string, includeDrafts = false): Promise<PostDTO | null> {
  if (!(await db())) {
    const post = SAMPLE_POSTS.find((item) => item.slug === slug);
    if (!post) return null;
    if (!includeDrafts && post.status !== "published") return null;
    return post;
  }
  try {
    const filter: Record<string, unknown> = { slug };
    if (!includeDrafts) filter.status = "published";
    const post = await Post.findOne(filter).lean();
    return post ? mapPost(post as unknown as Record<string, any>) : null;
  } catch (error) {
    console.error("[data] getPostBySlug failed:", error);
    return null;
  }
}

export async function getPostById(id: string): Promise<PostDTO | null> {
  if (!(await db())) return SAMPLE_POSTS.find((post) => post.id === id) ?? null;
  try {
    if (!/^[a-f0-9]{24}$/i.test(id)) return null;
    const post = await Post.findById(id).lean();
    return post ? mapPost(post as unknown as Record<string, any>) : null;
  } catch (error) {
    console.error("[data] getPostById failed:", error);
    return null;
  }
}

export async function getRelatedPosts(slug: string, category: string, limit = 3) {
  if (!(await db())) {
    return SAMPLE_POSTS.filter((post) => post.slug !== slug).slice(0, limit);
  }
  try {
    const posts = await Post.find({ slug: { $ne: slug }, status: "published", category })
      .sort({ publishedAt: -1 })
      .limit(limit)
      .lean();
    const mapped = posts.map((post) => mapPost(post as unknown as Record<string, any>));
    if (mapped.length >= limit) return mapped;
    const fill = await Post.find({ slug: { $ne: slug }, status: "published" })
      .sort({ publishedAt: -1 })
      .limit(limit)
      .lean();
    const seen = new Set(mapped.map((post) => post.id));
    for (const post of fill.map((item) => mapPost(item as unknown as Record<string, any>))) {
      if (!seen.has(post.id)) {
        mapped.push(post);
        seen.add(post.id);
      }
      if (mapped.length >= limit) break;
    }
    return mapped;
  } catch (error) {
    console.error("[data] getRelatedPosts failed:", error);
    return [];
  }
}

/* -------------------------------------------------------------------------- */
/*                                    Events                                  */
/* -------------------------------------------------------------------------- */

function mapEvent(doc: Record<string, any>): EventDTO {
  return {
    id: String(doc._id),
    title: doc.title,
    slug: doc.slug,
    category: doc.category,
    description: doc.description,
    image: doc.image ?? "",
    startDate: iso(doc.startDate) ?? new Date().toISOString(),
    endDate: iso(doc.endDate) ?? new Date().toISOString(),
    venue: doc.venue,
    registrationDeadline: iso(doc.registrationDeadline) ?? "",
    capacity: doc.capacity ?? 0,
    status: doc.status,
    registrationStatus: doc.registrationStatus ?? "coming-soon",
    rules: doc.rules ?? "",
    createdAt: iso(doc.createdAt) ?? new Date().toISOString(),
    updatedAt: iso(doc.updatedAt) ?? new Date().toISOString(),
  };
}

export function eventPhase(event: Pick<EventDTO, "startDate" | "endDate">, now = Date.now()): EventPhase {
  const start = new Date(event.startDate).getTime();
  const end = new Date(event.endDate).getTime();
  if (end < now) return "past";
  if (start <= now && end >= now) return "ongoing";
  return "upcoming";
}

type EventQuery = {
  phase?: EventPhase | "all";
  category?: string;
  q?: string;
  includeDrafts?: boolean;
  limit?: number;
  page?: number;
  status?: "draft" | "published";
};

export async function getEvents(options: EventQuery = {}) {
  const { phase = "all", category, q, includeDrafts = false, limit = 30, page = 1, status } = options;

  if (!(await db())) {
    let items = SAMPLE_EVENTS.filter((event) => includeDrafts || event.status === "published");
    if (status) items = items.filter((event) => event.status === status);
    if (category) items = items.filter((event) => event.category === category);
    if (phase !== "all") items = items.filter((event) => eventPhase(event) === phase);
    if (q) {
      const needle = q.toLowerCase();
      items = items.filter(
        (event) =>
          event.title.toLowerCase().includes(needle) ||
          event.description.toLowerCase().includes(needle) ||
          event.venue.toLowerCase().includes(needle)
      );
    }
    items = items.sort((a, b) => {
      if (phase === "past") return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    });
    const total = items.length;
    const start = (page - 1) * limit;
    return { items: items.slice(start, start + limit), total, page, pages: Math.max(1, Math.ceil(total / limit)) };
  }

  try {
    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;
    else if (!includeDrafts) filter.status = "published";
    if (category) filter.category = category;
    if (phase === "past") filter.endDate = { $lt: new Date() };
    if (phase === "upcoming") filter.startDate = { $gt: new Date() };
    if (phase === "ongoing") {
      filter.startDate = { $lte: new Date() };
      filter.endDate = { $gte: new Date() };
    }
    if (q) {
      const regex = new RegExp(escapeRegex(q), "i");
      filter.$or = [{ title: regex }, { description: regex }, { venue: regex }];
    }

    const total = await Event.countDocuments(filter);
    const items = await Event.find(filter)
      .sort({ startDate: phase === "past" ? -1 : 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return {
      items: items.map((event) => mapEvent(event as unknown as Record<string, any>)),
      total,
      page,
      pages: Math.max(1, Math.ceil(total / limit)),
    };
  } catch (error) {
    console.error("[data] getEvents failed:", error);
    return { items: [], total: 0, page, pages: 1 };
  }
}

export async function getEventBySlug(slug: string, includeDrafts = false): Promise<EventDTO | null> {
  if (!(await db())) {
    const event = SAMPLE_EVENTS.find((item) => item.slug === slug);
    if (!event) return null;
    if (!includeDrafts && event.status !== "published") return null;
    return event;
  }
  try {
    const filter: Record<string, unknown> = { slug };
    if (!includeDrafts) filter.status = "published";
    const event = await Event.findOne(filter).lean();
    return event ? mapEvent(event as unknown as Record<string, any>) : null;
  } catch (error) {
    console.error("[data] getEventBySlug failed:", error);
    return null;
  }
}

export async function getEventById(id: string): Promise<EventDTO | null> {
  if (!(await db())) return SAMPLE_EVENTS.find((event) => event.id === id) ?? null;
  try {
    if (!/^[a-f0-9]{24}$/i.test(id)) return null;
    const event = await Event.findById(id).lean();
    return event ? mapEvent(event as unknown as Record<string, any>) : null;
  } catch (error) {
    console.error("[data] getEventById failed:", error);
    return null;
  }
}

/* -------------------------------------------------------------------------- */
/*                                    Team                                    */
/* -------------------------------------------------------------------------- */

function mapTeam(doc: Record<string, any>): TeamMemberDTO {
  return {
    id: String(doc._id),
    name: doc.name,
    designation: doc.designation,
    committee: doc.committee,
    photo: doc.photo ?? "",
    bio: doc.bio ?? "",
    department: doc.department ?? "",
    socialLinks: {
      facebook: doc.socialLinks?.facebook ?? "",
      linkedin: doc.socialLinks?.linkedin ?? "",
      x: doc.socialLinks?.x ?? "",
      instagram: doc.socialLinks?.instagram ?? "",
      email: doc.socialLinks?.email ?? "",
    },
    displayOrder: doc.displayOrder ?? 0,
    isActive: doc.isActive !== false,
  };
}

export async function getTeam(options: { activeOnly?: boolean; limit?: number } = {}) {
  const { activeOnly = true, limit } = options;
  if (!(await db())) {
    const items = SAMPLE_TEAM.filter((member) => (activeOnly ? member.isActive : true));
    return items.sort((a, b) => a.displayOrder - b.displayOrder).slice(0, limit ?? items.length);
  }
  try {
    const filter = activeOnly ? { isActive: true } : {};
    let query = TeamMember.find(filter).sort({ displayOrder: 1, createdAt: 1 });
    if (limit) query = query.limit(limit);
    const items = await query.lean();
    return items.map((member) => mapTeam(member as unknown as Record<string, any>));
  } catch (error) {
    console.error("[data] getTeam failed:", error);
    return [];
  }
}

export async function getTeamMemberById(id: string): Promise<TeamMemberDTO | null> {
  if (!(await db())) return SAMPLE_TEAM.find((member) => member.id === id) ?? null;
  try {
    if (!/^[a-f0-9]{24}$/i.test(id)) return null;
    const member = await TeamMember.findById(id).lean();
    return member ? mapTeam(member as unknown as Record<string, any>) : null;
  } catch {
    return null;
  }
}

/* -------------------------------------------------------------------------- */
/*                                   Gallery                                  */
/* -------------------------------------------------------------------------- */

function mapGallery(doc: Record<string, any>): GalleryItemDTO {
  return {
    id: String(doc._id),
    imageUrl: doc.imageUrl,
    caption: doc.caption ?? "",
    album: doc.album ?? "Campus Events",
    eventId: doc.eventId ?? "",
    displayOrder: doc.displayOrder ?? 0,
    uploadedAt: iso(doc.uploadedAt) ?? new Date().toISOString(),
  };
}

export async function getGallery(options: { album?: string; limit?: number } = {}) {
  const { album, limit } = options;
  if (!(await db())) {
    let items = [...SAMPLE_GALLERY];
    if (album) items = items.filter((item) => item.album === album);
    items.sort((a, b) => a.displayOrder - b.displayOrder);
    return items.slice(0, limit ?? items.length);
  }
  try {
    const filter = album ? { album } : {};
    let query = GalleryItem.find(filter).sort({ displayOrder: 1, uploadedAt: -1 });
    if (limit) query = query.limit(limit);
    const items = await query.lean();
    return items.map((item) => mapGallery(item as unknown as Record<string, any>));
  } catch (error) {
    console.error("[data] getGallery failed:", error);
    return [];
  }
}

export async function getGalleryById(id: string): Promise<GalleryItemDTO | null> {
  if (!(await db())) return SAMPLE_GALLERY.find((item) => item.id === id) ?? null;
  try {
    if (!/^[a-f0-9]{24}$/i.test(id)) return null;
    const item = await GalleryItem.findById(id).lean();
    return item ? mapGallery(item as unknown as Record<string, any>) : null;
  } catch {
    return null;
  }
}

/* -------------------------------------------------------------------------- */
/*                                   Notices                                  */
/* -------------------------------------------------------------------------- */

function mapNotice(doc: Record<string, any>): NoticeDTO {
  return {
    id: String(doc._id),
    title: doc.title,
    content: doc.content,
    status: doc.status,
    isImportant: Boolean(doc.isImportant),
    publishedAt: iso(doc.publishedAt),
    expiresAt: iso(doc.expiresAt),
  };
}

export async function getNotices(options: { includeDrafts?: boolean; limit?: number } = {}) {
  const { includeDrafts = false, limit } = options;
  const now = new Date();
  if (!(await db())) {
    let items = SAMPLE_NOTICES.filter(
      (notice) =>
        (includeDrafts || notice.status === "published") &&
        (!notice.expiresAt || new Date(notice.expiresAt) > now)
    );
    items.sort((a, b) => Number(b.isImportant) - Number(a.isImportant));
    return items.slice(0, limit ?? items.length);
  }
  try {
    const filter: Record<string, unknown> = {};
    if (!includeDrafts) {
      filter.status = "published";
      filter.$or = [{ expiresAt: null }, { expiresAt: { $gt: now } }];
    }
    let query = Notice.find(filter).sort({ isImportant: -1, publishedAt: -1 });
    if (limit) query = query.limit(limit);
    const items = await query.lean();
    return items.map((notice) => mapNotice(notice as unknown as Record<string, any>));
  } catch (error) {
    console.error("[data] getNotices failed:", error);
    return [];
  }
}

export async function getNoticeById(id: string): Promise<NoticeDTO | null> {
  if (!(await db())) return SAMPLE_NOTICES.find((notice) => notice.id === id) ?? null;
  try {
    if (!/^[a-f0-9]{24}$/i.test(id)) return null;
    const notice = await Notice.findById(id).lean();
    return notice ? mapNotice(notice as unknown as Record<string, any>) : null;
  } catch {
    return null;
  }
}

/* -------------------------------------------------------------------------- */
/*                                 Membership                                 */
/* -------------------------------------------------------------------------- */

function mapMembership(doc: Record<string, any>): MembershipDTO {
  return {
    id: String(doc._id),
    referenceNo: doc.referenceNo,
    name: doc.name,
    studentId: doc.studentId,
    department: doc.department,
    semester: doc.semester,
    group: doc.group ?? "",
    email: doc.email,
    phone: doc.phone,
    photo: doc.photo ?? "",
    fatherName: doc.fatherName ?? "",
    motherName: doc.motherName ?? "",
    hasDebateExperience: doc.hasDebateExperience === "yes" ? "yes" : "no",
    canCommitTime: doc.canCommitTime === "no" ? "no" : "yes",
    experience: doc.experience ?? "",
    motivation: doc.motivation,
    activities: doc.activities ?? "",
    status: doc.status,
    submittedAt: iso(doc.submittedAt) ?? new Date().toISOString(),
    reviewedAt: iso(doc.reviewedAt),
    notes: doc.notes ?? "",
  };
}

export async function getMembershipApplications(options: { status?: string; q?: string; page?: number; limit?: number } = {}) {
  const { status, q, page = 1, limit = 20 } = options;
  if (!(await db())) {
    let items = [...SAMPLE_MEMBERSHIP];
    if (status && status !== "all") items = items.filter((item) => item.status === status);
    if (q) {
      const needle = q.toLowerCase();
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(needle) ||
          item.email.toLowerCase().includes(needle) ||
          item.studentId.toLowerCase().includes(needle) ||
          item.referenceNo.toLowerCase().includes(needle)
      );
    }
    items.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
    const total = items.length;
    const start = (page - 1) * limit;
    return { items: items.slice(start, start + limit), total, page, pages: Math.max(1, Math.ceil(total / limit)) };
  }
  try {
    const filter: Record<string, unknown> = {};
    if (status && status !== "all") filter.status = status;
    if (q) {
      const regex = new RegExp(escapeRegex(q), "i");
      filter.$or = [
        { name: regex },
        { email: regex },
        { studentId: regex },
        { referenceNo: regex },
        { phone: regex },
      ];
    }
    const total = await Membership.countDocuments(filter);
    const items = await Membership.find(filter)
      .sort({ submittedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
    return {
      items: items.map((item) => mapMembership(item as unknown as Record<string, any>)),
      total,
      page,
      pages: Math.max(1, Math.ceil(total / limit)),
    };
  } catch (error) {
    console.error("[data] getMembershipApplications failed:", error);
    return { items: [], total: 0, page, pages: 1 };
  }
}

export async function getMembershipById(id: string): Promise<MembershipDTO | null> {
  if (!(await db())) return SAMPLE_MEMBERSHIP.find((item) => item.id === id) ?? null;
  try {
    if (!/^[a-f0-9]{24}$/i.test(id)) return null;
    const item = await Membership.findById(id).lean();
    return item ? mapMembership(item as unknown as Record<string, any>) : null;
  } catch {
    return null;
  }
}

/* -------------------------------------------------------------------------- */
/*                             Event registrations                            */
/* -------------------------------------------------------------------------- */

export async function getEventRegistrations(eventId: string): Promise<import("./types").EventRegistrationDTO[]> {
  if (!(await db())) return [];
  try {
    if (!/^[a-f0-9]{24}$/i.test(eventId)) return [];
    const items = await EventRegistration.find({ eventId }).sort({ createdAt: -1 }).lean();
    return items.map((item) => ({
      id: String(item._id),
      eventId: item.eventId,
      eventTitle: item.eventTitle ?? "",
      name: item.name,
      studentId: item.studentId,
      email: item.email,
      phone: item.phone,
      department: item.department ?? "",
      referenceNo: item.referenceNo,
      status: item.status as "confirmed" | "cancelled",
      createdAt: iso(item.createdAt) ?? new Date().toISOString(),
    }));
  } catch (error) {
    console.error("[data] getEventRegistrations failed:", error);
    return [];
  }
}

export async function getEventRegistrationCount(eventId: string): Promise<number> {
  if (!(await db())) return 0;
  try {
    return await EventRegistration.countDocuments({ eventId });
  } catch {
    return 0;
  }
}

/* -------------------------------------------------------------------------- */
/*                              Contact messages                              */
/* -------------------------------------------------------------------------- */

function mapMessage(doc: Record<string, any>): ContactMessageDTO {
  return {
    id: String(doc._id),
    name: doc.name,
    email: doc.email,
    subject: doc.subject,
    message: doc.message,
    status: doc.status,
    submittedAt: iso(doc.submittedAt) ?? new Date().toISOString(),
  };
}

export async function getContactMessages(options: { status?: string; q?: string; limit?: number } = {}) {
  const { status, q, limit } = options;
  if (!(await db())) {
    let items = [...SAMPLE_MESSAGES];
    if (status && status !== "all") items = items.filter((item) => item.status === status);
    if (q) {
      const needle = q.toLowerCase();
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(needle) ||
          item.email.toLowerCase().includes(needle) ||
          item.subject.toLowerCase().includes(needle) ||
          item.message.toLowerCase().includes(needle)
      );
    }
    return items.slice(0, limit ?? items.length);
  }
  try {
    const filter: Record<string, unknown> = {};
    if (status && status !== "all") filter.status = status;
    if (q) {
      const regex = new RegExp(escapeRegex(q), "i");
      filter.$or = [{ name: regex }, { email: regex }, { subject: regex }, { message: regex }];
    }
    let query = ContactMessage.find(filter).sort({ submittedAt: -1 });
    if (limit) query = query.limit(limit);
    const items = await query.lean();
    return items.map((item) => mapMessage(item as unknown as Record<string, any>));
  } catch (error) {
    console.error("[data] getContactMessages failed:", error);
    return [];
  }
}

export async function getContactMessageById(id: string): Promise<ContactMessageDTO | null> {
  if (!(await db())) return SAMPLE_MESSAGES.find((item) => item.id === id) ?? null;
  try {
    if (!/^[a-f0-9]{24}$/i.test(id)) return null;
    const item = await ContactMessage.findById(id).lean();
    return item ? mapMessage(item as unknown as Record<string, any>) : null;
  } catch {
    return null;
  }
}

/* -------------------------------------------------------------------------- */
/*                                 Dashboard                                  */
/* -------------------------------------------------------------------------- */

export async function getDashboardStats(): Promise<DashboardStats> {
  const empty: DashboardStats = {
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalEvents: 0,
    upcomingEvents: 0,
    totalMembers: 0,
    pendingRegistrations: 0,
    contactMessages: 0,
    unreadMessages: 0,
    galleryItems: 0,
    teamMembers: 0,
    notices: 0,
  };

  if (!(await db())) {
    return {
      totalPosts: SAMPLE_POSTS.length,
      publishedPosts: SAMPLE_POSTS.filter((post) => post.status === "published").length,
      draftPosts: SAMPLE_POSTS.filter((post) => post.status === "draft").length,
      totalEvents: SAMPLE_EVENTS.length,
      upcomingEvents: SAMPLE_EVENTS.filter((event) => eventPhase(event) === "upcoming").length,
      totalMembers: SAMPLE_MEMBERSHIP.length,
      pendingRegistrations: SAMPLE_MEMBERSHIP.filter((item) => item.status === "pending").length,
      contactMessages: SAMPLE_MESSAGES.length,
      unreadMessages: SAMPLE_MESSAGES.filter((item) => item.status === "unread").length,
      galleryItems: SAMPLE_GALLERY.length,
      teamMembers: SAMPLE_TEAM.length,
      notices: SAMPLE_NOTICES.length,
    };
  }

  try {
    const now = new Date();
    const [
      totalPosts,
      publishedPosts,
      draftPosts,
      totalEvents,
      upcomingEvents,
      totalMembers,
      pendingRegistrations,
      contactMessages,
      unreadMessages,
      galleryItems,
      teamMembers,
      notices,
    ] = await Promise.all([
      Post.countDocuments({}),
      Post.countDocuments({ status: "published" }),
      Post.countDocuments({ status: "draft" }),
      Event.countDocuments({}),
      Event.countDocuments({ startDate: { $gte: now }, status: "published" }),
      Membership.countDocuments({}),
      Membership.countDocuments({ status: "pending" }),
      ContactMessage.countDocuments({}),
      ContactMessage.countDocuments({ status: "unread" }),
      GalleryItem.countDocuments({}),
      TeamMember.countDocuments({}),
      Notice.countDocuments({}),
    ]);
    return {
      totalPosts,
      publishedPosts,
      draftPosts,
      totalEvents,
      upcomingEvents,
      totalMembers,
      pendingRegistrations,
      contactMessages,
      unreadMessages,
      galleryItems,
      teamMembers,
      notices,
    };
  } catch (error) {
    console.error("[data] getDashboardStats failed:", error);
    return empty;
  }
}

export async function getRecentActivity(limit = 8): Promise<ActivityItem[]> {
  if (!(await db())) {
    return [
      {
        id: "demo-activity-1",
        action: "Published",
        entity: "Post",
        detail: "DCRGPI Debaters Reach the Semi-Finals",
        actor: "Club Media Desk",
        createdAt: new Date(Date.now() - 3_600_000).toISOString(),
      },
      {
        id: "demo-activity-2",
        action: "Approved",
        entity: "Membership",
        detail: "Sumaiya Akter",
        actor: "Administrator",
        createdAt: new Date(Date.now() - 86_400_000).toISOString(),
      },
    ];
  }
  try {
    const items = await Activity.find({}).sort({ createdAt: -1 }).limit(limit).lean();
    return items.map((item) => ({
      id: String(item._id),
      action: item.action,
      entity: item.entity,
      detail: item.detail ?? "",
      actor: item.actor ?? "System",
      createdAt: iso(item.createdAt) ?? new Date().toISOString(),
    }));
  } catch {
    return [];
  }
}

export async function logActivity(entry: {
  action: string;
  entity: string;
  detail?: string;
  actor?: string;
}) {
  if (!(await db())) return;
  try {
    await Activity.create({
      action: entry.action,
      entity: entry.entity,
      detail: entry.detail ?? "",
      actor: entry.actor ?? "Administrator",
    });
  } catch (error) {
    console.error("[data] logActivity failed:", error);
  }
}

export async function getPublicStats() {
  const settings = await getSettings();
  return settings.stats;
}

export type { SiteSettings };
