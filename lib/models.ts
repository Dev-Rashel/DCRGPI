import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

/* -------------------------------------------------------------------------- */
/*                                    User                                    */
/* -------------------------------------------------------------------------- */

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true, select: false },
    image: { type: String, default: "" },
    role: { type: String, enum: ["admin", "editor"], default: "admin" },
  },
  { timestamps: true }
);

export type UserDocument = InferSchemaType<typeof userSchema> & { _id: mongoose.Types.ObjectId };
export const User: Model<UserDocument> =
  (mongoose.models.User as Model<UserDocument>) || mongoose.model("User", userSchema);

/* -------------------------------------------------------------------------- */
/*                                  Settings                                  */
/* -------------------------------------------------------------------------- */

const navItemSchema = new Schema(
  {
    label: { type: String, required: true },
    href: { type: String, required: true },
    visible: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const sectionSettingSchema = new Schema(
  {
    key: { type: String, required: true },
    label: { type: String, required: true },
    visible: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const statSchema = new Schema(
  {
    label: { type: String, required: true },
    value: { type: Number, default: 0 },
    suffix: { type: String, default: "" },
  },
  { _id: false }
);

const socialLinkSchema = new Schema(
  {
    platform: { type: String, required: true },
    url: { type: String, required: true },
  },
  { _id: false }
);

const coreValueSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
  },
  { _id: false }
);

const settingsSchema = new Schema(
  {
    key: { type: String, default: "site", unique: true, index: true },
    logo: { type: String, default: "" },
    heroImage: { type: String, default: "" },
    heroImagePosition: { type: String, enum: ["center", "top", "bottom"], default: "center" },
    heroOverlay: { type: Number, default: 72, min: 0, max: 95 },
    heroEyebrow: { type: String, default: "" },
    heroTitle: { type: String, default: "" },
    heroSubtitle: { type: String, default: "" },
    heroPrimaryCtaText: { type: String, default: "Join the Club" },
    heroPrimaryCtaHref: { type: String, default: "/register" },
    heroSecondaryCtaText: { type: String, default: "Explore Events" },
    heroSecondaryCtaHref: { type: String, default: "/events" },
    aboutContent: { type: String, default: "" },
    history: { type: String, default: "" },
    mission: { type: String, default: "" },
    vision: { type: String, default: "" },
    objectives: { type: [String], default: [] },
    coreValues: { type: [coreValueSchema], default: [] },
    footerTagline: { type: String, default: "" },
    footerText: { type: String, default: "" },
    instituteInfo: { type: String, default: "" },
    copyright: { type: String, default: "" },
    contactInfo: {
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
      address: { type: String, default: "" },
      mapUrl: { type: String, default: "" },
    },
    socialLinks: { type: [socialLinkSchema], default: [] },
    navItems: { type: [navItemSchema], default: [] },
    sectionSettings: { type: [sectionSettingSchema], default: [] },
    stats: { type: [statSchema], default: [] },
    themeAccent: { type: String, default: "#eec46a" },
  },
  { timestamps: true }
);

export type SettingsDocument = InferSchemaType<typeof settingsSchema> & { _id: mongoose.Types.ObjectId };
export const Settings: Model<SettingsDocument> =
  (mongoose.models.Settings as Model<SettingsDocument>) ||
  mongoose.model("Settings", settingsSchema);

/* -------------------------------------------------------------------------- */
/*                                    Post                                    */
/* -------------------------------------------------------------------------- */

const postSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    category: { type: String, required: true, index: true },
    coverImage: { type: String, default: "" },
    excerpt: { type: String, default: "" },
    content: { type: String, required: true },
    authorId: { type: String, default: "" },
    authorName: { type: String, default: "Club Media Desk" },
    status: { type: String, enum: ["draft", "published"], default: "draft", index: true },
    isFeatured: { type: Boolean, default: false },
    publishedAt: { type: Date, default: null, index: true },
  },
  { timestamps: true }
);

postSchema.index({ status: 1, publishedAt: -1 });
postSchema.index({ title: "text", excerpt: "text", content: "text" });

export type PostDocument = InferSchemaType<typeof postSchema> & { _id: mongoose.Types.ObjectId };
export const Post: Model<PostDocument> =
  (mongoose.models.Post as Model<PostDocument>) || mongoose.model("Post", postSchema);

/* -------------------------------------------------------------------------- */
/*                                    Event                                   */
/* -------------------------------------------------------------------------- */

const eventSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    category: { type: String, required: true, index: true },
    description: { type: String, required: true },
    image: { type: String, default: "" },
    startDate: { type: Date, required: true, index: true },
    endDate: { type: Date, required: true },
    venue: { type: String, required: true },
    registrationDeadline: { type: Date, default: null },
    capacity: { type: Number, default: 0 },
    status: { type: String, enum: ["draft", "published"], default: "draft", index: true },
    registrationStatus: {
      type: String,
      enum: ["open", "closed", "coming-soon"],
      default: "coming-soon",
    },
    rules: { type: String, default: "" },
  },
  { timestamps: true }
);

eventSchema.index({ status: 1, startDate: 1 });

export type EventDocument = InferSchemaType<typeof eventSchema> & { _id: mongoose.Types.ObjectId };
export const Event: Model<EventDocument> =
  (mongoose.models.Event as Model<EventDocument>) || mongoose.model("Event", eventSchema);

/* -------------------------------------------------------------------------- */
/*                            Membership application                          */
/* -------------------------------------------------------------------------- */

const membershipSchema = new Schema(
  {
    referenceNo: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    studentId: { type: String, required: true, trim: true, index: true },
    department: { type: String, required: true },
    semester: { type: String, required: true },
    group: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    phone: { type: String, required: true, trim: true },
    photo: { type: String, default: "" },
    fatherName: { type: String, required: true, trim: true },
    motherName: { type: String, required: true, trim: true },
    hasDebateExperience: { type: String, enum: ["yes", "no"], default: "no" },
    canCommitTime: { type: String, enum: ["yes", "no"], default: "yes" },
    experience: { type: String, default: "" },
    motivation: { type: String, required: true },
    activities: { type: String, default: "" },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending", index: true },
    submittedAt: { type: Date, default: Date.now, index: true },
    reviewedAt: { type: Date, default: null },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

membershipSchema.index({ email: 1, studentId: 1 });

export type MembershipDocument = InferSchemaType<typeof membershipSchema> & {
  _id: mongoose.Types.ObjectId;
};
export const Membership: Model<MembershipDocument> =
  (mongoose.models.Membership as Model<MembershipDocument>) ||
  mongoose.model("Membership", membershipSchema);

/* -------------------------------------------------------------------------- */
/*                                Team member                                 */
/* -------------------------------------------------------------------------- */

const teamSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    designation: { type: String, required: true },
    committee: { type: String, required: true, index: true },
    photo: { type: String, default: "" },
    bio: { type: String, default: "" },
    department: { type: String, default: "" },
    socialLinks: {
      facebook: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      x: { type: String, default: "" },
      instagram: { type: String, default: "" },
      email: { type: String, default: "" },
    },
    displayOrder: { type: Number, default: 0, index: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export type TeamDocument = InferSchemaType<typeof teamSchema> & { _id: mongoose.Types.ObjectId };
export const TeamMember: Model<TeamDocument> =
  (mongoose.models.TeamMember as Model<TeamDocument>) ||
  mongoose.model("TeamMember", teamSchema);

/* -------------------------------------------------------------------------- */
/*                                   Gallery                                  */
/* -------------------------------------------------------------------------- */

const gallerySchema = new Schema(
  {
    imageUrl: { type: String, required: true },
    caption: { type: String, default: "" },
    album: { type: String, default: "Campus Events", index: true },
    eventId: { type: String, default: "" },
    displayOrder: { type: Number, default: 0, index: true },
    uploadedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export type GalleryDocument = InferSchemaType<typeof gallerySchema> & { _id: mongoose.Types.ObjectId };
export const GalleryItem: Model<GalleryDocument> =
  (mongoose.models.GalleryItem as Model<GalleryDocument>) ||
  mongoose.model("GalleryItem", gallerySchema);

/* -------------------------------------------------------------------------- */
/*                                   Notice                                   */
/* -------------------------------------------------------------------------- */

const noticeSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    status: { type: String, enum: ["draft", "published"], default: "published", index: true },
    isImportant: { type: Boolean, default: false, index: true },
    publishedAt: { type: Date, default: Date.now, index: true },
    expiresAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export type NoticeDocument = InferSchemaType<typeof noticeSchema> & { _id: mongoose.Types.ObjectId };
export const Notice: Model<NoticeDocument> =
  (mongoose.models.Notice as Model<NoticeDocument>) || mongoose.model("Notice", noticeSchema);

/* -------------------------------------------------------------------------- */
/*                             Event registrations                            */
/* -------------------------------------------------------------------------- */

const eventRegistrationSchema = new Schema(
  {
    eventId: { type: String, required: true, index: true },
    eventTitle: { type: String, default: "" },
    name: { type: String, required: true, trim: true },
    studentId: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    department: { type: String, default: "" },
    referenceNo: { type: String, required: true, unique: true },
    status: { type: String, enum: ["confirmed", "cancelled"], default: "confirmed" },
  },
  { timestamps: true }
);

eventRegistrationSchema.index({ eventId: 1, email: 1 }, { unique: true });

export type EventRegistrationDocument = InferSchemaType<typeof eventRegistrationSchema> & {
  _id: mongoose.Types.ObjectId;
};
export const EventRegistration: Model<EventRegistrationDocument> =
  (mongoose.models.EventRegistration as Model<EventRegistrationDocument>) ||
  mongoose.model("EventRegistration", eventRegistrationSchema);

/* -------------------------------------------------------------------------- */
/*                              Contact messages                              */
/* -------------------------------------------------------------------------- */

const contactSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ["unread", "read"], default: "unread", index: true },
    submittedAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true }
);

export type ContactDocument = InferSchemaType<typeof contactSchema> & { _id: mongoose.Types.ObjectId };
export const ContactMessage: Model<ContactDocument> =
  (mongoose.models.ContactMessage as Model<ContactDocument>) ||
  mongoose.model("ContactMessage", contactSchema);

/* -------------------------------------------------------------------------- */
/*                                  Activity                                  */
/* -------------------------------------------------------------------------- */

const activitySchema = new Schema(
  {
    action: { type: String, required: true },
    entity: { type: String, required: true },
    detail: { type: String, default: "" },
    actor: { type: String, default: "System" },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export type ActivityDocument = InferSchemaType<typeof activitySchema> & {
  _id: mongoose.Types.ObjectId;
};
export const Activity: Model<ActivityDocument> =
  (mongoose.models.Activity as Model<ActivityDocument>) ||
  mongoose.model("Activity", activitySchema);
