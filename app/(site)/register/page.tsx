import type { Metadata } from "next";
import { CheckCircle2, Clock, FileText, MessageCircle, ShieldCheck, Users } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { MembershipForm } from "@/components/site/membership-form";
import { Reveal } from "@/components/site/reveal";

export const metadata: Metadata = {
  title: "Join the Club",
  description:
    "Apply for membership of the Debating Club of RPI. Open to every student of Rangpur Government Polytechnic Institute.",
  alternates: { canonical: "/register" },
};

const STEPS = [
  {
    icon: FileText,
    title: "Submit your application",
    description: "Fill in the form with your details and tell us why you want to join.",
  },
  {
    icon: MessageCircle,
    title: "We get in touch",
    description: "Our membership secretary reviews applications and contacts shortlisted students.",
  },
  {
    icon: Users,
    title: "Orientation session",
    description: "Meet the committee and your mentor, and get your first taste of the Debate Lab.",
  },
  {
    icon: CheckCircle2,
    title: "Welcome to the club",
    description: "Attend weekly sessions, compete, and start building your debating record.",
  },
];

const BENEFITS = [
  "Weekly training in parliamentary debate and public speaking",
  "A personal mentor for your first month",
  "Priority entry to club workshops and competitions",
  "Certificates for participation and achievement",
  "A community from every department of RPI",
  "Access to our resource library and practice motions",
];

export default function RegisterPage() {
  return (
    <>
      <PageHero
        eyebrow="Membership"
        title={
          <>
            Find your voice. <span className="gold-text italic">Use it well.</span>
          </>
        }
        description="Applications are open to every registered student of Rangpur Government Polytechnic Institute. No prior debating experience is required."
        breadcrumb={[{ label: "Join Us" }]}
      />

      <section className="py-16 sm:py-20">
        <div className="container-narrow grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
          <div className="space-y-8">
            <Reveal>
              <div className="rounded-2xl border border-gold-400/20 bg-gold-400/[0.05] p-6">
                <div className="flex items-center gap-2 text-gold-300">
                  <Clock className="h-4 w-4" />
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em]">Applications open</p>
                </div>
                <p className="mt-3 font-display text-2xl text-cream">2026 intake is now accepting applications</p>
                <p className="mt-2 text-sm leading-relaxed text-cream/55">
                  Rolling admissions until the end of the session. Early applicants get priority for orientation.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <h2 className="font-display text-xl font-semibold text-cream">What you get as a member</h2>
              <ul className="mt-4 space-y-3">
                {BENEFITS.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3 text-sm leading-relaxed text-cream/60">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.14}>
              <div className="surface p-6">
                <div className="flex items-center gap-2 text-gold-300">
                  <ShieldCheck className="h-4 w-4" />
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em]">Your data is safe</p>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-cream/55">
                  Your information is stored securely and used only for membership processing. We never share your
                  details with third parties.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div>
                <h2 className="font-display text-xl font-semibold text-cream">How it works</h2>
                <ol className="mt-5 space-y-5">
                  {STEPS.map((step, index) => (
                    <li key={step.title} className="relative flex gap-4 pb-5 last:pb-0">
                      {index < STEPS.length - 1 && (
                        <span className="absolute left-[15px] top-9 h-full w-px bg-white/[0.08]" aria-hidden />
                      )}
                      <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gold-400/30 bg-ink-900">
                        <step.icon className="h-3.5 w-3.5 text-gold-400" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-cream/90">{step.title}</p>
                        <p className="mt-1 text-xs leading-relaxed text-cream/50">{step.description}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <MembershipForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
