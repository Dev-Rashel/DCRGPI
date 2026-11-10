import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BookOpen, CheckCircle2, GraduationCap, MessageSquareText, Mic2, Scale, Users } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { Reveal, SectionHeading } from "@/components/site/reveal";
import { getGallery, getSettings, getTeam } from "@/lib/data";
import { sanitizeRichText } from "@/lib/sanitize";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About the Club",
  description:
    "Learn about DCRGPI — our history, mission, values, debate formats and training opportunities.",
  alternates: { canonical: "/about" },
};

const FORMATS = [
  {
    name: "British Parliamentary",
    icon: Scale,
    description:
      "চার দল, দুটি বেঞ্চ, একটি মোশন। দ্রুত, কৌশলী এবং বিশ্ববিদ্যালয় পর্যায়ের প্রতিযোগিতার আদর্শ ফরম্যাট।",
  },
  {
    name: "Asian Parliamentary",
    icon: Users,
    description:
      "তিন বনাম তিন — বিষয়ভিত্তিক বক্তব্য ও কঠোর ক্রস-এক্সামিনেশনসহ। আমাদের সাপ্তাহিক প্র্যাকটিসের মূল ভিত্তি।",
  },
  {
    name: "Public Speaking",
    icon: Mic2,
    description:
      "প্রস্তুত ও তাৎক্ষণিক বক্তব্যের মাধ্যমে মঞ্চে উপস্থিতি, গঠন এবং গোটা হলকে মুগ্ধ করার আত্মবিশ্বাস গড়ে তোলা।",
  },
  {
    name: "World Schools",
    icon: GraduationCap,
    description:
      "স্কুল পর্যায়ের এই ফরম্যাটে স্পষ্টতা, বাগ্মিতা ও নীতিনিষ্ঠ যুক্তি শেখানো হয় — নতুন বিতার্কিকদের জন্য উপযুক্ত।",
  },
];

const TRAINING = [
  {
    title: "Weekly Debate Lab",
    description: "প্রতি বৃহস্পতিবার: মোশন বিশ্লেষণ, প্র্যাকটিস রাউন্ড এবং চাপমুক্ত পরিবেশে সহপাঠীদের মতামত।",
  },
  {
    title: "Mentorship pairing",
    description: "প্রতিটি নতুন সদস্যকে প্রথম মাসের প্রশিক্ষণ ও প্রতিযোগিতার জন্য একজন সিনিয়র বিতার্কিকের সঙ্গে জোড়া করা হয়।",
  },
  {
    title: "Adjudication workshops",
    description: "ধারাবাহিকতা ও সহানুভূতির সঙ্গে বিতর্ক বিচার করা শিখুন — এই দক্ষতা আপনার নিজের যুক্তকেও ধার দেয়।",
  },
  {
    title: "Tournament prep squads",
    description: "আঞ্চলিক ও জাতীয় প্রতিযোগিতার আগে নির্দিষ্ট কোচের তত্ত্বাবধানে নিবিড় প্রস্তুতি ক্যাম্প।",
  },
];

export default async function AboutPage() {
  const [settings, gallery, team] = await Promise.all([getSettings(), getGallery({ limit: 3 }), getTeam({ limit: 1 })]);
  const heroImage = gallery[0]?.imageUrl || settings.heroImage;

  return (
    <>
      <PageHero
        eyebrow="About the club"
        title={
          <>
            Built on arguments. <span className="gold-text italic">Bound by respect.</span>
          </>
        }
        description={settings.footerTagline}
        breadcrumb={[{ label: "About" }]}
      />

      <section className="py-20 sm:py-24">
        <div className="container-narrow">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <Reveal>
              <p className="eyebrow mb-5">Our story</p>
              <h2 className="text-display-md font-semibold text-cream">
                A decade of <span className="gold-text italic">fearless voices</span>
              </h2>
              <div
                className="prose-editorial mt-7"
                dangerouslySetInnerHTML={{ __html: sanitizeRichText(settings.aboutContent) }}
              />
              <p className="mt-6 border-l-2 border-gold-400/60 pl-5 font-display text-lg leading-relaxed text-cream/80">
                {settings.history}
              </p>
            </Reveal>

            <Reveal delay={0.12} className="relative">
              <div className="sticky top-28">
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/10">
                  {heroImage ? (
                    <Image
                      src={heroImage}
                      alt="DCRGPI members"
                      fill
                      sizes="(max-width: 1024px) 100vw, 45vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-ink-800" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-gold-300">
                      Rangpur Government Polytechnic Institute
                    </p>
                    <p className="mt-2 font-display text-2xl text-cream">
                      {team[0]?.name ?? "DCRGPI"}
                    </p>
                    <p className="text-sm text-cream/50">Club leadership</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {settings.stats.slice(0, 2).map((stat) => (
                    <div key={stat.label} className="surface p-5">
                      <p className="font-display text-3xl text-gold-300">
                        {stat.value}
                        {stat.suffix}
                      </p>
                      <p className="mt-1 text-[0.6rem] uppercase tracking-[0.16em] text-cream/40">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-y border-white/[0.06] bg-white/[0.012] py-20 sm:py-24">
        <div className="container-narrow grid gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="surface relative h-full overflow-hidden p-8">
              <span className="font-display text-7xl leading-none text-gold-400/15">M</span>
              <h2 className="mt-2 font-display text-2xl font-semibold text-cream">Our mission</h2>
              <p className="mt-4 text-base leading-relaxed text-cream/65">{settings.mission}</p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="surface relative h-full overflow-hidden p-8">
              <span className="font-display text-7xl leading-none text-gold-400/15">V</span>
              <h2 className="mt-2 font-display text-2xl font-semibold text-cream">Our vision</h2>
              <p className="mt-4 text-base leading-relaxed text-cream/65">{settings.vision}</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-20 sm:py-24">
        <div className="container-narrow grid gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <SectionHeading eyebrow="What drives us" title="Our objectives" description="পাঁচটি অঙ্গীকার, যা আমাদের প্রতিটি সেশন, ইভেন্ট ও সিদ্ধান্তকে গড়ে তোলে।" />
            <Link
              href="/register"
              className="mt-8 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-gold-300 hover:text-gold-200"
            >
              Join the next intake <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </Reveal>
          <div className="space-y-3">
            {settings.objectives.map((objective, index) => (
              <Reveal key={objective} delay={index * 0.05}>
                <div className="flex items-start gap-4 rounded-xl border border-white/[0.07] bg-white/[0.02] p-5">
                  <span className="mt-0.5 font-display text-sm font-semibold text-gold-400/70">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="text-sm leading-relaxed text-cream/70">{objective}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24">
        <div className="container-narrow">
          <Reveal>
            <SectionHeading
              eyebrow="Core values"
              title={
                <>
                  The rules we <span className="gold-text italic">live by</span>
                </>
              }
              description="বিতর্ক আইডিয়ার একটি খেলা। এই মূল্যবোধই এটিকে সৎ, মানবিক ও উপস্থিত থাকার মতো করে রাখে।"
              align="center"
            />
          </Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {settings.coreValues.map((value, index) => (
              <Reveal key={value.title} delay={index * 0.06}>
                <div className="surface group h-full p-7 transition hover:border-gold-400/30">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-display text-xl font-semibold text-cream">{value.title}</h3>
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-gold-400/60" />
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-cream/55">{value.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/[0.06] bg-white/[0.012] py-20 sm:py-24">
        <div className="container-narrow">
          <Reveal>
            <SectionHeading
              eyebrow="How we debate"
              title="Formats we train in"
              description="প্রথম তাৎক্ষণিক বক্তব্য থেকে জাতীয় সার্কিটের ফাইনাল — আমাদের প্রশিক্ষণে গুরুত্বপূর্ণ সব ফরম্যাটই অন্তর্ভুক্ত।"
            />
          </Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FORMATS.map((format, index) => (
              <Reveal key={format.name} delay={index * 0.06}>
                <div className="surface h-full p-6">
                  <format.icon className="h-6 w-6 text-gold-400" />
                  <h3 className="mt-5 font-display text-lg font-semibold text-cream">{format.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-cream/55">{format.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24">
        <div className="container-narrow grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal>
            <p className="eyebrow mb-5">Training</p>
            <h2 className="text-display-md font-semibold text-cream">
              Learn the craft, <br />
              <span className="gold-text italic">not just the tricks.</span>
            </h2>
            <p className="mt-5 text-base leading-relaxed text-cream/60">
              ক্লাবের প্রাণ হলো সুশৃঙ্খল ও নতুনদের উপযোগী প্রশিক্ষণ। আপনার অভিজ্ঞতা, নিখুঁত উচ্চারণ বা জন্মগত
              বক্তৃতার প্রতিভা লাগবে না — শুধু নিয়মিত উপস্থিত থাকতে হবে।
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/register"
                className="inline-flex h-11 items-center gap-2 rounded-full bg-gold-400 px-6 text-sm font-semibold text-ink-950 transition hover:bg-gold-300"
              >
                Apply now <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                href="/events"
                className="inline-flex h-11 items-center gap-2 rounded-full border border-white/15 px-6 text-sm font-semibold text-cream transition hover:border-gold-400/50"
              >
                <BookOpen className="h-4 w-4" /> See workshops
              </Link>
            </div>
          </Reveal>
          <div className="grid gap-3 sm:grid-cols-2">
            {TRAINING.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.06}>
                <div className="surface h-full p-6">
                  <MessageSquareText className="h-5 w-5 text-gold-400" />
                  <h3 className="mt-4 font-display text-lg font-semibold text-cream">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-cream/55">{item.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
