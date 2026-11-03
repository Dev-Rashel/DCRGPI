"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { toast } from "sonner";
import { AlertTriangle, Loader2, Megaphone, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Dialog, ConfirmDialog } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { AdminEmptyState } from "@/components/admin/ui";
import { Field, FormError, FormGrid } from "@/components/admin/form";
import { noticeSchema } from "@/lib/validation";
import { apiRequest, fromApiError, toDateTimeLocal } from "@/lib/admin-utils";
import { formatDate } from "@/lib/utils";
import type { NoticeDTO } from "@/lib/types";

type FormValues = z.infer<typeof noticeSchema>;

export function NoticesManager({ initialItems, demo }: { initialItems: NoticeDTO[]; demo: boolean }) {
  const router = useRouter();
  const [items, setItems] = React.useState(initialItems);
  const [query, setQuery] = React.useState("");
  const [filter, setFilter] = React.useState<"all" | "published" | "draft">("all");
  const [editing, setEditing] = React.useState<NoticeDTO | null | undefined>(undefined);
  const [deleting, setDeleting] = React.useState<NoticeDTO | null>(null);
  const [working, setWorking] = React.useState(false);

  React.useEffect(() => setItems(initialItems), [initialItems]);

  const filtered = React.useMemo(() => {
    const needle = query.trim().toLowerCase();
    return items.filter((notice) => {
      if (filter !== "all" && notice.status !== filter) return false;
      if (!needle) return true;
      return [notice.title, notice.content].join(" ").toLowerCase().includes(needle);
    });
  }, [items, query, filter]);

  const toggleStatus = async (notice: NoticeDTO) => {
    setWorking(true);
    try {
      const next = notice.status === "published" ? "draft" : "published";
      const { ok, payload } = await apiRequest(`/api/notices/${notice.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: next }),
      });
      if (!ok) {
        toast.error(fromApiError(payload));
        return;
      }
      setItems((current) => current.map((item) => (item.id === notice.id ? { ...item, status: next } : item)));
      toast.success(next === "published" ? "Notice published" : "Notice moved to drafts");
      router.refresh();
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setWorking(false);
    }
  };

  const remove = async () => {
    if (!deleting) return;
    setWorking(true);
    try {
      const { ok, payload } = await apiRequest(`/api/notices/${deleting.id}`, { method: "DELETE" });
      if (!ok) {
        toast.error(fromApiError(payload));
        return;
      }
      setItems((current) => current.filter((item) => item.id !== deleting.id));
      toast.success("Notice deleted");
      setDeleting(null);
      router.refresh();
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setWorking(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {(["all", "published", "draft"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilter(tab)}
                className={`rounded-full border px-3.5 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.08em] transition ${
                  filter === tab
                    ? "border-gold-400/40 bg-gold-400/10 text-gold-200"
                    : "border-white/10 text-cream/45 hover:border-white/25 hover:text-cream/80"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-cream/30" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search notices…"
              className="h-9 w-48 pl-8 text-xs"
              aria-label="Search notices"
            />
          </div>
        </div>
        <Button type="button" onClick={() => setEditing(null)} disabled={demo} className="h-9 px-4 text-[0.65rem] uppercase tracking-[0.1em]">
          <Plus className="h-3.5 w-3.5" /> New notice
        </Button>
      </div>

      {filtered.length === 0 ? (
        <AdminEmptyState
          icon={Megaphone}
          title={items.length ? "No matching notices" : "No notices yet"}
          description={
            items.length
              ? "Try a different search term or status filter."
              : "Publish short announcements for the notice bar at the top of the website."
          }
          action={
            !demo ? (
              <Button type="button" onClick={() => setEditing(null)} size="sm">
                <Megaphone className="h-3.5 w-3.5" /> Create a notice
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid gap-3 lg:grid-cols-2">
          {filtered.map((notice) => {
            const expired = notice.expiresAt ? new Date(notice.expiresAt).getTime() < Date.now() : false;
            return (
              <article key={notice.id} className="surface flex flex-col p-5">
                <div className="flex flex-wrap items-center gap-2">
                  {notice.isImportant && (
                    <Badge variant="danger">
                      <AlertTriangle className="h-3 w-3" /> Important
                    </Badge>
                  )}
                  <Badge variant={notice.status === "published" ? "success" : "muted"}>{notice.status}</Badge>
                  {expired && <Badge variant="warning">Expired</Badge>}
                  <span className="ml-auto text-[0.62rem] text-cream/25">
                    {notice.publishedAt ? formatDate(notice.publishedAt) : "Not published"}
                  </span>
                </div>

                <h3 className="mt-3 font-display text-lg font-semibold text-cream">{notice.title}</h3>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-cream/55">{notice.content}</p>

                <div className="mt-auto flex items-center justify-between gap-3 border-t border-white/[0.07] pt-3.5 text-[0.62rem] text-cream/30">
                  <span>{notice.expiresAt ? `Expires ${formatDate(notice.expiresAt)}` : "No expiry"}</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => toggleStatus(notice)}
                      disabled={demo || working}
                      className="rounded-md px-2 py-1.5 font-semibold uppercase tracking-[0.06em] text-cream/45 transition hover:bg-white/[0.06] hover:text-gold-200 disabled:opacity-30"
                    >
                      {notice.status === "published" ? "Unpublish" : "Publish"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditing(notice)}
                      disabled={demo}
                      className="rounded p-1.5 text-cream/35 transition hover:bg-white/[0.06] hover:text-gold-200 disabled:opacity-25"
                      aria-label="Edit notice"
                      title="Edit"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleting(notice)}
                      disabled={demo}
                      className="rounded p-1.5 text-cream/35 transition hover:bg-red-400/10 hover:text-red-300 disabled:opacity-25"
                      aria-label="Delete notice"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <Dialog
        open={editing !== undefined}
        onOpenChange={(open) => !open && setEditing(undefined)}
        title={editing ? "Edit notice" : "New notice"}
        description="Short announcements appear in the notice bar and on the homepage."
        className="sm:max-w-lg"
      >
        {editing !== undefined && (
          <NoticeEditor
            key={editing?.id ?? "new"}
            notice={editing ?? undefined}
            onCancel={() => setEditing(undefined)}
            onSaved={() => {
              setEditing(undefined);
              router.refresh();
            }}
          />
        )}
      </Dialog>

      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Delete this notice?"
        description={deleting ? `“${deleting.title}” will be permanently removed.` : ""}
        loading={working}
        onConfirm={remove}
      />
    </div>
  );
}

function NoticeEditor({
  notice,
  onCancel,
  onSaved,
}: {
  notice?: NoticeDTO;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const [serverError, setServerError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(noticeSchema),
    defaultValues: notice
      ? {
          title: notice.title,
          content: notice.content,
          status: notice.status,
          isImportant: notice.isImportant,
          publishedAt: toDateTimeLocal(notice.publishedAt),
          expiresAt: toDateTimeLocal(notice.expiresAt),
        }
      : {
          title: "",
          content: "",
          status: "published",
          isImportant: false,
          publishedAt: "",
          expiresAt: "",
        },
  });

  const isImportant = watch("isImportant");

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    const payload = {
      ...values,
      publishedAt: values.publishedAt || null,
      expiresAt: values.expiresAt || null,
    };
    const { ok, payload: result } = await apiRequest(notice ? `/api/notices/${notice.id}` : "/api/notices", {
      method: notice ? "PATCH" : "POST",
      body: JSON.stringify(payload),
    });
    if (!ok) {
      setServerError(fromApiError(result));
      return;
    }
    toast.success(notice ? "Notice updated" : "Notice created");
    onSaved();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <Field label="Title" error={errors.title?.message} required>
        <Input placeholder="e.g. Membership interviews begin next week" {...register("title")} />
      </Field>

      <Field label="Notice text" error={errors.content?.message} required hint="Keep it short — one or two sentences.">
        <Textarea rows={4} placeholder="What do members need to know?" {...register("content")} />
      </Field>

      <FormGrid>
        <Field label="Status" error={errors.status?.message}>
          <Select {...register("status")}>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </Select>
        </Field>
        <Field label="Publish date" error={errors.publishedAt?.message} hint="Leave blank to publish now">
          <Input type="datetime-local" {...register("publishedAt")} />
        </Field>
        <Field label="Expires" error={errors.expiresAt?.message} hint="Optional — hide after this date">
          <Input type="datetime-local" {...register("expiresAt")} />
        </Field>
        <div className="flex items-end">
          <div className="flex h-11 w-full items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-3.5">
            <span className="text-xs text-cream/60">Mark as important</span>
            <Switch checked={Boolean(isImportant)} onCheckedChange={(checked) => setValue("isImportant", checked)} label="Important" />
          </div>
        </div>
      </FormGrid>

      <FormError message={serverError} />

      <div className="flex justify-end gap-3 border-t border-white/[0.08] pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="h-10 px-5 text-xs">
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} className="h-10 px-5 text-xs">
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {notice ? "Save changes" : "Create notice"}
        </Button>
      </div>
    </form>
  );
}
