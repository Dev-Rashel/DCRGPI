"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { toast } from "sonner";
import { ArrowRight, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { membershipSchema } from "@/lib/validation";
import { DEPARTMENTS, SEMESTERS } from "@/lib/constants";

type FormValues = z.infer<typeof membershipSchema>;

const ACTIVITY_OPTIONS = [
  "Parliamentary debate",
  "Public speaking",
  "Adjudication",
  "Research & writing",
  "Event organising",
];

export function MembershipForm() {
  const [reference, setReference] = React.useState<string | null>(null);
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [activities, setActivities] = React.useState<string[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(membershipSchema),
    defaultValues: {
      name: "",
      studentId: "",
      department: "",
      semester: "",
      group: "",
      email: "",
      phone: "",
      photo: "",
      fatherName: "",
      motherName: "",
      hasDebateExperience: "",
      canCommitTime: "",
      experience: "",
      motivation: "",
      activities: "",
    },
  });

  const hasDebateExperience = watch("hasDebateExperience");

  const toggleActivity = (activity: string) => {
    const next = activities.includes(activity)
      ? activities.filter((item) => item !== activity)
      : [...activities, activity];
    setActivities(next);
    setValue("activities", next.join(", "), { shouldValidate: true });
  };

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    try {
      const response = await fetch("/api/membership", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const payload = await response.json();
      if (!response.ok) {
        setServerError(payload.error ?? "আপনার আবেদন জমা দেওয়া যায়নি। আবার চেষ্টা করুন।");
        return;
      }
      setReference(payload.data.referenceNo);
      toast.success("আবেদন সফলভাবে জমা হয়েছে");
      reset();
      setActivities([]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setServerError("নেটওয়ার্ক সমস্যা হয়েছে। আপনার ইন্টারনেট সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।");
    }
  };

  if (reference) {
    return (
      <div className="surface relative overflow-hidden p-8 text-center sm:p-12">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gold-400/10 blur-3xl" />
        <div className="relative">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-400/10">
            <CheckCircle2 className="h-8 w-8 text-emerald-300" />
          </div>
          <p className="mt-6 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-emerald-300">
            Application received
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-cream">Welcome to the conversation.</h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-cream/60">
            আপনার সদস্যপদের আবেদন জমা হয়েছে। আমাদের সদস্যপদ সম্পাদক এটি পর্যালোচনা করবেন এবং আপনার দেওয়া তথ্য
            ব্যবহার করে যোগাযোগ করবেন। অনুগ্রহ করে আপনার রেফারেন্স নম্বরটি সংরক্ষণ করুন।
          </p>
          <div className="mx-auto mt-7 max-w-sm rounded-xl border border-gold-400/25 bg-gold-400/[0.07] px-5 py-4">
            <p className="text-[0.6rem] uppercase tracking-[0.18em] text-gold-300">Your reference number</p>
            <p className="mt-1 font-mono text-lg text-gold-100">{reference}</p>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-white/15 px-6 text-sm font-semibold text-cream transition hover:border-gold-400/50"
            >
              Back to home
            </Link>
            <Link
              href="/events"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-gold-400 px-6 text-sm font-bold text-ink-950 transition hover:bg-gold-300"
            >
              Explore events <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="surface p-6 sm:p-8" noValidate>
      <div className="mb-7 flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold-400/30 bg-gold-400/10">
          <Sparkles className="h-4 w-4 text-gold-300" />
        </div>
        <div>
          <h2 className="font-display text-2xl font-semibold text-cream">Membership application</h2>
          <p className="mt-1 text-sm text-cream/50">
            প্রায় তিন মিনিট লাগবে। * চিহ্নিত সব ঘর পূরণ করা আবশ্যক।
          </p>
        </div>
      </div>

      <fieldset className="space-y-5">
        <legend className="mb-4 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-gold-300">
          01 — Personal details
        </legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name *" error={errors.name?.message}>
            <Input autoComplete="name" placeholder="e.g. Md. Tanvir Hasan" {...register("name")} />
          </Field>
          <Field label="Student ID *" error={errors.studentId?.message}>
            <Input placeholder="e.g. RGPI-2026-114" {...register("studentId")} />
          </Field>
          <Field label="Department *" error={errors.department?.message}>
            <select className="input-base" {...register("department")}>
              <option value="">Select department</option>
              {DEPARTMENTS.map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Semester *" error={errors.semester?.message}>
            <select className="input-base" {...register("semester")}>
              <option value="">Select semester</option>
              {SEMESTERS.map((semester) => (
                <option key={semester} value={semester}>
                  Semester {semester}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Group *" error={errors.group?.message}>
            <Input placeholder="e.g. A" {...register("group")} />
          </Field>
          <Field label="Phone number *" error={errors.phone?.message}>
            <Input type="tel" autoComplete="tel" placeholder="017XXXXXXXX" {...register("phone")} />
          </Field>
          <Field label="Email address *" error={errors.email?.message} className="sm:col-span-2">
            <Input type="email" autoComplete="email" placeholder="you@example.com" {...register("email")} />
          </Field>
          <Field label="Father's name *" error={errors.fatherName?.message}>
            <Input placeholder="Father's full name" {...register("fatherName")} />
          </Field>
          <Field label="Mother's name *" error={errors.motherName?.message}>
            <Input placeholder="Mother's full name" {...register("motherName")} />
          </Field>
          <Field label="Profile photo link (optional)" error={errors.photo?.message} className="sm:col-span-2">
            <Input placeholder="https://res.cloudinary.com/…" {...register("photo")} />
          </Field>
        </div>
      </fieldset>

      <div className="my-7 h-px bg-white/[0.08]" />

      <fieldset className="space-y-5">
        <legend className="mb-4 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-gold-300">
          02 — Your debating journey
        </legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Have you debated before? *" error={errors.hasDebateExperience?.message}>
            <select className="input-base" {...register("hasDebateExperience")}>
              <option value="">Select an answer</option>
              <option value="yes">Yes, I have debated before</option>
              <option value="no">No, I am new to debate</option>
            </select>
          </Field>
          <Field label="Can you commit time to the club? *" error={errors.canCommitTime?.message}>
            <select className="input-base" {...register("canCommitTime")}>
              <option value="">Select an answer</option>
              <option value="yes">Yes, I can attend regularly</option>
              <option value="no">No, my schedule is limited</option>
            </select>
          </Field>
        </div>
        {hasDebateExperience === "yes" && (
          <Field label="Tell us about your experience (optional)" error={errors.experience?.message}>
            <textarea
              className="input-base min-h-[90px] py-3"
              placeholder="School competitions, public speaking, MUN, club debates…"
              {...register("experience")}
            />
          </Field>
        )}
        <Field label="Why do you want to join? *" error={errors.motivation?.message}>
          <textarea
            className="input-base min-h-[130px] py-3"
            placeholder="বিতর্কে আপনাকে কী টানে এবং আপনি কী অর্জন করতে চান তা লিখুন।"
            {...register("motivation")}
          />
        </Field>
        <div className="space-y-2">
          <Label>Preferred activities (optional)</Label>
          <div className="flex flex-wrap gap-2">
            {ACTIVITY_OPTIONS.map((activity) => {
              const active = activities.includes(activity);
              return (
                <button
                  key={activity}
                  type="button"
                  onClick={() => toggleActivity(activity)}
                  aria-pressed={active}
                  className={`rounded-full border px-3.5 py-2 text-xs font-medium transition ${
                    active
                      ? "border-gold-400/60 bg-gold-400/15 text-gold-200"
                      : "border-white/10 text-cream/55 hover:border-white/25 hover:text-cream/85"
                  }`}
                >
                  {activity}
                </button>
              );
            })}
          </div>
        </div>
      </fieldset>

      {serverError && (
        <p role="alert" className="mt-6 rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">
          {serverError}
        </p>
      )}

      <div className="mt-7 flex flex-col gap-3 border-t border-white/[0.08] pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xs text-[0.68rem] leading-relaxed text-cream/35">
          জমা দেওয়ার মাধ্যমে আপনি নিশ্চিত করছেন যে তথ্যগুলো সঠিক এবং ক্লাবের আচরণবিধিতে সম্মত আছেন।
        </p>
        <Button type="submit" size="lg" disabled={isSubmitting} className="shrink-0">
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {isSubmitting ? "Submitting…" : "Submit application"}
          {!isSubmitting && <ArrowRight className="h-4 w-4" />}
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  children,
  className,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`space-y-1.5 ${className ?? ""}`}>
      <Label>{label}</Label>
      {children}
      {error && <p className="text-[0.7rem] text-red-300">{error}</p>}
    </div>
  );
}
