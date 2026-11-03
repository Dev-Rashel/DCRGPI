# Debating Club of RPI — Website & Content Management System

The official website of the **Debating Club of RPI**, Rangpur Government Polytechnic Institute — plus a complete admin panel for managing every piece of content on the site.

Built with Next.js (App Router), TypeScript, Tailwind CSS, MongoDB/Mongoose, Zod and Framer Motion.

---

## Features

### Public website

| Route | What it does |
| --- | --- |
| `/` | Hero, notices, about preview, leadership, animated statistics, latest posts, upcoming events, gallery preview and membership call-to-action — section visibility and order are managed from the admin panel. |
| `/about` | Club story, mission, vision, objectives and core values. |
| `/posts` | Searchable, filterable and paginated article archive. |
| `/posts/[slug]` | Article detail with rich text, cover image, reading time and share links. |
| `/events` | Upcoming / ongoing / past event explorer with category filters. |
| `/events/[slug]` | Event detail, schedule, venue, rules, capacity and public registration. |
| `/team` | Leadership and member profiles grouped by committee. |
| `/gallery` | Album-filtered photo gallery with an accessible lightbox. |
| `/register` | Online membership application with validation and reference number. |
| `/contact` | Contact form plus email, phone, address and social links. |

Everything is responsive (mobile → desktop), animated with Framer Motion, and animations are disabled automatically for visitors who set `prefers-reduced-motion`.

### Admin panel (`/admin`)

| Section | Capabilities |
| --- | --- |
| Dashboard | Content counts, pending applications, unread messages, upcoming events, recent activity and quick actions. |
| Posts | Create, edit, preview, publish/unpublish and delete posts; search, category/status filters and pagination. |
| Events | Create, edit, publish/unpublish and delete events; manage registrations and participant lists; CSV export. |
| Leadership | Add/edit/delete team members, toggle visibility and reorder profiles. |
| Membership | Review applications, add notes, approve/reject, delete and export to CSV. |
| Gallery | Upload images (Cloudinary) or use URLs, edit captions/albums, link to events, reorder and delete. |
| Notices | Create/schedule/expire notices, set importance, publish/unpublish and delete. |
| Messages | Read/unread states, full message view, reply by email, delete and CSV export. |
| Settings | Branding, logo, hero text/image/CTAs, about/mission/vision, objectives, core values, statistics, homepage section visibility/order, contact details, social links, footer and navigation. |
| Login | Email/password authentication with rate limiting and httpOnly session cookies. |

All writes go through REST API route handlers with Zod validation, HTML sanitisation, authentication checks, duplicate prevention, confirmation dialogs and toast feedback.

---

## Tech stack

- **Framework:** Next.js 15 (App Router, Server Components, Route Handlers)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 3 + hand-built shadcn/ui-style primitives
- **Icons / motion:** Lucide React, Framer Motion
- **Database:** MongoDB Atlas via Mongoose
- **Validation:** Zod + React Hook Form
- **Auth:** signed JWT session cookies (`jose`) + bcrypt password hashing
- **Media:** Cloudinary (signed server-side uploads)
- **Notifications:** Sonner
- **Sanitisation:** sanitize-html

---

## Getting started

### 1. Requirements

- Node.js 20 or newer
- npm 10 or newer
- A MongoDB Atlas account (free tier is fine)
- A Cloudinary account (free tier is fine) — optional for local exploration

### 2. Install

```bash
git clone <your-repository-url> dcrpi
cd dcrpi
npm install
```

### 3. Environment variables

Copy the example file:

```bash
copy .env.example .env.local   # Windows
cp .env.example .env.local     # macOS / Linux
```

Fill in `.env.local`:

| Variable | Required | Purpose |
| --- | --- | --- |
| `MONGODB_URI` | Yes (for persistence) | MongoDB Atlas connection string, e.g. `mongodb+srv://user:pass@cluster.mongodb.net/dcrpi?retryWrites=true&w=majority`. |
| `AUTH_SECRET` | Yes in production | Random secret used to sign admin sessions. Generate with `openssl rand -base64 32`. Minimum 16 characters; use 32+. |
| `NEXT_PUBLIC_SITE_URL` | Yes | Public base URL, e.g. `http://localhost:3000` locally or `https://dcrpi.vercel.app` in production. Used for metadata, sitemap and absolute links. |
| `ADMIN_NAME` | Recommended | Display name for the seeded administrator. |
| `ADMIN_EMAIL` | Yes for seeding | Email address for the administrator account. |
| `ADMIN_PASSWORD` | Yes for seeding | Administrator password (minimum 8 characters). Never commit this. |
| `CLOUDINARY_CLOUD_NAME` | For uploads | Cloudinary cloud name. |
| `CLOUDINARY_API_KEY` | For uploads | Cloudinary API key. |
| `CLOUDINARY_API_SECRET` | For uploads | Cloudinary API secret. |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Optional | Reserved for future Google sign-in; not enabled yet. |

> **Never commit `.env.local`.** It is already listed in `.gitignore`. `.env.example` only contains empty placeholders.

### 4. Seed the database

```bash
npm run seed
```

This creates or updates:

- the administrator account from `ADMIN_EMAIL` / `ADMIN_PASSWORD`
- the default website settings
- sample posts, events, team profiles, gallery items, notices, membership applications and contact messages

Re-running the command is safe: existing content is skipped. Use `npm run seed -- --force` to wipe demo content collections and re-seed them (users and settings are kept).

### 5. Run locally

```bash
npm run dev
```

- Website: <http://localhost:3000>
- Admin: <http://localhost:3000/admin> (redirects to the login page)

Sign in with the `ADMIN_EMAIL` / `ADMIN_PASSWORD` you configured.

---

## Demo / preview mode

If `MONGODB_URI` is **not** set, the public website still renders using bundled sample content from `lib/sample-data.ts`. This makes it possible to review the design before creating any accounts.

In this mode:

- Public pages work normally.
- Admin login works **only** if `ADMIN_EMAIL` and `ADMIN_PASSWORD` are set in the environment.
- All content is read-only: write API routes return `503` and the admin UI disables save/delete actions.
- Nothing you edit is persisted.

Add a real `MONGODB_URI` and run `npm run seed` to switch to full CMS mode.

---

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server. |
| `npm run build` | Create a production build. |
| `npm run start` | Serve the production build. |
| `npm run lint` | Run the TypeScript compiler (`tsc --noEmit`). |
| `npm run seed` | Seed admin/settings/sample content. Add `-- --force` to re-seed content. |

---

## Project structure

```
app/
  (site)/               Public website routes and layouts
  admin/
    login/              Admin login page
    (panel)/            Protected dashboard, content managers and settings
  api/                  REST route handlers
  layout.tsx            Root layout, fonts, metadata, toaster
  robots.ts, sitemap.ts SEO endpoints
components/
  site/                 Public site components
  admin/                Admin managers, forms and shared UI
  ui/                   shadcn-style primitives
lib/
  auth.ts               JWT session helpers
  db.ts                 Cached Mongoose connection
  models.ts             Mongoose schemas
  data.ts               Server-side data access with demo fallbacks
  validation.ts         Zod schemas
  sanitize.ts           Rich-text sanitisation
  sample-data.ts        Default settings and demo content
scripts/seed.ts         Database seeding
middleware.ts           Admin route protection
```

---

## API overview

### Public

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/posts` | Published posts (`page`, `limit`, `category`, `q`, `sort`, `featured`). |
| `GET` | `/api/posts/[slug]` | Single published post. |
| `GET` | `/api/events` | Published events (`phase`, `category`, `q`). |
| `GET` | `/api/events/[slug]` | Single published event. |
| `POST` | `/api/events/[slug]/register` | Register a participant for an event. |
| `GET` | `/api/team` | Active team members. |
| `GET` | `/api/gallery` | Gallery items. |
| `GET` | `/api/notices` | Active, published notices. |
| `GET` | `/api/settings` | Public website settings. |
| `POST` | `/api/membership` | Submit a membership application. |
| `POST` | `/api/contact` | Send a contact message. |

### Authentication

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/auth/login` | Sign in and set the session cookie. |
| `POST` | `/api/auth/logout` | Clear the session cookie. |
| `GET` | `/api/auth/me` | Current session user. |

### Admin (requires a valid session)

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST/PATCH/DELETE` | `/api/posts`, `/api/posts/[slug]` | Post CRUD and publishing. |
| `POST/PATCH/DELETE` | `/api/events`, `/api/events/[slug]` | Event CRUD and publishing. |
| `POST/PATCH` | `/api/team`, `/api/team/[id]` | Team member CRUD and reordering. |
| `POST/PATCH/DELETE` | `/api/gallery`, `/api/gallery/[id]` | Gallery CRUD and reordering. |
| `POST/PATCH/DELETE` | `/api/notices`, `/api/notices/[id]` | Notice CRUD and publishing. |
| `PATCH` | `/api/settings` | Update website settings. |
| `GET/PATCH/DELETE` | `/api/admin/membership` | Review, approve/reject and delete applications. |
| `GET` | `/api/admin/membership/export` | CSV export of applications. |
| `GET/PATCH/DELETE` | `/api/admin/messages` | Read/unread, delete contact messages. |
| `GET/PATCH/DELETE` | `/api/admin/event-registrations` | Manage event participants. |
| `POST` | `/api/upload` | Signed Cloudinary image upload. |

> Route handlers use the same path segment for both slugs and Mongo IDs where practical. Public reads are `GET`; mutations are validated, authenticated and sanitised.

---

## Security notes

- Admin pages and `/api/admin/*` are protected by `middleware.ts` **and** re-checked inside route handlers (`adminGuard`), so the protection is not client-side only.
- Sessions are signed with `jose` and stored in an `httpOnly`, `sameSite=lax`, `secure` (production) cookie. They expire after 8 hours.
- Passwords are hashed with bcrypt (cost factor 12).
- Login attempts are rate limited per IP.
- All rich-text HTML is sanitised on write before storage.
- Zod validates every mutation payload; duplicate slugs/reference numbers are rejected.
- Admin pages send `noindex` headers and are excluded from `robots.txt` and the sitemap.
- Delete actions require explicit confirmation; feedback is shown with toasts.
- Secrets live only in environment variables; `.env.local` is ignored by git.
- Image uploads are signed server-side; Cloudinary secrets never reach the browser.

---

## Deployment (GitHub + Vercel)

1. **Create the repository** and push the project (`.env.local` must remain untracked).
2. **Create a MongoDB Atlas cluster**, add a database user and allow your deployment IPs (or `0.0.0.0/0` for a quick start). Copy the connection string.
3. **Create a Cloudinary account** and copy the cloud name, API key and API secret.
4. **Import the repository into Vercel.**
5. Add the environment variables from the table above in **Vercel → Project → Settings → Environment Variables**. Set `NEXT_PUBLIC_SITE_URL` to the production domain.
6. Deploy. Then run the seed command once against production, for example:

   ```bash
   MONGODB_URI="..." ADMIN_EMAIL="..." ADMIN_PASSWORD="..." ADMIN_NAME="..." npm run seed
   ```

   (Or run it locally with production values in `.env.local`, then remove them.)
7. Open `/admin/login` on the production domain and sign in.

### Production checklist

- [ ] `AUTH_SECRET` is a long random value and differs from development.
- [ ] `NEXT_PUBLIC_SITE_URL` points at the real domain (not localhost).
- [ ] `ADMIN_PASSWORD` is strong; consider changing it after the first login.
- [ ] MongoDB Atlas network access is restricted to trusted addresses.
- [ ] Cloudinary credentials are set and uploads work.
- [ ] `npm run build` passes locally.
- [ ] A backup/export routine exists for Atlas data.

---

## Design & content management notes

- The public site reads settings on every request (`force-dynamic`), so changes saved in **Admin → Settings** appear immediately.
- Homepage sections can be hidden or reordered; notices are always rendered separately at the top.
- Posts, events and notices support drafts. Drafts are never returned by public GET endpoints.
- Rich-text content is stored as sanitised HTML and rendered on the public site.
- Images can be uploaded to Cloudinary or referenced by URL; remote image hosts are allow-listed in `next.config.ts`.
- `prefers-reduced-motion` is respected throughout the site.

## Implementation notes / deviations from the brief

- **Authentication:** the brief listed Auth.js / Better Auth as options. This project uses a small, auditable JWT implementation (`jose` + bcryptjs) so it works reliably in server components, middleware and route handlers without an external auth service or a live database at build time.
- **Event registrations:** an additional `EventRegistration` model and admin screens were added so event participant lists and registrations can be managed, as required by the admin features.
- **Google OAuth:** environment variables are reserved, but Google sign-in is not enabled. Email/password login is the supported flow.
- **Testing:** the build and TypeScript checks pass. Database seeding, Cloudinary uploads and live persistence require real credentials and therefore must be verified in your environment.

## License

Created for the Debating Club of RPI. All content and branding belong to the club.
