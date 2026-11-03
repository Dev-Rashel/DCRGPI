export type PostStatus = "draft" | "published";
export type EventStatus = "draft" | "published";
export type RegistrationStatus = "open" | "closed" | "coming-soon";
export type MembershipStatus = "pending" | "approved" | "rejected";
export type MessageStatus = "unread" | "read";

export interface SocialLink {
  platform: string;
  url: string;
}

export interface NavItem {
  label: string;
  href: string;
  visible: boolean;
  order: number;
}

export interface SectionSetting {
  key: string;
  label: string;
  visible: boolean;
  order: number;
}

export interface StatItem {
  label: string;
  value: number;
  suffix?: string;
}

export interface CoreValue {
  title: string;
  description: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  address: string;
  mapUrl?: string;
}

export interface SiteSettings {
  logo: string;
  heroImage: string;
  heroImagePosition: "center" | "top" | "bottom";
  heroOverlay: number;
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  heroPrimaryCtaText: string;
  heroPrimaryCtaHref: string;
  heroSecondaryCtaText: string;
  heroSecondaryCtaHref: string;
  aboutContent: string;
  history: string;
  mission: string;
  vision: string;
  objectives: string[];
  coreValues: CoreValue[];
  footerTagline: string;
  footerText: string;
  instituteInfo: string;
  copyright: string;
  contactInfo: ContactInfo;
  socialLinks: SocialLink[];
  navItems: NavItem[];
  sectionSettings: SectionSetting[];
  stats: StatItem[];
  themeAccent: string;
}

export interface PostDTO {
  id: string;
  title: string;
  slug: string;
  category: string;
  coverImage: string;
  excerpt: string;
  content: string;
  authorName: string;
  status: PostStatus;
  isFeatured: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface EventDTO {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  image: string;
  startDate: string;
  endDate: string;
  venue: string;
  registrationDeadline: string;
  capacity: number;
  status: EventStatus;
  registrationStatus: RegistrationStatus;
  rules: string;
  createdAt: string;
  updatedAt: string;
}

export type EventPhase = "upcoming" | "ongoing" | "past";

export interface TeamMemberDTO {
  id: string;
  name: string;
  designation: string;
  committee: string;
  photo: string;
  bio: string;
  department: string;
  socialLinks: {
    facebook?: string;
    linkedin?: string;
    x?: string;
    instagram?: string;
    email?: string;
  };
  displayOrder: number;
  isActive: boolean;
}

export interface MembershipDTO {
  id: string;
  referenceNo: string;
  name: string;
  studentId: string;
  department: string;
  semester: string;
  email: string;
  phone: string;
  photo: string;
  experience: string;
  motivation: string;
  activities: string;
  status: MembershipStatus;
  submittedAt: string;
  reviewedAt: string | null;
  notes: string;
}

export interface GalleryItemDTO {
  id: string;
  imageUrl: string;
  caption: string;
  album: string;
  eventId: string;
  displayOrder: number;
  uploadedAt: string;
}

export interface NoticeDTO {
  id: string;
  title: string;
  content: string;
  status: "draft" | "published";
  isImportant: boolean;
  publishedAt: string | null;
  expiresAt: string | null;
}

export interface EventRegistrationDTO {
  id: string;
  eventId: string;
  eventTitle: string;
  name: string;
  studentId: string;
  email: string;
  phone: string;
  department: string;
  referenceNo: string;
  status: "confirmed" | "cancelled";
  createdAt: string;
}

export interface ContactMessageDTO {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: MessageStatus;
  submittedAt: string;
}

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "editor";
  image?: string;
}

export interface DashboardStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalEvents: number;
  upcomingEvents: number;
  totalMembers: number;
  pendingRegistrations: number;
  contactMessages: number;
  unreadMessages: number;
  galleryItems: number;
  teamMembers: number;
  notices: number;
}

export interface ActivityItem {
  id: string;
  action: string;
  entity: string;
  detail: string;
  actor: string;
  createdAt: string;
}
