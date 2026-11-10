export const SITE_NAME = "DCRGPI";
export const SITE_FULL_NAME = "Debating Club of Rangpur Government Polytechnic Institute";
export const INSTITUTE_NAME = "Rangpur Government Polytechnic Institute";

export const POST_CATEGORIES = [
  "Club News",
  "Announcements",
  "Debate Articles",
  "Achievements",
  "Workshops",
  "Competition Updates",
] as const;

export const EVENT_CATEGORIES = [
  "Debate Competition",
  "Workshop",
  "Seminar",
  "Audition",
  "Friendly Debate",
  "Ceremony",
] as const;

export const COMMITTEES = [
  "Executive Committee",
  "President & Vice President",
  "General Secretary",
  "Organizing Committee",
  "Trainers & Mentors",
  "Active Debaters",
  "Alumni",
] as const;

export const GALLERY_ALBUMS = [
  "Campus Events",
  "Competitions",
  "Workshops",
  "Training Sessions",
  "Ceremonies",
] as const;

export const DEPARTMENTS = [
  "Computer Technology",
  "Electrical Technology",
  "Electronics Technology",
  "Mechanical Technology",
  "Civil Technology",
  "Chemical Technology",
  "Power Technology",
  "Automobile Technology",
  "Architecture Technology",
  "Other",
];

export const SEMESTERS = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"];

export const MEMBERSHIP_STATUSES = ["pending", "approved", "rejected"] as const;
export const POST_STATUSES = ["draft", "published"] as const;
export const EVENT_STATUSES = ["draft", "published"] as const;
export const REGISTRATION_STATUSES = ["open", "closed", "coming-soon"] as const;

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Posts", href: "/posts" },
  { label: "Events", href: "/events" },
  { label: "Our Team", href: "/team" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

export const ADMIN_NAV = [
  { label: "Dashboard", href: "/admin", icon: "LayoutDashboard" },
  { label: "Posts", href: "/admin/posts", icon: "Newspaper" },
  { label: "Events", href: "/admin/events", icon: "CalendarDays" },
  { label: "Leadership", href: "/admin/team", icon: "Users" },
  { label: "Membership", href: "/admin/membership", icon: "UserPlus" },
  { label: "Gallery", href: "/admin/gallery", icon: "Images" },
  { label: "Notices", href: "/admin/notices", icon: "Megaphone" },
  { label: "Messages", href: "/admin/messages", icon: "Mail" },
  { label: "Settings", href: "/admin/settings", icon: "Settings" },
];

export type SectionKey =
  | "about"
  | "team"
  | "stats"
  | "posts"
  | "events"
  | "gallery"
  | "cta";

export const DEFAULT_SECTIONS: { key: SectionKey; label: string; visible: boolean; order: number }[] = [
  { key: "about", label: "About the club", visible: true, order: 1 },
  { key: "team", label: "Leadership preview", visible: true, order: 2 },
  { key: "stats", label: "Achievements & statistics", visible: true, order: 3 },
  { key: "posts", label: "Latest posts", visible: true, order: 4 },
  { key: "events", label: "Upcoming events", visible: true, order: 5 },
  { key: "gallery", label: "Gallery preview", visible: true, order: 6 },
  { key: "cta", label: "Membership call to action", visible: true, order: 7 },
];
