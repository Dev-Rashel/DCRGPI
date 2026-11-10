import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, ArrowUpRight, Compass, Gem, Quote, Target } from "lucide-react";
import type { EventDTO, GalleryItemDTO, NoticeDTO, PostDTO, SiteSettings, TeamMemberDTO } from "@/lib/types";
import { PostCard } from "./post-card";
import { EventCard } from "./event-card";
import { TeamCard } from "./team-card";
import { MembershipCta } from "./membership-cta";
import { Counter, Reveal, SectionHeading } from "./reveal";
import { sanitizeRichText } from "@/lib/sanitize";
import { formatDate } from "@/lib/utils";

export function AboutSection({ settings }: { settings: SiteSettings }) {
  return (
    <section id="about" className="relative scroll-mt-24 py-20 sm:py-28">
      <div className="container-narrow">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <Reveal>
            <p className="eyebrow mb-5">Who we are</p>
            <h2 className="text-display-md font-semibold text-cream">
              More than a club. <br />
              <span className="gold-text italic">A way of thinking.</span>
            </h2>
            <div
              className="prose-editorial mt-7"
              dangerouslySetInnerHTML={{ __html: sanitizeRichText(settings.aboutContent) }}
            />
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/about"
                className="group inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-cream transition hover:border-gold-400/50 hover:text-gold-200"
              >
                Our story <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/team"
                className="inline-flex items-center gap-2 px-2 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-cream/50 transition hover:text-gold-300"
              >
                Meet the team <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2">
            <Reveal delay={0.08} className="sm:col-span-2">
              <div className="surface relative overflow-hidden p-7">
                <Quote className="absolute right-5 top-5 h-10 w-10 text-gold-400/15" />
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-gold-300">Our mission</p>
                <p className="mt-3 font-display text-xl leading-relaxed text-cream/90">{settings.mission}</p>
              </div>
            </Reveal>
            <Reveal delay={0.14}>
              <div className="surface h-full p-6">
                <Target className="h-5 w-5 text-gold-400" />
                <p className="mt-4 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-cream/40">Vision</p>
                <p className="mt-2 text-sm leading-relaxed text-cream/70">{settings.vision}</p>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="surface h-full p-6">
                <Compass className="h-5 w-5 text-gold-400" />
                <p className="mt-4 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-cream/40">Our values</p>
                <ul className="mt-2 space-y-2 text-sm text-cream/70">
                  {settings.coreValues.slice(0, 3).map((value) => (
                    <li key={value.title} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold-400" />
                      {value.title}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={0.26} className="sm:col-span-2">
              <div className="surface flex items-start gap-4 p-6">
                <Gem className="mt-0.5 h-5 w-5 shrink-0 text-gold-400" />
                <div>
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-cream/40">Since 2019</p>
                  <p className="mt-2 text-sm leading-relaxed text-cream/60">{settings.history}</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

export function TeamPreview({ members }: { members: TeamMemberDTO[] }) {
  if (!members.length) return null;
  return (
    <section id="team" className="relative scroll-mt-24 border-y border-white/[0.06] bg-white/[0.012] py-20 sm:py-28">
      <div className="container-narrow">
        <Reveal>
          <SectionHeading
            eyebrow="Club leadership"
            title={
              <>
                The people behind <span className="gold-text italic">the podium</span>
              </>
            }
            description="শিক্ষার্থী নেতা, প্রশিক্ষক ও বিতার্কিকদের একটি দল — যারা ক্লাবকে এগিয়ে নিয়ে যায় এবং প্রতিটি নতুন কণ্ঠকে ন্যায্য সুযোগ নিশ্চিত করে।"
            action={
              <Link
                href="/team"
                className="group inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-cream transition hover:border-gold-400/50 hover:text-gold-200"
              >
                View the full team <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            }
          />
        </Reveal>
        <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {members.slice(0, 4).map((member, index) => (
            <Reveal key={member.id} delay={index * 0.07}>
              <TeamCard member={member} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function StatsSection({ settings }: { settings: SiteSettings }) {
  if (!settings.stats.length) return null;
  return (
    <section id="stats" className="relative overflow-hidden py-20 sm:py-24">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden>
        <span className="select-none font-display text-[22vw] font-bold leading-none text-white/[0.018]">DCRGPI</span>
      </div>
      <div className="container-narrow relative">
        <Reveal>
          <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow mb-4">By the numbers</p>
              <h2 className="text-display-md font-semibold text-cream">A record built on voices</h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-cream/50">
              বছরের পর বছর প্র্যাকটিস, রাত জেগে গবেষণা আর দাঁড়িয়ে থাকা করতালি — প্রতিটি মুহূর্তে গড়ে উঠেছে আমাদের সদস্যরা।
            </p>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.06] lg:grid-cols-4">
          {settings.stats.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 0.08} className="bg-ink-900">
              <div className="flex h-full flex-col justify-between gap-6 p-6 sm:p-8">
                <Counter
                  value={stat.value}
                  suffix={stat.suffix}
                  className="font-display text-4xl font-semibold text-gold-300 sm:text-5xl"
                />
                <p className="text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-cream/45">{stat.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LatestPosts({ posts }: { posts: PostDTO[] }) {
  return (
    <section id="posts" className="scroll-mt-24 border-t border-white/[0.06] py-20 sm:py-28">
      <div className="container-narrow">
        <Reveal>
          <SectionHeading
            eyebrow="From the club"
            title={
              <>
                Latest <span className="gold-text italic">stories</span>
              </>
            }
            description="ঘোষণা, অর্জন, বিতর্কের রিসোর্স ও ক্লাবের ভেতরে যা কিছু ঘটছে — সবকিছু এক জায়গায়।"
            action={
              <Link
                href="/posts"
                className="group inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-cream transition hover:border-gold-400/50 hover:text-gold-200"
              >
                All posts <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            }
          />
        </Reveal>
        {posts.length ? (
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.slice(0, 6).map((post, index) => (
              <Reveal key={post.id} delay={(index % 3) * 0.07}>
                <PostCard post={post} priority={index < 3} />
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="mt-12 rounded-2xl border border-dashed border-white/10 p-10 text-center text-sm text-cream/50">
            এখনো কোনো গল্প প্রকাশিত হয়নি। শিগগিরই আবার দেখুন।
          </p>
        )}
      </div>
    </section>
  );
}

export function UpcomingEvents({ events }: { events: EventDTO[] }) {
  return (
    <section id="events" className="scroll-mt-24 border-t border-white/[0.06] bg-white/[0.012] py-20 sm:py-28">
      <div className="container-narrow">
        <Reveal>
          <SectionHeading
            eyebrow="What's next"
            title={
              <>
                Upcoming <span className="gold-text italic">events</span>
              </>
            }
            description="টুর্নামেন্ট, ওয়ার্কশপ ও উন্মুক্ত সেশন। খুঁজে নিন আপনার পরের মঞ্চ।"
            action={
              <Link
                href="/events"
                className="group inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-cream transition hover:border-gold-400/50 hover:text-gold-200"
              >
                All events <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            }
          />
        </Reveal>
        {events.length ? (
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {events.slice(0, 3).map((event, index) => (
              <Reveal key={event.id} delay={index * 0.08}>
                <EventCard event={event} />
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="mt-12 rounded-2xl border border-dashed border-white/10 p-10 text-center text-sm text-cream/50">
            এখন কোনো আসন্ন ইভেন্ট নেই। নতুন ঘোষণার জন্য আমাদের সোশ্যাল পেজ ফলো করুন।
          </p>
        )}
      </div>
    </section>
  );
}

export function GalleryPreview({ items }: { items: GalleryItemDTO[] }) {
  if (!items.length) return null;
  return (
    <section id="gallery" className="scroll-mt-24 py-20 sm:py-28">
      <div className="container-narrow">
        <Reveal>
          <SectionHeading
            eyebrow="Moments"
            title={
              <>
                From the floor, <span className="gold-text italic">in frames</span>
              </>
            }
            description="প্রতিযোগিতা, ওয়ার্কশপ আর তার মাঝের নীরব মুহূর্তগুলো — ক্লাব জীবনের এক ঝলক।"
            action={
              <Link
                href="/gallery"
                className="group inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-cream transition hover:border-gold-400/50 hover:text-gold-200"
              >
                Full gallery <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            }
          />
        </Reveal>
        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {items.slice(0, 6).map((item, index) => (
            <Reveal
              key={item.id}
              delay={index * 0.05}
              className={index === 0 ? "col-span-2 row-span-2 sm:col-span-2 sm:row-span-2" : ""}
            >
              <Link
                href="/gallery"
                className="group relative block aspect-square h-full overflow-hidden rounded-xl border border-white/[0.07]"
              >
                <Image
                  src={item.imageUrl}
                  alt={item.caption || "Club gallery photo"}
                  fill
                  sizes="(max-width: 640px) 50vw, 33vw"
                  className="object-cover transition duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-transparent to-transparent opacity-70 transition group-hover:opacity-95" />
                <div className="absolute inset-x-0 bottom-0 translate-y-2 p-4 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <p className="text-[0.6rem] uppercase tracking-[0.16em] text-gold-300">{item.album}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-cream/80">{item.caption}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function NoticesSection({ notices }: { notices: NoticeDTO[] }) {
  if (!notices.length) return null;
  return (
    <section id="notices" className="scroll-mt-24 border-t border-white/[0.06] py-16">
      <div className="container-narrow">
        <Reveal>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="eyebrow mb-3">Notice board</p>
              <h2 className="font-display text-2xl font-semibold text-cream sm:text-3xl">Updates & announcements</h2>
            </div>
            <p className="text-xs uppercase tracking-[0.16em] text-cream/35">Updated regularly</p>
          </div>
        </Reveal>
        <div className="mt-8 grid gap-3">
          {notices.slice(0, 4).map((notice, index) => (
            <Reveal key={notice.id} delay={index * 0.05}>
              <div className="flex flex-col gap-2 rounded-xl border border-white/[0.07] bg-white/[0.02] p-5 sm:flex-row sm:items-center sm:gap-6">
                <div className="flex shrink-0 items-center gap-3 sm:w-40">
                  {notice.isImportant && (
                    <span className="rounded-full bg-gold-400/15 px-2.5 py-1 text-[0.55rem] font-bold uppercase tracking-[0.14em] text-gold-300">
                      Important
                    </span>
                  )}
                  <span className="text-[0.65rem] uppercase tracking-[0.14em] text-cream/35">
                    {formatDate(notice.publishedAt)}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-cream/90">{notice.title}</p>
                  <p className="mt-1 text-sm text-cream/55">{notice.content}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SectionRenderer({
  settings,
  data,
}: {
  settings: SiteSettings;
  data: {
    posts: PostDTO[];
    events: EventDTO[];
    team: TeamMemberDTO[];
    gallery: GalleryItemDTO[];
  };
}) {
  const map: Record<string, ReactNode> = {
    about: <AboutSection settings={settings} />,
    team: <TeamPreview members={data.team} />,
    stats: <StatsSection settings={settings} />,
    posts: <LatestPosts posts={data.posts} />,
    events: <UpcomingEvents events={data.events} />,
    gallery: <GalleryPreview items={data.gallery} />,
    cta: <MembershipCta />,
  };

  return (
    <>
      {[...settings.sectionSettings]
        .sort((a, b) => a.order - b.order)
        .filter((section) => section.visible && map[section.key])
        .map((section) => (
          <div key={section.key}>{map[section.key]}</div>
        ))}
    </>
  );
}
