import type { Metadata } from "next";
import { CheckCircle2, Clock, FileText, MessageCircle, ShieldCheck, Users } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { MembershipForm } from "@/components/site/membership-form";
import { Reveal } from "@/components/site/reveal";

export const metadata: Metadata = {
  title: "Join the Club",
  description:
    "Apply for membership of DCRGPI. Open to every student of Rangpur Government Polytechnic Institute.",
  alternates: { canonical: "/register" },
};

const STEPS = [
  {
    icon: FileText,
    title: "Submit your application",
    description: "ফর্মে আপনার তথ্য দিন এবং কেন যোগ দিতে চান তা আমাদের জানান।",
  },
  {
    icon: MessageCircle,
    title: "We get in touch",
    description: "সদস্যপদ সম্পাদক আবেদনগুলো পর্যালোচনা করেন এবং বাছাই করা শিক্ষার্থীদের সঙ্গে যোগাযোগ করেন।",
  },
  {
    icon: Users,
    title: "Orientation session",
    description: "কমিটি ও আপনার মেন্টরের সঙ্গে পরিচিত হোন এবং ডিবেট ল্যাবের স্বাদ নিন।",
  },
  {
    icon: CheckCircle2,
    title: "Welcome to the club",
    description: "সাপ্তাহিক সেশনে অংশ নিন, প্রতিযোগিতায় নামুন এবং নিজের বিতর্কের রেকর্ড গড়া শুরু করুন।",
  },
];

const BENEFITS = [
  "পার্লামেন্টারি বিতর্ক ও পাবলিক স্পিকিংয়ে সাপ্তাহিক প্রশিক্ষণ",
  "প্রথম মাসের জন্য একজন ব্যক্তিগত মেন্টর",
  "ক্লাবের ওয়ার্কশপ ও প্রতিযোগিতায় অগ্রাধিকারপ্রাপ্ত প্রবেশ",
  "অংশগ্রহণ ও অর্জনের সনদ",
  "আরপিআইয়ের প্রতিটি বিভাগের শিক্ষার্থীদের কমিউনিটি",
  "আমাদের রিসোর্স লাইব্রেরি ও প্র্যাকটিস মোশনের অ্যাক্সেস",
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
        description="রংপুর সরকারি পলিটেকনিক ইনস্টিটিউটের প্রতিটি নিবন্ধিত শিক্ষার্থীর জন্য আবেদন উন্মুক্ত। আগের বিতর্ক অভিজ্ঞতার প্রয়োজন নেই।"
        breadcrumb={[{ label: "Join Us" }]}
        showCta={false}
      />

      <section className="py-16 sm:py-20">
        <div className="container-narrow grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
          <div className="order-2 space-y-8 lg:order-1">
            <Reveal>
              <div className="rounded-2xl border border-gold-400/20 bg-gold-400/[0.05] p-6">
                <div className="flex items-center gap-2 text-gold-300">
                  <Clock className="h-4 w-4" />
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em]">Applications open</p>
                </div>
                <p className="mt-3 font-display text-2xl text-cream">2026 intake is now accepting applications</p>
                <p className="mt-2 text-sm leading-relaxed text-cream/55">
                  সেশন শেষ পর্যন্ত চলমান ভর্তি। আগে আবেদনকারীরা ওরিয়েন্টেশনে অগ্রাধিকার পাবেন।
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
                  আপনার তথ্য নিরাপদে সংরক্ষণ করা হয় এবং শুধু সদস্যপদ প্রক্রিয়াকরণের জন্য ব্যবহার করা হয়। আমরা কখনো
                  তৃতীয় পক্ষের সঙ্গে আপনার তথ্য শেয়ার করি না।
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

          <Reveal delay={0.1} className="order-first lg:order-2">
            <MembershipForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
