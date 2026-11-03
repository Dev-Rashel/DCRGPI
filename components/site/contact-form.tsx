"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { toast } from "sonner";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { contactSchema } from "@/lib/validation";

type FormValues = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [sent, setSent] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const payload = await response.json();
      if (!response.ok) {
        setServerError(payload.error ?? "Your message could not be sent. Please try again.");
        return;
      }
      setSent(true);
      toast.success("Message sent — thank you!");
      reset();
    } catch {
      setServerError("Network error. Please check your connection and try again.");
    }
  };

  if (sent) {
    return (
      <div className="surface p-8 text-center sm:p-10">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-400/10">
          <CheckCircle2 className="h-6 w-6 text-emerald-300" />
        </div>
        <h2 className="mt-5 font-display text-2xl font-semibold text-cream">Message received</h2>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-cream/55">
          Thank you for reaching out. A member of our team will reply to you by email as soon as possible.
        </p>
        <Button variant="outline" className="mt-6" onClick={() => setSent(false)}>
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="surface p-6 sm:p-8" noValidate>
      <h2 className="font-display text-2xl font-semibold text-cream">Send us a message</h2>
      <p className="mt-1 text-sm text-cream/50">
        Questions about membership, collaborations or events? We&apos;d love to hear from you.
      </p>

      <div className="mt-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Your name *</Label>
            <Input autoComplete="name" placeholder="Full name" {...register("name")} />
            {errors.name && <p className="text-[0.7rem] text-red-300">{errors.name.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Email address *</Label>
            <Input type="email" autoComplete="email" placeholder="you@example.com" {...register("email")} />
            {errors.email && <p className="text-[0.7rem] text-red-300">{errors.email.message}</p>}
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Subject *</Label>
          <Input placeholder="What is this about?" {...register("subject")} />
          {errors.subject && <p className="text-[0.7rem] text-red-300">{errors.subject.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label>Message *</Label>
          <textarea
            className="input-base min-h-[150px] py-3"
            placeholder="Write your message here…"
            {...register("message")}
          />
          {errors.message && <p className="text-[0.7rem] text-red-300">{errors.message.message}</p>}
        </div>
      </div>

      {serverError && (
        <p role="alert" className="mt-4 rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">
          {serverError}
        </p>
      )}

      <Button type="submit" disabled={isSubmitting} className="mt-6 w-full sm:w-auto">
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        {isSubmitting ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
