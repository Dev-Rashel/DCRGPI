"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, Loader2, Pencil, Plus, Search, Trash2, UserRound, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Dialog, ConfirmDialog } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { AdminEmptyState } from "@/components/admin/ui";
import { Field, FormError, FormGrid } from "@/components/admin/form";
import { ImageUpload } from "@/components/admin/image-upload";
import { teamMemberSchema } from "@/lib/validation";
import { COMMITTEES } from "@/lib/constants";
import { apiRequest, fromApiError } from "@/lib/admin-utils";
import { cn, initials } from "@/lib/utils";
import type { TeamMemberDTO } from "@/lib/types";

type FormValues = z.infer<typeof teamMemberSchema>;

export function TeamManager({ initialItems, demo }: { initialItems: TeamMemberDTO[]; demo: boolean }) {
  const [items, setItems] = React.useState(initialItems);
  const [query, setQuery] = React.useState("");
  const [committee, setCommittee] = React.useState("all");
  const [editing, setEditing] = React.useState<TeamMemberDTO | null | undefined>(undefined);
  const [deleting, setDeleting] = React.useState<TeamMemberDTO | null>(null);
  const [working, setWorking] = React.useState(false);

  const sorted = React.useMemo(
    () => [...items].sort((a, b) => a.displayOrder - b.displayOrder || a.name.localeCompare(b.name)),
    [items]
  );

  const filtered = React.useMemo(() => {
    const needle = query.trim().toLowerCase();
    return sorted.filter((member) => {
      if (committee !== "all" && member.committee !== committee) return false;
      if (!needle) return true;
      return [member.name, member.designation, member.department, member.bio].join(" ").toLowerCase().includes(needle);
    });
  }, [sorted, query, committee]);

  const reload = async () => {
    const { ok, payload } = await apiRequest("/api/team");
    if (ok && Array.isArray(payload.data)) setItems(payload.data as TeamMemberDTO[]);
  };

  const remove = async () => {
    if (!deleting) return;
    setWorking(true);
    try {
      const { ok, payload } = await apiRequest(`/api/team/${deleting.id}`, { method: "DELETE" });
      if (!ok) {
        toast.error(fromApiError(payload));
        return;
      }
      setItems((current) => current.filter((member) => member.id !== deleting.id));
      toast.success("Team member removed");
      setDeleting(null);
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setWorking(false);
    }
  };

  const move = async (member: TeamMemberDTO, direction: -1 | 1) => {
    const index = sorted.findIndex((entry) => entry.id === member.id);
    const target = sorted[index + direction];
    if (index < 0 || !target) return;

    const next = [...sorted];
    next[index] = target;
    next[index + direction] = member;
    const order = next.map((entry, position) => ({ id: entry.id, displayOrder: position + 1 }));

    setItems(next.map((entry, position) => ({ ...entry, displayOrder: position + 1 })));
    try {
      const { ok, payload } = await apiRequest("/api/team", { method: "PATCH", body: JSON.stringify({ order }) });
      if (!ok) {
        toast.error(fromApiError(payload));
        await reload();
        return;
      }
      toast.success("Order updated");
    } catch {
      toast.error("Network error. Please try again.");
      await reload();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-cream/30" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search people…"
              className="h-9 w-48 pl-8 text-xs"
              aria-label="Search team"
            />
          </div>
          <Select
            value={committee}
            onChange={(event) => setCommittee(event.target.value)}
            className="h-9 w-52 text-xs"
            aria-label="Filter by committee"
          >
            <option value="all">All committees</option>
            {COMMITTEES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
        </div>
        <Button
          type="button"
          onClick={() => setEditing(null)}
          disabled={demo}
          title={demo ? "Connect MongoDB to edit content" : undefined}
          className="h-9 px-4 text-[0.65rem] uppercase tracking-[0.1em]"
        >
          <Plus className="h-3.5 w-3.5" /> Add member
        </Button>
      </div>

      {filtered.length === 0 ? (
        <AdminEmptyState
          icon={Users}
          title={items.length ? "No matching people" : "No leadership profiles yet"}
          description={
            items.length
              ? "Try a different search term or committee."
              : "Add the president, secretary, organizers and mentors who lead the club."
          }
          action={
            !demo ? (
              <Button type="button" onClick={() => setEditing(null)} size="sm">
                <Plus className="h-3.5 w-3.5" /> Add member
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-3">
          {filtered.map((member) => (
            <article key={member.id} className="surface flex gap-3.5 p-4">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-ink-800">
                {member.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={member.photo} alt={member.name} className="h-full w-full object-cover" />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-sm font-semibold text-gold-300/70">
                    {initials(member.name) || <UserRound className="h-5 w-5" />}
                  </span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-cream/90">{member.name}</p>
                    <p className="truncate text-[0.7rem] text-cream/45">{member.designation}</p>
                  </div>
                  <Badge variant={member.isActive ? "success" : "muted"}>{member.isActive ? "Active" : "Hidden"}</Badge>
                </div>
                <p className="mt-1.5 truncate text-[0.65rem] text-cream/30">
                  {member.committee}
                  {member.department ? ` · ${member.department}` : ""}
                </p>
                <div className="mt-2.5 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => move(member, -1)}
                    disabled={demo || sorted[0]?.id === member.id}
                    className="rounded p-1.5 text-cream/35 transition hover:bg-white/[0.06] hover:text-cream disabled:opacity-25"
                    aria-label="Move up"
                    title="Move up"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(member, 1)}
                    disabled={demo || sorted[sorted.length - 1]?.id === member.id}
                    className="rounded p-1.5 text-cream/35 transition hover:bg-white/[0.06] hover:text-cream disabled:opacity-25"
                    aria-label="Move down"
                    title="Move down"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                  <span className="mx-1 h-4 w-px bg-white/10" />
                  <button
                    type="button"
                    onClick={() => setEditing(member)}
                    disabled={demo}
                    className="rounded p-1.5 text-cream/35 transition hover:bg-white/[0.06] hover:text-gold-200 disabled:opacity-25"
                    aria-label="Edit member"
                    title="Edit"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleting(member)}
                    disabled={demo}
                    className="rounded p-1.5 text-cream/35 transition hover:bg-red-400/10 hover:text-red-300 disabled:opacity-25"
                    aria-label="Delete member"
                    title="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <Dialog
        open={editing !== undefined}
        onOpenChange={(open) => !open && setEditing(undefined)}
        title={editing ? "Edit team member" : "Add team member"}
        description="Profiles appear on the public team page, grouped by committee."
        className="sm:max-w-2xl"
      >
        {editing !== undefined && (
          <TeamMemberEditor
            key={editing?.id ?? "new"}
            member={editing ?? undefined}
            onCancel={() => setEditing(undefined)}
            onSaved={async () => {
              await reload();
              setEditing(undefined);
            }}
          />
        )}
      </Dialog>

      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Remove this team member?"
        description={deleting ? `${deleting.name}'s profile will be permanently removed from the team page.` : ""}
        loading={working}
        onConfirm={remove}
      />
    </div>
  );
}

function TeamMemberEditor({
  member,
  onCancel,
  onSaved,
}: {
  member?: TeamMemberDTO;
  onCancel: () => void;
  onSaved: () => Promise<void>;
}) {
  const [serverError, setServerError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(teamMemberSchema),
    defaultValues: member
      ? {
          name: member.name,
          designation: member.designation,
          committee: (COMMITTEES as readonly string[]).includes(member.committee)
            ? (member.committee as FormValues["committee"])
            : "Executive Committee",
          photo: member.photo,
          bio: member.bio,
          department: member.department,
          displayOrder: member.displayOrder,
          isActive: member.isActive,
          socialLinks: {
            facebook: member.socialLinks.facebook ?? "",
            linkedin: member.socialLinks.linkedin ?? "",
            x: member.socialLinks.x ?? "",
            instagram: member.socialLinks.instagram ?? "",
            email: member.socialLinks.email ?? "",
          },
        }
      : {
          name: "",
          designation: "",
          committee: "Executive Committee",
          photo: "",
          bio: "",
          department: "",
          displayOrder: 0,
          isActive: true,
          socialLinks: { facebook: "", linkedin: "", x: "", instagram: "", email: "" },
        },
  });

  const photo = watch("photo");
  const isActive = watch("isActive");

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    const { ok, payload } = await apiRequest(member ? `/api/team/${member.id}` : "/api/team", {
      method: member ? "PATCH" : "POST",
      body: JSON.stringify(values),
    });
    if (!ok) {
      setServerError(fromApiError(payload));
      return;
    }
    toast.success(member ? "Team member updated" : "Team member added");
    await onSaved();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <FormGrid>
        <Field label="Full name" error={errors.name?.message} required>
          <Input placeholder="e.g. Sumaiya Akter" {...register("name")} />
        </Field>
        <Field label="Designation" error={errors.designation?.message} required>
          <Input placeholder="e.g. President" {...register("designation")} />
        </Field>
        <Field label="Committee" error={errors.committee?.message}>
          <Select {...register("committee")}>
            {COMMITTEES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Department" error={errors.department?.message} hint="Optional">
          <Input placeholder="e.g. Computer Technology" {...register("department")} />
        </Field>
        <Field label="Display order" error={errors.displayOrder?.message} hint="Lower numbers appear first">
          <Input type="number" min={0} max={999} {...register("displayOrder")} />
        </Field>
        <div className="flex items-end">
          <div className="flex h-11 w-full items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-3.5">
            <span className="text-xs text-cream/60">Visible on the team page</span>
            <Switch checked={Boolean(isActive)} onCheckedChange={(checked) => setValue("isActive", checked)} label="Visible" />
          </div>
        </div>
      </FormGrid>

      <Field label="Photo">
        <ImageUpload value={photo} onChange={(url) => setValue("photo", url, { shouldValidate: true })} folder="team" previewClassName="max-w-xs" />
      </Field>

      <Field label="Short bio" error={errors.bio?.message} hint="Optional — one or two sentences">
        <Textarea rows={3} placeholder="Role, interests and debating experience…" {...register("bio")} />
      </Field>

      <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
        <p className="mb-3 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-cream/35">Social links</p>
        <FormGrid>
          <Field label="Facebook">
            <Input placeholder="https://facebook.com/…" {...register("socialLinks.facebook")} />
          </Field>
          <Field label="LinkedIn">
            <Input placeholder="https://linkedin.com/in/…" {...register("socialLinks.linkedin")} />
          </Field>
          <Field label="X / Twitter">
            <Input placeholder="https://x.com/…" {...register("socialLinks.x")} />
          </Field>
          <Field label="Instagram">
            <Input placeholder="https://instagram.com/…" {...register("socialLinks.instagram")} />
          </Field>
          <Field label="Public email" className="sm:col-span-2">
            <Input type="email" placeholder="name@example.com" {...register("socialLinks.email")} />
          </Field>
        </FormGrid>
      </div>

      <FormError message={serverError} />

      <div className="flex justify-end gap-3 border-t border-white/[0.08] pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="h-10 px-5 text-xs">
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} className="h-10 px-5 text-xs">
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {member ? "Save changes" : "Add member"}
        </Button>
      </div>
    </form>
  );
}
