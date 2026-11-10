import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { ContactForm } from "@/components/site/contact-form";
import { Reveal } from "@/components/site/reveal";
import { SocialIcon } from "@/components/site/brand";
import { getSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with DCRGPI — membership questions, collaborations, events and more.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const settings = await getSettings();

  const contactItems = [
    {
      icon: Mail,
      label: "Email",
      value: settings.contactInfo.email,
      href: `mailto:${settings.contactInfo.email}`,
    },
    {
      icon: Phone,
      label: "Phone",
      value: settings.contactInfo.phone,
      href: `tel:${settings.contactInfo.phone.replace(/\s+/g, "")}`,
    },
    {
      icon: MapPin,
      label: "Find us",
      value: settings.contactInfo.address,
      href: settings.contactInfo.mapUrl || undefined,
    },
  ];

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={
          <>
            Let&apos;s start a <span className="gold-text italic">conversation</span>
          </>
        }
        description="আপনি যোগ দিতে চান, সহযোগিতা করতে চান, টুর্নামেন্টে আমন্ত্রণ জানাতে চান নাকি শুধু হ্যালো বলতে চান — আমাদের ইনবক্স সবসময় খোলা।"
        breadcrumb={[{ label: "Contact" }]}
      />

      <section className="py-16 sm:py-20">
        <div className="container-narrow grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          <div className="space-y-6">
            <Reveal>
              <h2 className="font-display text-2xl font-semibold text-cream sm:text-3xl">Reach the club</h2>
              <p className="mt-3 text-sm leading-relaxed text-cream/55">
                সাধারণত দুই কর্মদিবসের মধ্যে আমরা উত্তর দিই। ইভেন্টের দিন জরুরি কোনো বিষয়ে হলে নিচের নম্বরে কল করুন।
              </p>
            </Reveal>

            <div className="space-y-3">
              {contactItems.map((item, index) => (
                <Reveal key={item.label} delay={index * 0.06}>
                  <div className="surface flex items-start gap-4 p-5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold-400/25 bg-gold-400/[0.07]">
                      <item.icon className="h-4 w-4 text-gold-300" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-cream/35">
                        {item.label}
                      </p>
                      {item.href ? (
                        <a
                          href={item.href}
                          target={item.href.startsWith("http") ? "_blank" : undefined}
                          rel="noopener noreferrer"
                          className="mt-1 block break-words text-sm text-cream/80 transition hover:text-gold-300"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="mt-1 text-sm text-cream/80">{item.value}</p>
                      )}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.2}>
              <div className="surface p-5">
                <div className="flex items-center gap-2 text-gold-300">
                  <Clock className="h-4 w-4" />
                  <p className="text-[0.6rem] font-semibold uppercase tracking-[0.18em]">Club hours</p>
                </div>
                <p className="mt-2 text-sm text-cream/60">
                  Weekly Debate Lab · Thursday, 4:00 PM
                  <br />
                  Committee meetings · Sunday, 11:00 AM
                </p>
                <p className="mt-3 text-xs text-cream/35">Academic building, Room 302 (during class hours)</p>
              </div>
            </Reveal>

            <Reveal delay={0.26}>
              <div>
                <p className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-cream/35">Follow the club</p>
                <div className="mt-3 flex flex-wrap gap-2.5">
                  {settings.socialLinks.map((link) => (
                    <a
                      key={link.platform}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs text-cream/60 transition hover:border-gold-400/50 hover:text-gold-300"
                    >
                      <SocialIcon platform={link.platform} /> {link.platform}
                    </a>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="rounded-2xl border border-gold-400/20 bg-gold-400/[0.05] p-6">
                <p className="font-display text-xl text-cream">Want to join instead?</p>
                <p className="mt-2 text-sm text-cream/55">
                  ইনবক্সের অপেক্ষা বাদ দিন — সরাসরি সদস্যপদের জন্য আবেদন করুন, আমরা যোগাযোগ করব।
                </p>
                <Link
                  href="/register"
                  className="mt-4 inline-flex h-10 items-center rounded-full bg-gold-400 px-5 text-xs font-bold text-ink-950 transition hover:bg-gold-300"
                >
                  Apply for membership
                </Link>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <ContactForm />
          </Reveal>
        </div>
      </section>

      {settings.contactInfo.mapUrl && (
        <section className="border-t border-white/[0.06]">
          <div className="container-narrow py-12">
            <div className="overflow-hidden rounded-2xl border border-white/[0.08]">
              <iframe
                title="Institute location"
                src={`https://www.google.com/maps?q=${encodeURIComponent(settings.instituteInfo)}&output=embed`}
                className="h-[340px] w-full grayscale-[35%]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>
      )}
    </>
  );
}
