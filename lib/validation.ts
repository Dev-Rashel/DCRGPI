import { z } from "zod";
import {
  COMMITTEES,
  EVENT_CATEGORIES,
  EVENT_STATUSES,
  MEMBERSHIP_STATUSES,
  NAV_LINKS,
  POST_CATEGORIES,
  POST_STATUSES,
  REGISTRATION_STATUSES,
} from "./constants";

const urlOrEmpty = z
  .string()
  .trim()
  .max(500)
  .refine((value) => value === "" || /^(?:https?:\/\/|\/)[^\s]+$/i.test(value), {
    message: "Enter a valid http(s) URL or a site path such as /logo.svg",
  });

const dateString = z.string().min(1, "Date is required");

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const postSchema = z.object({
  title: z.string().trim().min(4, "Title must be at least 4 characters").max(180),
  slug: z
    .string()
    .trim()
    .min(3, "Slug is required")
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only"),
  category: z.enum(POST_CATEGORIES),
  coverImage: urlOrEmpty.optional().default(""),
  excerpt: z.string().trim().max(400).optional().default(""),
  content: z.string().trim().min(20, "Content must be at least 20 characters"),
  authorName: z.string().trim().min(2).max(120).optional().default("Club Media Desk"),
  status: z.enum(POST_STATUSES).default("draft"),
  isFeatured: z.boolean().optional().default(false),
  publishedAt: z.string().optional().nullable(),
});

export const eventBaseSchema = z.object({
  title: z.string().trim().min(4).max(180),
  slug: z
    .string()
    .trim()
    .min(3)
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only"),
  category: z.enum(EVENT_CATEGORIES),
  description: z.string().trim().min(20, "Description must be at least 20 characters"),
  image: urlOrEmpty.optional().default(""),
  startDate: dateString,
  endDate: dateString,
  venue: z.string().trim().min(3, "Venue is required").max(200),
  registrationDeadline: z.string().optional().nullable(),
  capacity: z.coerce.number().int().min(0).max(100000).default(0),
  status: z.enum(EVENT_STATUSES).default("draft"),
  registrationStatus: z.enum(REGISTRATION_STATUSES).default("coming-soon"),
  rules: z.string().trim().max(3000).optional().default(""),
});

export const eventSchema = eventBaseSchema.refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
  message: "End date must be after the start date",
  path: ["endDate"],
});

export const eventUpdateSchema = eventBaseSchema.partial();

export const membershipSchema = z.object({
  name: z.string().trim().min(3, "Full name is required").max(120),
  studentId: z
    .string()
    .trim()
    .min(3, "Student ID is required")
    .max(40)
    .regex(/^[A-Za-z0-9-]+$/, "Student ID may contain letters, numbers and hyphens only"),
  department: z.string().trim().min(2, "Select a department").max(80),
  semester: z.string().trim().min(1, "Select a semester").max(20),
  email: z.string().trim().email("Enter a valid email"),
  phone: z
    .string()
    .trim()
    .regex(/^(?:\+?880|0)1[3-9]\d{8}$/, "Enter a valid Bangladeshi phone number"),
  photo: urlOrEmpty.optional().default(""),
  experience: z.string().trim().max(2000).optional().default(""),
  motivation: z.string().trim().min(20, "Please tell us at least a sentence or two").max(2000),
  activities: z.string().trim().max(500).optional().default(""),
});

export const eventRegistrationSchema = z.object({
  name: z.string().trim().min(3, "Full name is required").max(120),
  studentId: z
    .string()
    .trim()
    .min(3, "Student ID is required")
    .max(40)
    .regex(/^[A-Za-z0-9-]+$/, "Student ID may contain letters, numbers and hyphens only"),
  email: z.string().trim().email("Enter a valid email"),
  phone: z
    .string()
    .trim()
    .regex(/^(?:\+?880|0)1[3-9]\d{8}$/, "Enter a valid Bangladeshi phone number"),
  department: z.string().trim().max(80).optional().default(""),
  message: z.string().trim().max(500).optional().default(""),
});

export const eventRegistrationUpdateSchema = z.object({
  status: z.enum(["confirmed", "cancelled"]),
});

export const teamMemberSchema = z.object({
  name: z.string().trim().min(3, "Name is required").max(120),
  designation: z.string().trim().min(2, "Designation is required").max(120),
  committee: z.enum(COMMITTEES),
  photo: urlOrEmpty.optional().default(""),
  bio: z.string().trim().max(1200).optional().default(""),
  department: z.string().trim().max(160).optional().default(""),
  socialLinks: z
    .object({
      facebook: urlOrEmpty.optional().default(""),
      linkedin: urlOrEmpty.optional().default(""),
      x: urlOrEmpty.optional().default(""),
      instagram: urlOrEmpty.optional().default(""),
      email: z.union([z.literal(""), z.string().email()]).optional().default(""),
    })
    .optional(),
  displayOrder: z.coerce.number().int().min(0).max(999).default(0),
  isActive: z.boolean().optional().default(true),
});

export const teamReorderSchema = z.object({
  order: z.array(z.object({ id: z.string(), displayOrder: z.number().int().min(0) })).min(1),
});

export const gallerySchema = z.object({
  imageUrl: z.string().trim().url("An image URL is required"),
  caption: z.string().trim().max(240).optional().default(""),
  album: z.string().trim().min(1).max(80).default("Campus Events"),
  eventId: z.string().trim().optional().default(""),
  displayOrder: z.coerce.number().int().min(0).max(999).optional().default(0),
});

export const galleryReorderSchema = z.object({
  order: z.array(z.object({ id: z.string(), displayOrder: z.number().int().min(0) })).min(1),
});

export const noticeSchema = z.object({
  title: z.string().trim().min(4, "Title is required").max(200),
  content: z.string().trim().min(4, "Content is required").max(2000),
  status: z.enum(POST_STATUSES).default("published"),
  isImportant: z.boolean().optional().default(false),
  publishedAt: z.string().optional().nullable(),
  expiresAt: z.string().optional().nullable(),
});

export const contactSchema = z.object({
  name: z.string().trim().min(3, "Your name is required").max(120),
  email: z.string().trim().email("Enter a valid email"),
  subject: z.string().trim().min(3, "Subject is required").max(160),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(3000),
});

export const membershipUpdateSchema = z.object({
  status: z.enum(MEMBERSHIP_STATUSES).optional(),
  notes: z.string().trim().max(2000).optional(),
});

export const messageUpdateSchema = z.object({
  status: z.enum(["unread", "read"]),
});

const navItemSchema = z.object({
  label: z.string().trim().min(1).max(60),
  href: z.string().trim().min(1).max(200),
  visible: z.boolean(),
  order: z.number(),
});

const sectionSchema = z.object({
  key: z.string().trim().min(1),
  label: z.string().trim().min(1),
  visible: z.boolean(),
  order: z.number(),
});

const statSchema = z.object({
  label: z.string().trim().min(1).max(60),
  value: z.coerce.number().min(0),
  suffix: z.string().max(10).optional().default(""),
});

const socialSchema = z.object({
  platform: z.string().trim().min(1).max(40),
  url: z.string().trim().url(),
});

const coreValueSchema = z.object({
  title: z.string().trim().min(1).max(100),
  description: z.string().trim().max(400).optional().default(""),
});

export const settingsSchema = z.object({
  logo: urlOrEmpty.optional().default(""),
  heroImage: urlOrEmpty.optional().default(""),
  heroImagePosition: z.enum(["center", "top", "bottom"]).default("center"),
  heroOverlay: z.coerce.number().min(0).max(95).default(72),
  heroEyebrow: z.string().trim().max(160).optional().default(""),
  heroTitle: z.string().trim().min(4, "Hero heading is required").max(160),
  heroSubtitle: z.string().trim().max(600).optional().default(""),
  heroPrimaryCtaText: z.string().trim().max(60).optional().default("Join the Club"),
  heroPrimaryCtaHref: z.string().trim().max(200).optional().default("/register"),
  heroSecondaryCtaText: z.string().trim().max(60).optional().default("Explore Events"),
  heroSecondaryCtaHref: z.string().trim().max(200).optional().default("/events"),
  aboutContent: z.string().trim().max(8000).optional().default(""),
  history: z.string().trim().max(4000).optional().default(""),
  mission: z.string().trim().max(2000).optional().default(""),
  vision: z.string().trim().max(2000).optional().default(""),
  objectives: z.array(z.string().trim().max(400)).default([]),
  coreValues: z.array(coreValueSchema).default([]),
  footerTagline: z.string().trim().max(300).optional().default(""),
  footerText: z.string().trim().max(1000).optional().default(""),
  instituteInfo: z.string().trim().max(300).optional().default(""),
  copyright: z.string().trim().max(200).optional().default(""),
  contactInfo: z
    .object({
      email: z.union([z.literal(""), z.string().email()]).default(""),
      phone: z.string().trim().max(40).default(""),
      address: z.string().trim().max(300).default(""),
      mapUrl: z.union([z.literal(""), z.string().url()]).default(""),
    })
    .default({}),
  socialLinks: z.array(socialSchema).default([]),
  navItems: z.array(navItemSchema).default([]),
  sectionSettings: z.array(sectionSchema).default([]),
  stats: z.array(statSchema).default([]),
  themeAccent: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Use a hex colour like #eec46a")
    .default("#eec46a"),
});

export const defaultNavItems = NAV_LINKS.map((item, index) => ({
  ...item,
  visible: true,
  order: index,
}));

export type PostInput = z.infer<typeof postSchema>;
export type EventInput = z.infer<typeof eventSchema>;
export type MembershipInput = z.infer<typeof membershipSchema>;
export type TeamMemberInput = z.infer<typeof teamMemberSchema>;
export type GalleryInput = z.infer<typeof gallerySchema>;
export type NoticeInput = z.infer<typeof noticeSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type SettingsInput = z.infer<typeof settingsSchema>;
