"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { CheckCircle2, Loader2, Ticket } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { eventRegistrationSchema } from "@/lib/validation";
import type { EventDTO } from "@/lib/types";

type FormValues = z.infer<typeof eventRegistrationSchema>;

export function EventRegister({ event }: { event: EventDTO }) {
  const [open, setOpen] = React.useState(false);
  const [reference, setReference] = React.useState<string | null>(null);
  const [serverError, setServerError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(eventRegistrationSchema),
    defaultValues: { name: "", studentId: "", email: "", phone: "", department: "", message: "" },
  });

  const disabled = event.registrationStatus === "closed" || event.status !== "published";

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    try {
      const response = await fetch(`/api/events/${event.slug}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const payload = await response.json();
      if (!response.ok) {
        setServerError(payload.error ?? "Registration failed. Please try again.");
        return;
      }
      setReference(payload.data.referenceNo);
      toast.success("Event registration confirmed");
      reset();
    } catch {
      setServerError("Network error. Please check your connection and try again.");
    }
  };

  return (
    <>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(true)}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-gold-400 px-6 text-sm font-bold text-ink-950 transition hover:bg-gold-300 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-cream/40"
      >
        <Ticket className="h-4 w-4" />
        {event.registrationStatus === "open"
          ? "Register for this event"
          : event.registrationStatus === "coming-soon"
            ? "Registration opens soon"
            : "Registration closed"}
      </button>

      <Dialog
        open={open}
        onOpenChange={(value) => {
          setOpen(value);
          if (!value) {
            setReference(null);
            setServerError(null);
          }
        }}
        title={reference ? "You're registered" : "Event registration"}
        description={reference ? undefined : event.title}
      >
        {reference ? (
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-400/10">
              <CheckCircle2 className="h-7 w-7 text-emerald-300" />
            </div>
            <p className="mt-5 font-display text-2xl text-cream">Seat reserved</p>
            <p className="mt-2 text-sm text-cream/60">
              Keep your reference number for the registration desk on event day.
            </p>
            <p className="mt-4 rounded-xl border border-gold-400/25 bg-gold-400/[0.07] px-4 py-3 font-mono text-sm text-gold-200">
              {reference}
            </p>
            <Button className="mt-6 w-full" onClick={() => setOpen(false)}>
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name" error={errors.name?.message}>
                <Input placeholder="Your full name" {...register("name")} />
              </Field>
              <Field label="Student ID" error={errors.studentId?.message}>
                <Input placeholder="RPI-2026-000" {...register("studentId")} />
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Email" error={errors.email?.message}>
                <Input type="email" placeholder="you@example.com" {...register("email")} />
              </Field>
              <Field label="Phone" error={errors.phone?.message}>
                <Input placeholder="017XXXXXXXX" {...register("phone")} />
              </Field>
            </div>
            <Field label="Department (optional)" error={errors.department?.message}>
              <Input placeholder="Computer Technology" {...register("department")} />
            </Field>
            <Field label="Anything we should know? (optional)" error={errors.message?.message}>
              <textarea
                className="input-base min-h-[80px] py-3"
                placeholder="Dietary needs, accessibility requirements, team name…"
                {...register("message")}
              />
            </Field>
            {serverError && (
              <p role="alert" className="rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">
                {serverError}
              </p>
            )}
            <p className="text-xs leading-relaxed text-cream/40">
              Capacity: {event.capacity || "unlimited"} · Registration closes{" "}
              {event.registrationDeadline ? new Date(event.registrationDeadline).toLocaleDateString() : "on event day"}
            </p>
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Ticket className="h-4 w-4" />}
              {isSubmitting ? "Reserving your seat…" : "Confirm registration"}
            </Button>
          </form>
        )}
      </Dialog>
    </>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-[0.7rem] text-red-300">{error}</p>}
    </div>
  );
}
