"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  ArrowDown,
  ArrowUp,
  Contact,
  GripVertical,
  Info,
  LayoutGrid,
  Loader2,
  Navigation,
  Palette,
  PanelBottom,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Field, FormError, FormGrid, FormSection, SaveBar } from "@/components/admin/form";
import { ImageUpload } from "@/components/admin/image-upload";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { settingsSchema, type SettingsInput } from "@/lib/validation";
import { apiRequest, fromApiError } from "@/lib/admin-utils";
import { cn } from "@/lib/utils";
import type { SiteSettings } from "@/lib/types";

type FormValues = SettingsInput;

const TABS = [
  { key: "branding", label: "Branding & hero", icon: Palette },
  { key: "about", label: "About & mission", icon: Info },
  { key: "homepage", label: "Homepage", icon: LayoutGrid },
  { key: "contact", label: "Contact & social", icon: Contact },
  { key: "footer", label: "Footer", icon: PanelBottom },
  { key: "navigation", label: "Navigation", icon: Navigation },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export function SettingsForm({ settings, demo }: { settings: SiteSettings; demo: boolean }) {
  const router = useRouter();
  const [tab, setTab] = React.useState<TabKey>("branding");
  const [serverError, setServerError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: settings,
  });

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    try {
      const { ok, payload } = await apiRequest("/api/settings", {
        method: "PATCH",
        body: JSON.stringify(values),
      });
      if (!ok) {
        setServerError(fromApiError(payload));
        return;
      }
      toast.success("Website settings saved");
      router.refresh();
    } catch {
      setServerError("Network error. Please check your connection and try again.");
    }
  };

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <form id="settings-form" onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {TABS.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setTab(item.key)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.08em] transition",
                tab === item.key
                  ? "border-gold-400/40 bg-gold-400/10 text-gold-200"
                  : "border-white/10 text-cream/45 hover:border-white/25 hover:text-cream/80"
              )}
              aria-pressed={tab === item.key}
            >
              <item.icon className="h-3.5 w-3.5" /> {item.label}
            </button>
          ))}
        </div>
        <Button type="submit" disabled={isSubmitting || demo} className="h-9 px-4 text-[0.65rem] uppercase tracking-[0.1em]">
          {isSubmitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
          {isSubmitting ? "Saving…" : "Save changes"}
        </Button>
      </div>

      {hasErrors && (
        <p className="rounded-lg border border-amber-400/30 bg-amber-400/[0.07] px-4 py-3 text-xs text-amber-100/80">
          Some fields need attention. Check the highlighted fields across the tabs before saving.
        </p>
      )}

      {tab === "branding" && (
        <div className="space-y-5">
          <FormSection title="Logo & identity" description="The logo appears in the site header, footer and admin panel.">
            <div className="grid gap-5 sm:grid-cols-[auto_1fr] sm:items-start">
              <div className="w-32">
                <ImageUpload
                  value={watch("logo")}
                  onChange={(url) => setValue("logo", url, { shouldValidate: true })}
                  folder="branding"
                  previewClassName="aspect-square"
                  compact
                />
              </div>
              <FormGrid>
                <Field label="Theme accent" error={errors.themeAccent?.message} hint="Hex colour used for highlights and buttons.">
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={watch("themeAccent") || "#eec46a"}
                      onChange={(event) => setValue("themeAccent", event.target.value, { shouldValidate: true })}
                      className="h-11 w-14 cursor-pointer rounded-lg border border-white/10 bg-transparent p-1"
                      aria-label="Theme accent colour"
                    />
                    <Input placeholder="#eec46a" {...register("themeAccent")} />
                  </div>
                </Field>
              </FormGrid>
            </div>
          </FormSection>

          <FormSection
            title="Hero section"
            description="The first thing visitors see. The group photo appears in a framed card beside the homepage headline."
          >
            <div className="space-y-4">
              <Field
                label="Hero group photo"
                error={errors.heroImage?.message}
                hint="Shown beside “Think Bold. Speak Fearlessly.” on the homepage and as the About page fallback. Upload a photo of the club members together."
              >
                <ImageUpload
                  value={watch("heroImage")}
                  onChange={(url) => setValue("heroImage", url, { shouldValidate: true })}
                  folder="hero"
                />
              </Field>

              <FormGrid>
                <Field label="Photo focal point" error={errors.heroImagePosition?.message}>
                  <Select {...register("heroImagePosition")}>
                    <option value="center">Center</option>
                    <option value="top">Top</option>
                    <option value="bottom">Bottom</option>
                  </Select>
                </Field>
                <Field
                  label={`Overlay darkness — ${watch("heroOverlay")}%`}
                  error={errors.heroOverlay?.message}
                  hint="Darkens the photo so the caption stays readable."
                >
                  <input
                    type="range"
                    min={0}
                    max={95}
                    step={1}
                    {...register("heroOverlay", { valueAsNumber: true })}
                    className="h-11 w-full accent-gold-400"
                  />
                </Field>
              </FormGrid>

              <Field label="Eyebrow text" error={errors.heroEyebrow?.message} hint="Small uppercase label above the heading.">
                <Input placeholder="Rangpur Government Polytechnic Institute" {...register("heroEyebrow")} />
              </Field>

              <Field label="Hero heading" error={errors.heroTitle?.message} required>
                <Input placeholder="Think Bold. Speak Fearlessly." {...register("heroTitle")} />
              </Field>

              <Field label="Hero subtitle" error={errors.heroSubtitle?.message}>
                <Textarea rows={3} placeholder="A short, inspiring sentence about the club." {...register("heroSubtitle")} />
              </Field>

              <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
                <p className="mb-3 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-cream/35">Call-to-action buttons</p>
                <FormGrid>
                  <Field label="Primary button text" error={errors.heroPrimaryCtaText?.message}>
                    <Input placeholder="Join the Club" {...register("heroPrimaryCtaText")} />
                  </Field>
                  <Field label="Primary button link" error={errors.heroPrimaryCtaHref?.message}>
                    <Input placeholder="/register" {...register("heroPrimaryCtaHref")} />
                  </Field>
                  <Field label="Secondary button text" error={errors.heroSecondaryCtaText?.message}>
                    <Input placeholder="Explore Events" {...register("heroSecondaryCtaText")} />
                  </Field>
                  <Field label="Secondary button link" error={errors.heroSecondaryCtaHref?.message}>
                    <Input placeholder="/events" {...register("heroSecondaryCtaHref")} />
                  </Field>
                </FormGrid>
              </div>
            </div>
          </FormSection>
        </div>
      )}

      {tab === "about" && (
        <div className="space-y-5">
          <FormSection title="About the club" description="Displayed on the homepage and the About page.">
            <Field label="About content" error={errors.aboutContent?.message}>
              <RichTextEditor
                value={watch("aboutContent")}
                onChange={(html) => setValue("aboutContent", html, { shouldValidate: true })}
                placeholder="Tell visitors who the club is, what it does and why it matters…"
                minHeight="min-h-[260px]"
              />
            </Field>
          </FormSection>

          <FormSection title="Our story" description="Optional history shown on the About page.">
            <Field label="History" error={errors.history?.message}>
              <RichTextEditor
                value={watch("history")}
                onChange={(html) => setValue("history", html, { shouldValidate: true })}
                placeholder="How did the club begin? What are its proudest milestones?"
                minHeight="min-h-[200px]"
              />
            </Field>
          </FormSection>

          <FormSection title="Mission & vision">
            <FormGrid>
              <Field label="Mission" error={errors.mission?.message}>
                <Textarea rows={5} placeholder="What the club exists to do…" {...register("mission")} />
              </Field>
              <Field label="Vision" error={errors.vision?.message}>
                <Textarea rows={5} placeholder="What the club is working towards…" {...register("vision")} />
              </Field>
            </FormGrid>
          </FormSection>

          <ArraySection
            title="Objectives"
            description="Concrete goals shown as a list on the About page."
            onAdd={() => setValue("objectives", [...watch("objectives"), ""], { shouldValidate: true })}
            addLabel="Add objective"
          >
            <div className="space-y-2">
              {watch("objectives").map((objective, index) => (
                <div key={`objective-${index}`} className="flex items-start gap-2">
                  <span className="mt-2.5 w-5 shrink-0 text-center text-[0.65rem] text-cream/25">{index + 1}</span>
                  <Input
                    value={objective}
                    onChange={(event) => {
                      const next = [...watch("objectives")];
                      next[index] = event.target.value;
                      setValue("objectives", next, { shouldValidate: true });
                    }}
                    placeholder="e.g. Host regular public speaking workshops"
                    aria-label={`Objective ${index + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => setValue("objectives", watch("objectives").filter((_, i) => i !== index), { shouldValidate: true })}
                    className="mt-1 rounded p-2 text-cream/35 transition hover:bg-red-400/10 hover:text-red-300"
                    aria-label="Remove objective"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </ArraySection>

          <ArraySection
            title="Core values"
            description="The principles that guide the club, shown on the About page."
            onAdd={() =>
              setValue("coreValues", [...watch("coreValues"), { title: "", description: "" }], { shouldValidate: true })
            }
            addLabel="Add core value"
          >
            <div className="space-y-3">
              {watch("coreValues").map((value, index) => (
                <div key={`core-value-${index}`} className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-3.5">
                  <div className="flex items-start gap-2">
                    <div className="flex-1 space-y-2">
                      <Input
                        value={value.title}
                        onChange={(event) => {
                          const next = [...watch("coreValues")];
                          next[index] = { ...next[index], title: event.target.value };
                          setValue("coreValues", next, { shouldValidate: true });
                        }}
                        placeholder="Value title (e.g. Reason over noise)"
                        aria-label={`Core value ${index + 1} title`}
                      />
                      <Textarea
                        rows={2}
                        value={value.description ?? ""}
                        onChange={(event) => {
                          const next = [...watch("coreValues")];
                          next[index] = { ...next[index], description: event.target.value };
                          setValue("coreValues", next, { shouldValidate: true });
                        }}
                        placeholder="One sentence explaining what this means in practice."
                        aria-label={`Core value ${index + 1} description`}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setValue("coreValues", watch("coreValues").filter((_, i) => i !== index), { shouldValidate: true })}
                      className="rounded p-2 text-cream/35 transition hover:bg-red-400/10 hover:text-red-300"
                      aria-label="Remove core value"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </ArraySection>
        </div>
      )}

      {tab === "homepage" && (
        <div className="space-y-5">
          <FormSection
            title="Homepage sections"
            description="Choose which sections appear and in what order. Notices are always shown separately at the top."
          >
            <div className="space-y-2">
              {watch("sectionSettings").map((section, index) => (
                <div key={section.key} className="flex items-center gap-3 rounded-lg border border-white/[0.07] bg-white/[0.02] px-3.5 py-2.5">
                  <GripVertical className="h-4 w-4 shrink-0 text-cream/20" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-cream/80">{section.label}</p>
                    <p className="text-[0.6rem] uppercase tracking-[0.1em] text-cream/25">{section.key}</p>
                  </div>
                  <Switch
                    checked={section.visible}
                    onCheckedChange={(checked) => {
                      const next = [...watch("sectionSettings")];
                      next[index] = { ...section, visible: checked };
                      setValue("sectionSettings", next, { shouldValidate: true });
                    }}
                    label={section.visible ? "Shown" : "Hidden"}
                  />
                  <div className="flex items-center gap-0.5">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => {
                        const next = [...watch("sectionSettings")];
                        [next[index - 1], next[index]] = [next[index], next[index - 1]];
                        setValue("sectionSettings", next.map((item, position) => ({ ...item, order: position + 1 })), { shouldValidate: true });
                      }}
                      className="rounded p-1.5 text-cream/35 transition hover:bg-white/[0.06] hover:text-cream disabled:opacity-25"
                      aria-label="Move section up"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={index === watch("sectionSettings").length - 1}
                      onClick={() => {
                        const next = [...watch("sectionSettings")];
                        [next[index + 1], next[index]] = [next[index], next[index + 1]];
                        setValue("sectionSettings", next.map((item, position) => ({ ...item, order: position + 1 })), { shouldValidate: true });
                      }}
                      className="rounded p-1.5 text-cream/35 transition hover:bg-white/[0.06] hover:text-cream disabled:opacity-25"
                      aria-label="Move section down"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </FormSection>

          <ArraySection
            title="Statistics"
            description="Animated counters on the homepage. Keep them honest and up to date."
            onAdd={() => setValue("stats", [...watch("stats"), { label: "", value: 0, suffix: "" }], { shouldValidate: true })}
            addLabel="Add statistic"
          >
            <div className="space-y-2">
              {watch("stats").map((stat, index) => (
                <div key={`stat-${index}`} className="flex flex-wrap items-end gap-2 rounded-lg border border-white/[0.07] bg-white/[0.02] p-3">
                  <div className="min-w-[160px] flex-1">
                    <label className="mb-1 block text-[0.55rem] uppercase tracking-[0.12em] text-cream/30">Label</label>
                    <Input
                      value={stat.label}
                      onChange={(event) => {
                        const next = [...watch("stats")];
                        next[index] = { ...stat, label: event.target.value };
                        setValue("stats", next, { shouldValidate: true });
                      }}
                      placeholder="Active members"
                    />
                  </div>
                  <div className="w-24">
                    <label className="mb-1 block text-[0.55rem] uppercase tracking-[0.12em] text-cream/30">Value</label>
                    <Input
                      type="number"
                      min={0}
                      value={stat.value}
                      onChange={(event) => {
                        const next = [...watch("stats")];
                        next[index] = { ...stat, value: Number(event.target.value) };
                        setValue("stats", next, { shouldValidate: true });
                      }}
                    />
                  </div>
                  <div className="w-20">
                    <label className="mb-1 block text-[0.55rem] uppercase tracking-[0.12em] text-cream/30">Suffix</label>
                    <Input
                      value={stat.suffix ?? ""}
                      onChange={(event) => {
                        const next = [...watch("stats")];
                        next[index] = { ...stat, suffix: event.target.value };
                        setValue("stats", next, { shouldValidate: true });
                      }}
                      placeholder="+"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setValue("stats", watch("stats").filter((_, i) => i !== index), { shouldValidate: true })}
                    className="rounded p-2.5 text-cream/35 transition hover:bg-red-400/10 hover:text-red-300"
                    aria-label="Remove statistic"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </ArraySection>
        </div>
      )}

      {tab === "contact" && (
        <div className="space-y-5">
          <FormSection title="Contact details" description="Shown on the contact page, footer and anywhere visitors need to reach the club.">
            <FormGrid>
              <Field label="Email address" error={errors.contactInfo?.email?.message}>
                <Input type="email" placeholder="dcrgpi.info@gmail.com" {...register("contactInfo.email")} />
              </Field>
              <Field label="Phone number" error={errors.contactInfo?.phone?.message}>
                <Input placeholder="+880 1712 345 678" {...register("contactInfo.phone")} />
              </Field>
              <Field label="Address" error={errors.contactInfo?.address?.message} className="sm:col-span-2">
                <Textarea rows={2} placeholder="Rangpur Government Polytechnic Institute, Rangpur" {...register("contactInfo.address")} />
              </Field>
              <Field label="Google Maps link" error={errors.contactInfo?.mapUrl?.message} className="sm:col-span-2" hint="Optional. Opens directions in a new tab.">
                <Input placeholder="https://maps.google.com/?q=…" {...register("contactInfo.mapUrl")} />
              </Field>
            </FormGrid>
          </FormSection>

          <ArraySection
            title="Social media"
            description="Links appear in the footer and contact page."
            onAdd={() => setValue("socialLinks", [...watch("socialLinks"), { platform: "", url: "" }], { shouldValidate: true })}
            addLabel="Add social link"
          >
            <div className="space-y-2">
              {watch("socialLinks").map((link, index) => (
                <div key={`social-${index}`} className="flex flex-wrap items-end gap-2 rounded-lg border border-white/[0.07] bg-white/[0.02] p-3">
                  <div className="w-36">
                    <label className="mb-1 block text-[0.55rem] uppercase tracking-[0.12em] text-cream/30">Platform</label>
                    <Input
                      value={link.platform}
                      onChange={(event) => {
                        const next = [...watch("socialLinks")];
                        next[index] = { ...link, platform: event.target.value };
                        setValue("socialLinks", next, { shouldValidate: true });
                      }}
                      placeholder="Facebook"
                    />
                  </div>
                  <div className="min-w-[200px] flex-1">
                    <label className="mb-1 block text-[0.55rem] uppercase tracking-[0.12em] text-cream/30">URL</label>
                    <Input
                      value={link.url}
                      onChange={(event) => {
                        const next = [...watch("socialLinks")];
                        next[index] = { ...link, url: event.target.value };
                        setValue("socialLinks", next, { shouldValidate: true });
                      }}
                      placeholder="https://facebook.com/dcrgpi"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setValue("socialLinks", watch("socialLinks").filter((_, i) => i !== index), { shouldValidate: true })}
                    className="rounded p-2.5 text-cream/35 transition hover:bg-red-400/10 hover:text-red-300"
                    aria-label="Remove social link"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </ArraySection>
        </div>
      )}

      {tab === "footer" && (
        <FormSection title="Footer content" description="The closing note on every public page.">
          <div className="space-y-4">
            <Field label="Footer tagline" error={errors.footerTagline?.message}>
              <Input placeholder="A community of thinkers, speakers, and future leaders." {...register("footerTagline")} />
            </Field>
            <Field label="Footer description" error={errors.footerText?.message}>
              <Textarea rows={3} placeholder="A short paragraph about the club." {...register("footerText")} />
            </Field>
            <FormGrid>
              <Field label="Institute information" error={errors.instituteInfo?.message}>
                <Input placeholder="Rangpur Government Polytechnic Institute, Rangpur" {...register("instituteInfo")} />
              </Field>
              <Field label="Copyright line" error={errors.copyright?.message}>
                <Input placeholder="DCRGPI. All rights reserved." {...register("copyright")} />
              </Field>
            </FormGrid>
          </div>
        </FormSection>
      )}

      {tab === "navigation" && (
        <FormSection title="Header navigation" description="Control the links in the public site header, their labels and order.">
          <div className="space-y-2">
            {watch("navItems").map((item, index) => (
              <div key={`nav-${index}`} className="flex flex-wrap items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.02] px-3 py-2.5">
                <span className="w-5 shrink-0 text-center text-[0.62rem] text-cream/25">{index + 1}</span>
                <Input
                  value={item.label}
                  onChange={(event) => {
                    const next = [...watch("navItems")];
                    next[index] = { ...item, label: event.target.value };
                    setValue("navItems", next, { shouldValidate: true });
                  }}
                  placeholder="Label"
                  className="h-9 w-32 text-xs"
                  aria-label={`Navigation label ${index + 1}`}
                />
                <Input
                  value={item.href}
                  onChange={(event) => {
                    const next = [...watch("navItems")];
                    next[index] = { ...item, href: event.target.value };
                    setValue("navItems", next, { shouldValidate: true });
                  }}
                  placeholder="/about"
                  className="h-9 min-w-[140px] flex-1 text-xs"
                  aria-label={`Navigation link ${index + 1}`}
                />
                <Switch
                  checked={item.visible}
                  onCheckedChange={(checked) => {
                    const next = [...watch("navItems")];
                    next[index] = { ...item, visible: checked };
                    setValue("navItems", next, { shouldValidate: true });
                  }}
                  label={item.visible ? "Visible" : "Hidden"}
                />
                <div className="flex items-center gap-0.5">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => {
                      const next = [...watch("navItems")];
                      [next[index - 1], next[index]] = [next[index], next[index - 1]];
                      setValue("navItems", next.map((entry, position) => ({ ...entry, order: position })), { shouldValidate: true });
                    }}
                    className="rounded p-1.5 text-cream/35 transition hover:bg-white/[0.06] hover:text-cream disabled:opacity-25"
                    aria-label="Move navigation item up"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={index === watch("navItems").length - 1}
                    onClick={() => {
                      const next = [...watch("navItems")];
                      [next[index + 1], next[index]] = [next[index], next[index + 1]];
                      setValue("navItems", next.map((entry, position) => ({ ...entry, order: position })), { shouldValidate: true });
                    }}
                    className="rounded p-1.5 text-cream/35 transition hover:bg-white/[0.06] hover:text-cream disabled:opacity-25"
                    aria-label="Move navigation item down"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setValue("navItems", watch("navItems").filter((_, i) => i !== index), { shouldValidate: true })}
                    className="rounded p-1.5 text-cream/35 transition hover:bg-red-400/10 hover:text-red-300"
                    aria-label="Remove navigation item"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              setValue(
                "navItems",
                [...watch("navItems"), { label: "", href: "/", visible: true, order: watch("navItems").length }],
                { shouldValidate: true }
              )
            }
            className="mt-3 h-9 px-4 text-[0.65rem] uppercase tracking-[0.1em]"
          >
            <Plus className="h-3.5 w-3.5" /> Add navigation item
          </Button>
        </FormSection>
      )}

      <FormError message={serverError} />
      <SaveBar
        cancelHref="/admin"
        submitLabel="Save website settings"
        isSubmitting={isSubmitting}
        disabled={demo}
        note="These changes update the public website immediately after saving."
      />
    </form>
  );
}

function ArraySection({
  title,
  description,
  onAdd,
  addLabel,
  children,
}: {
  title: string;
  description: string;
  onAdd: () => void;
  addLabel: string;
  children: React.ReactNode;
}) {
  return (
    <FormSection title={title} description={description}>
      {children}
      <Button type="button" variant="outline" onClick={onAdd} className="mt-3 h-9 px-4 text-[0.65rem] uppercase tracking-[0.1em]">
        <Plus className="h-3.5 w-3.5" /> {addLabel}
      </Button>
    </FormSection>
  );
}
