import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Users } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { TeamCard } from "@/components/site/team-card";
import { Reveal } from "@/components/site/reveal";
import { getTeam } from "@/lib/data";
import { COMMITTEES } from "@/lib/constants";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Our Team",
  description:
    "Meet the executive committee, trainers, organizers and active debaters of DCRGPI.",
  alternates: { canonical: "/team" },
};

const COMMITTEE_ORDER = [...COMMITTEES];

export default async function TeamPage() {
  const members = await getTeam({ activeOnly: true });

  const grouped: { committee: string; members: typeof members }[] = COMMITTEE_ORDER.map((committee) => ({
    committee,
    members: members.filter((member) => member.committee === committee),
  })).filter((group) => group.members.length > 0);

  const knownCommittees = new Set<string>(COMMITTEE_ORDER);
  const other = members.filter((member) => !knownCommittees.has(member.committee));
  if (other.length) grouped.push({ committee: "Other members", members: other });

  const leadership = members.slice(0, 3);

  return (
    <>
      <PageHero
        eyebrow="Our team"
        title={
          <>
            The voices behind <span className="gold-text italic">the club</span>
          </>
        }
        description="শিক্ষার্থী নেতা, প্রশিক্ষক ও বিতার্কিকরা নিজেদের সময় দেন যাতে প্রতিটি সদস্য নিজের কণ্ঠ খুঁজে পান। সেই কমিটির সঙ্গে পরিচিত হোন, যারা মঞ্চ সবসময় খোলা রাখে — আর মানদণ্ড ক্রমেই উঁচু করে।"
        breadcrumb={[{ label: "Our Team" }]}
      />

      {leadership.length > 0 && (
        <section className="border-b border-white/[0.06] py-14">
          <div className="container-narrow">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="eyebrow mb-3">Executive leadership</p>
                <h2 className="font-display text-2xl font-semibold text-cream sm:text-3xl">Leading from the front</h2>
              </div>
              <p className="text-xs uppercase tracking-[0.16em] text-cream/35">{members.length} active members</p>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {leadership.map((member, index) => (
                <Reveal key={member.id} delay={index * 0.07}>
                  <div className="surface relative flex h-full gap-5 p-5">
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-ink-700">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={member.photo || "/placeholder.svg"}
                        alt={member.name}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-gold-300">
                        {member.designation}
                      </p>
                      <h3 className="mt-1 font-display text-lg font-semibold text-cream">{member.name}</h3>
                      {member.department && <p className="mt-1 text-xs text-cream/45">{member.department}</p>}
                      <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-cream/55">{member.bio}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 sm:py-20">
        <div className="container-narrow">
          {grouped.length > 0 ? (
            <div className="space-y-16">
              {grouped.map((group, groupIndex) => (
                <div key={group.committee} id={group.committee.toLowerCase().replace(/[^a-z0-9]+/g, "-")}>
                  <Reveal>
                    <div className="mb-7 flex flex-wrap items-center gap-4 border-b border-white/[0.08] pb-4">
                      <span className="font-display text-sm text-gold-400/70">
                        {String(groupIndex + 1).padStart(2, "0")}
                      </span>
                      <h2 className="font-display text-2xl font-semibold text-cream">{group.committee}</h2>
                      <span className="rounded-full border border-white/10 px-2.5 py-1 text-[0.6rem] uppercase tracking-[0.14em] text-cream/40">
                        {group.members.length} {group.members.length === 1 ? "member" : "members"}
                      </span>
                    </div>
                  </Reveal>
                  <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
                    {group.members.map((member, index) => (
                      <Reveal key={member.id} delay={(index % 4) * 0.06}>
                        <TeamCard member={member} />
                      </Reveal>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-white/10 py-20 text-center">
              <Users className="mx-auto h-8 w-8 text-gold-400/50" />
              <p className="mt-4 font-display text-2xl text-cream/80">The committee is being updated</p>
              <p className="mt-2 text-sm text-cream/45">টিমের সঙ্গে পরিচিত হতে শিগগিরই আবার দেখুন।</p>
            </div>
          )}

          <div className="mt-20 flex flex-col items-center justify-between gap-6 rounded-2xl border border-gold-400/20 bg-gold-400/[0.05] p-8 sm:flex-row sm:p-10">
            <div>
              <p className="eyebrow mb-3">Build your leadership</p>
              <h2 className="font-display text-2xl font-semibold text-cream sm:text-3xl">
                Your name could be on this page
              </h2>
              <p className="mt-2 max-w-lg text-sm text-cream/55">
                প্রতিটি কমিটি সদস্যও একসময় প্রথমবারের বিতার্কিক হিসেবে শুরু করেছিলেন। পরবর্তী ব্যাচে যোগ দিন এবং আমাদের সঙ্গে বেড়ে উঠুন।
              </p>
            </div>
            <Link
              href="/register"
              className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-gold-400 px-6 text-sm font-bold text-ink-950 transition hover:bg-gold-300"
            >
              Apply now <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
