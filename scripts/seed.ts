/**
 * Seeds the DCRGPI database.
 *
 * Usage:
 *   npm run seed            # create missing documents, keep existing content
 *   npm run seed -- --force # wipe demo content collections and re-seed
 *
 * Requires MONGODB_URI (and ideally ADMIN_EMAIL / ADMIN_PASSWORD) in .env.local.
 */
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import {
  Activity,
  ContactMessage,
  Event,
  GalleryItem,
  Membership,
  Notice,
  Post,
  Settings,
  TeamMember,
  User,
} from "../lib/models";
import {
  DEFAULT_SETTINGS,
  SAMPLE_EVENTS,
  SAMPLE_GALLERY,
  SAMPLE_MEMBERSHIP,
  SAMPLE_MESSAGES,
  SAMPLE_NOTICES,
  SAMPLE_POSTS,
  SAMPLE_TEAM,
} from "../lib/sample-data";

const force = process.argv.includes("--force");

function toDate(value: string | null | undefined): Date | null {
  return value ? new Date(value) : null;
}

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME?.trim() || "Club Administrator";

  if (!email || !password) {
    console.warn(
      "⚠  ADMIN_EMAIL / ADMIN_PASSWORD are not set — skipping admin account. " +
        "Add them to .env.local and run `npm run seed` again to create the login."
    );
    return;
  }

  if (password.length < 8) {
    throw new Error("ADMIN_PASSWORD must be at least 8 characters long.");
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const existing = await User.findOne({ email }).select("+passwordHash");

  if (existing) {
    existing.name = name;
    existing.passwordHash = passwordHash;
    existing.role = "admin";
    await existing.save();
    console.log(`✓ Admin account updated: ${email}`);
    return;
  }

  await User.create({ name, email, passwordHash, role: "admin" });
  console.log(`✓ Admin account created: ${email}`);
}

async function seedSettings() {
  await Settings.findOneAndUpdate(
    { key: "site" },
    { $set: { key: "site", ...DEFAULT_SETTINGS } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  console.log("✓ Website settings ready");
}

async function seedCollection(
  label: string,
  model: { countDocuments: () => Promise<number>; deleteMany: (filter: object) => Promise<unknown>; insertMany: (docs: object[]) => Promise<unknown> },
  docs: object[]
) {
  const existing = await model.countDocuments();
  if (existing > 0 && !force) {
    console.log(`• ${label}: ${existing} existing document(s), skipped (use --force to re-seed)`);
    return;
  }
  if (existing > 0 && force) {
    await model.deleteMany({});
  }
  if (!docs.length) {
    console.log(`• ${label}: nothing to seed`);
    return;
  }
  await model.insertMany(docs);
  console.log(`✓ ${label}: inserted ${docs.length} document(s)`);
}

async function main() {
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) {
    throw new Error(
      "MONGODB_URI is not set. Add your MongoDB Atlas connection string to .env.local before seeding."
    );
  }

  console.log("Connecting to MongoDB…");
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10_000 });
  console.log("Connected.\n");

  await seedAdmin();
  await seedSettings();

  const posts = SAMPLE_POSTS.map(({ id: _id, ...post }) => ({
    ...post,
    publishedAt: toDate(post.publishedAt),
  }));

  const events = SAMPLE_EVENTS.map(({ id: _id, ...event }) => ({
    ...event,
    startDate: new Date(event.startDate),
    endDate: new Date(event.endDate),
    registrationDeadline: toDate(event.registrationDeadline),
  }));

  const team = SAMPLE_TEAM.map(({ id: _id, ...member }) => ({
    ...member,
    socialLinks: {
      facebook: member.socialLinks.facebook ?? "",
      linkedin: member.socialLinks.linkedin ?? "",
      x: member.socialLinks.x ?? "",
      instagram: member.socialLinks.instagram ?? "",
      email: member.socialLinks.email ?? "",
    },
  }));

  const gallery = SAMPLE_GALLERY.map(({ id: _id, ...item }) => ({
    ...item,
    uploadedAt: new Date(item.uploadedAt),
  }));

  const notices = SAMPLE_NOTICES.map(({ id: _id, ...notice }) => ({
    ...notice,
    publishedAt: toDate(notice.publishedAt),
    expiresAt: toDate(notice.expiresAt),
  }));

  const membership = SAMPLE_MEMBERSHIP.map(({ id: _id, ...application }) => ({
    ...application,
    submittedAt: new Date(application.submittedAt),
    reviewedAt: toDate(application.reviewedAt),
  }));

  const messages = SAMPLE_MESSAGES.map(({ id: _id, ...message }) => ({
    ...message,
    submittedAt: new Date(message.submittedAt),
  }));

  await seedCollection("Posts", Post, posts);
  await seedCollection("Events", Event, events);
  await seedCollection("Team members", TeamMember, team);
  await seedCollection("Gallery items", GalleryItem, gallery);
  await seedCollection("Notices", Notice, notices);
  await seedCollection("Membership applications", Membership, membership);
  await seedCollection("Contact messages", ContactMessage, messages);

  if (force) {
    await Activity.deleteMany({});
  }

  const activityCount = await Activity.countDocuments();
  if (activityCount === 0) {
    await Activity.create({
      action: "Seeded the website",
      entity: "System",
      detail: "Sample content and default settings installed",
      actor: "Seed script",
    });
  }

  console.log("\nSeeding complete.");
  console.log("Start the site with `npm run dev` and sign in at /admin/login.");
}

main()
  .catch((error) => {
    console.error("\n✗ Seeding failed:", error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect().catch(() => undefined);
  });
