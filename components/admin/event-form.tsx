"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { toast } from "sonner";
import { ArrowLeft, ExternalLink, ListChecks, Sparkles } from "lucide-react";
import { Input, Select, Textarea } from "@/components/ui/input";
import { ImageUpload } from "@/components/admin/image-upload";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { Field, FormError, FormGrid, FormSection, SaveBar } from "@/components/admin/form";
import { eventSchema } from "@/lib/validation";
import { EVENT_CATEGORIES, REGISTRATION_STATUSES } from "@/lib/constants";
import { slugify } from "@/lib/utils";
import { apiRequest, fromApiError, toDateTimeLocal } from "@/lib/admin-utils";
import type { EventDTO } from "@/lib/types";

type FormValues = z.infer<typeof eventSchema>;

const EMPTY: FormValues = {
  title: "",
  slug: "",
  category: "Debate Competition",
  description: "",
  image: "",
  startDate: "",
  endDate: "",
  venue: "",
  registrationDeadline: "",
  capacity: 0,
  status: "draft",
  registrationStatus: "coming-soon",
  rules: "",
};

const REGISTRATION_LABELS: Record<(typeof REGISTRATION_STATUSES)[number], string> = {
  open: "Open — accept registrations",
  closed: "Closed — no new registrations",
  "coming-soon": "Coming soon — show a countdown notice",
};

export function EventForm({ event, demo = false }: { event?: EventDTO; demo?: boolean }) {
  const router = useRouter();
  const [serverError, setServerError] = React.useState<string | null>(null);
  const slugEdited = React.useRef(Boolean(event));

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: event
      ? {
          title: event.title,
          slug: event.slug,
          category: (EVENT_CATEGORIES as readonly string[]).includes(event.category)
            ? (event.category as FormValues["category"])
            : "Debate Competition",
          description: event.description,
          image: event.image,
          startDate: toDateTimeLocal(event.startDate),
          endDate: toDateTimeLocal(event.endDate),
          venue: event.venue,
          registrationDeadline: toDateTimeLocal(event.registrationDeadline),
          capacity: event.capacity,
          status: event.status,
          registrationStatus: event.registrationStatus,
          rules: event.rules,
        }
      : EMPTY,
  });

  const title = watch("title");
  const description = watch("description");
  const image = watch("image");
  const status = watch("status");
  const registrationStatus = watch("registrationStatus");

  React.useEffect(() => {
    if (slugEdited.current) return;
    if (title) setValue("slug", slugify(title));
  }, [title, setValue]);

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    const payload = {
      ...values,
      registrationDeadline: values.registrationDeadline || null,
      capacity: Number(values.capacity) || 0,
    };

    try {
      const { ok, payload: result } = await apiRequest(event ? `/api/events/${event.id}` : "/api/events", {
        method: event ? "PATCH" : "POST",
        body: JSON.stringify(payload),
      });
      if (!ok) {
        setServerError(fromApiError(result));
        return;
      }
      toast.success(event ? "Event updated" : "Event created");
      router.push("/admin/events");
      router.refresh();
    } catch {
      setServerError("Network error. Please check your connection and try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/admin/events"
          className="inline-flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-cream/40 transition hover:text-gold-300"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to events
        </Link>
        {event && (
          <div className="flex items-center gap-2">
            <Link
              href={`/admin/events/${event.id}/registrations`}
              className="inline-flex h-9 items-center gap-2 rounded-full border border-white/15 px-4 text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-cream/65 transition hover:border-gold-400/40 hover:text-gold-200"
            >
              <ListChecks className="h-3.5 w-3.5" /> Registrations
            </Link>
            {event.status === "published" && (
              <Link
                href={`/events/${event.slug}`}
                target="_blank"
                className="inline-flex h-9 items-center gap-2 rounded-full border border-white/15 px-4 text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-cream/65 transition hover:border-gold-400/40 hover:text-gold-200"
              >
                Live event <ExternalLink className="h-3 w-3" />
              </Link>
            )}
          </div>
        )}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.65fr_1fr]">
        <div className="space-y-5">
          <FormSection title="Event details" description="What is happening, where, and when.">
            <div className="space-y-4">
              <Field label="Event title" htmlFor="title" error={errors.title?.message} required>
                <Input id="title" placeholder="e.g. Inter-Polytechnic Debate Championship" {...register("title")} />
              </Field>

              <Field label="Slug" htmlFor="slug" error={errors.slug?.message} hint="Public URL: /events/your-slug" required>
                <div className="flex gap-2">
                  <Input id="slug" placeholder="inter-polytechnic-championship" {...register("slug", { onChange: () => (slugEdited.current = true) })} />
                  <button
                    type="button"
                    className="shrink-0 rounded-lg border border-white/10 px-3 text-[0.62rem] font-semibold uppercase tracking-[0.08em] text-cream/50 transition hover:border-gold-400/40 hover:text-gold-200"
                    onClick={() => {
                      slugEdited.current = false;
                      setValue("slug", slugify(title), { shouldValidate: true });
                    }}
                  >
                    Generate
                  </button>
                </div>
              </Field>

              <FormGrid>
                <Field label="Category" htmlFor="category" error={errors.category?.message}>
                  <Select id="category" {...register("category")}>
                    {EVENT_CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field label="Venue" htmlFor="venue" error={errors.venue?.message} required>
                  <Input id="venue" placeholder="e.g. RPI Auditorium" {...register("venue")} />
                </Field>
                <Field label="Starts" htmlFor="startDate" error={errors.startDate?.message} required>
                  <Input id="startDate" type="datetime-local" {...register("startDate")} />
                </Field>
                <Field label="Ends" htmlFor="endDate" error={errors.endDate?.message} required>
                  <Input id="endDate" type="datetime-local" {...register("endDate")} />
                </Field>
              </FormGrid>

              <Field label="Description" error={errors.description?.message} required>
                <RichTextEditor
                  value={description}
                  onChange={(html) => setValue("description", html, { shouldValidate: true })}
                  placeholder="Describe the event, format, schedule and who should attend…"
                  minHeight="min-h-[240px]"
                />
              </Field>
            </div>
          </FormSection>

          <FormSection title="Rules & participant guidelines" description="Plain text. Each line becomes a bullet point on the event page.">
            <Field label="Rules" htmlFor="rules" error={errors.rules?.message}>
              <Textarea id="rules" rows={7} placeholder={"Teams of two debaters.\nRegistration is free for club members.\nBring your student ID."} {...register("rules")} />
            </Field>
          </FormSection>
        </div>

        <div className="space-y-5">
          <FormSection title="Publishing & registration">
            <div className="space-y-4">
              <Field label="Status" htmlFor="status">
                <Select id="status" {...register("status")}>
                  <option value="draft">Draft — hidden from the public site</option>
                  <option value="published">Published — live on the website</option>
                </Select>
              </Field>

              <Field label="Registration" htmlFor="registrationStatus">
                <Select id="registrationStatus" {...register("registrationStatus")}>
                  {REGISTRATION_STATUSES.map((item) => (
                    <option key={item} value={item}>
                      {REGISTRATION_LABELS[item]}
                    </option>
                  ))}
                </Select>
              </Field>

              <FormGrid className="sm:grid-cols-1">
                <Field
                  label="Registration deadline"
                  htmlFor="registrationDeadline"
                  error={errors.registrationDeadline?.message}
                  hint="Optional. Shown on the event page."
                >
                  <Input id="registrationDeadline" type="datetime-local" {...register("registrationDeadline")} />
                </Field>
                <Field
                  label="Capacity"
                  htmlFor="capacity"
                  error={errors.capacity?.message}
                  hint="Maximum participants. Use 0 for unlimited."
                >
                  <Input id="capacity" type="number" min={0} {...register("capacity")} />
                </Field>
              </FormGrid>
            </div>
          </FormSection>

          <FormSection title="Event image" description="A wide photo works best (1600×900).">
            <ImageUpload value={image} onChange={(url) => setValue("image", url, { shouldValidate: true })} folder="events" />
            {errors.image?.message && <p className="mt-2 text-[0.7rem] text-red-300">{errors.image.message}</p>}
          </FormSection>

          <FormSection title="Public preview">
            <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-3 text-xs leading-relaxed text-cream/40">
              <p className="flex items-center gap-2 text-cream/65">
                <Sparkles className="h-3.5 w-3.5 text-gold-400" /> /events/{watch("slug") || "your-slug"}
              </p>
              <p className="mt-2 line-clamp-2 font-display text-sm text-cream/80">{title || "Event title appears here"}</p>
              <p className="mt-1 text-[0.68rem]">
                {status === "published" ? "Visible to the public" : "Draft — only admins can see this"} ·{" "}
                {registrationStatus === "open" ? "Registration open" : registrationStatus === "closed" ? "Registration closed" : "Coming soon"}
              </p>
            </div>
          </FormSection>
        </div>
      </div>

      <FormError message={serverError} />
      <SaveBar
        cancelHref="/admin/events"
        submitLabel={status === "published" ? "Save & publish" : "Save draft"}
        isSubmitting={isSubmitting}
        disabled={demo}
        note="Publishing makes the event page public. Control registrations separately with the registration setting."
      />
    </form>
  );
}
