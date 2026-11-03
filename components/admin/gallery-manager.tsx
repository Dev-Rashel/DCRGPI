"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, ImagePlus, Images, Loader2, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Dialog, ConfirmDialog } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { AdminEmptyState } from "@/components/admin/ui";
import { Field, FormError, FormGrid } from "@/components/admin/form";
import { ImageUpload } from "@/components/admin/image-upload";
import { gallerySchema } from "@/lib/validation";
import { GALLERY_ALBUMS } from "@/lib/constants";
import { apiRequest, fromApiError } from "@/lib/admin-utils";
import { formatDate } from "@/lib/utils";
import type { EventDTO, GalleryItemDTO } from "@/lib/types";

type FormValues = z.infer<typeof gallerySchema>;

export function GalleryManager({
  initialItems,
  events,
  demo,
}: {
  initialItems: GalleryItemDTO[];
  events: Pick<EventDTO, "id" | "title">[];
  demo: boolean;
}) {
  const [items, setItems] = React.useState(initialItems);
  const [query, setQuery] = React.useState("");
  const [album, setAlbum] = React.useState("all");
  const [editing, setEditing] = React.useState<GalleryItemDTO | null | undefined>(undefined);
  const [deleting, setDeleting] = React.useState<GalleryItemDTO | null>(null);
  const [working, setWorking] = React.useState(false);

  React.useEffect(() => setItems(initialItems), [initialItems]);

  const sorted = React.useMemo(
    () => [...items].sort((a, b) => a.displayOrder - b.displayOrder || new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()),
    [items]
  );

  const filtered = React.useMemo(() => {
    const needle = query.trim().toLowerCase();
    return sorted.filter((item) => {
      if (album !== "all" && item.album !== album) return false;
      if (!needle) return true;
      return [item.caption, item.album].join(" ").toLowerCase().includes(needle);
    });
  }, [sorted, query, album]);

  const reload = async () => {
    const { ok, payload } = await apiRequest("/api/gallery");
    if (ok && Array.isArray(payload.data)) setItems(payload.data as GalleryItemDTO[]);
  };

  const remove = async () => {
    if (!deleting) return;
    setWorking(true);
    try {
      const { ok, payload } = await apiRequest(`/api/gallery/${deleting.id}`, { method: "DELETE" });
      if (!ok) {
        toast.error(fromApiError(payload));
        return;
      }
      setItems((current) => current.filter((item) => item.id !== deleting.id));
      toast.success("Photo removed");
      setDeleting(null);
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setWorking(false);
    }
  };

  const move = async (item: GalleryItemDTO, direction: -1 | 1) => {
    const index = sorted.findIndex((entry) => entry.id === item.id);
    const target = sorted[index + direction];
    if (index < 0 || !target) return;

    const next = [...sorted];
    next[index] = target;
    next[index + direction] = item;
    const order = next.map((entry, position) => ({ id: entry.id, displayOrder: position + 1 }));

    setItems(next.map((entry, position) => ({ ...entry, displayOrder: position + 1 })));
    try {
      const { ok, payload } = await apiRequest("/api/gallery", { method: "PATCH", body: JSON.stringify({ order }) });
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
              placeholder="Search captions…"
              className="h-9 w-48 pl-8 text-xs"
              aria-label="Search gallery"
            />
          </div>
          <Select value={album} onChange={(event) => setAlbum(event.target.value)} className="h-9 w-48 text-xs" aria-label="Filter by album">
            <option value="all">All albums</option>
            {GALLERY_ALBUMS.map((item) => (
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
          className="h-9 px-4 text-[0.65rem] uppercase tracking-[0.1em]"
        >
          <Plus className="h-3.5 w-3.5" /> Upload photo
        </Button>
      </div>

      {filtered.length === 0 ? (
        <AdminEmptyState
          icon={Images}
          title={items.length ? "No matching photos" : "No photos yet"}
          description={
            items.length ? "Try a different search term or album." : "Upload moments from debates, workshops and ceremonies to build the gallery."
          }
          action={
            !demo ? (
              <Button type="button" onClick={() => setEditing(null)} size="sm">
                <ImagePlus className="h-3.5 w-3.5" /> Upload photo
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {filtered.map((item) => (
            <article key={item.id} className="surface group overflow-hidden">
              <div className="relative aspect-[4/3] overflow-hidden bg-ink-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.imageUrl} alt={item.caption || item.album} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
                <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-2.5">
                  <Badge variant="default">{item.album}</Badge>
                  <span className="rounded-full bg-ink-950/70 px-2 py-1 text-[0.6rem] text-cream/60">#{item.displayOrder || "—"}</span>
                </div>
              </div>
              <div className="p-3.5">
                <p className="line-clamp-1 text-sm font-medium text-cream/85">{item.caption || "Untitled photo"}</p>
                <p className="mt-0.5 text-[0.62rem] text-cream/30">Uploaded {formatDate(item.uploadedAt)}</p>
                <div className="mt-3 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => move(item, -1)}
                    disabled={demo || sorted[0]?.id === item.id}
                    className="rounded p-1.5 text-cream/35 transition hover:bg-white/[0.06] hover:text-cream disabled:opacity-25"
                    aria-label="Move earlier"
                    title="Move earlier"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(item, 1)}
                    disabled={demo || sorted[sorted.length - 1]?.id === item.id}
                    className="rounded p-1.5 text-cream/35 transition hover:bg-white/[0.06] hover:text-cream disabled:opacity-25"
                    aria-label="Move later"
                    title="Move later"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                  <span className="mx-1 h-4 w-px bg-white/10" />
                  <button
                    type="button"
                    onClick={() => setEditing(item)}
                    disabled={demo}
                    className="rounded p-1.5 text-cream/35 transition hover:bg-white/[0.06] hover:text-gold-200 disabled:opacity-25"
                    aria-label="Edit photo"
                    title="Edit"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleting(item)}
                    disabled={demo}
                    className="rounded p-1.5 text-cream/35 transition hover:bg-red-400/10 hover:text-red-300 disabled:opacity-25"
                    aria-label="Delete photo"
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
        title={editing ? "Edit photo" : "Upload photo"}
        description="Photos appear in the public gallery and on the homepage preview."
        className="sm:max-w-lg"
      >
        {editing !== undefined && (
          <GalleryEditor
            key={editing?.id ?? "new"}
            item={editing ?? undefined}
            events={events}
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
        title="Delete this photo?"
        description={deleting ? `“${deleting.caption || deleting.album}” will be removed from the gallery.` : ""}
        loading={working}
        onConfirm={remove}
      />
    </div>
  );
}

function GalleryEditor({
  item,
  events,
  onCancel,
  onSaved,
}: {
  item?: GalleryItemDTO;
  events: Pick<EventDTO, "id" | "title">[];
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
    resolver: zodResolver(gallerySchema),
    defaultValues: item
      ? {
          imageUrl: item.imageUrl,
          caption: item.caption,
          album: (GALLERY_ALBUMS as readonly string[]).includes(item.album) ? (item.album as FormValues["album"]) : "Campus Events",
          eventId: item.eventId,
          displayOrder: item.displayOrder,
        }
      : {
          imageUrl: "",
          caption: "",
          album: "Campus Events",
          eventId: "",
          displayOrder: 0,
        },
  });

  const imageUrl = watch("imageUrl");

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    const { ok, payload } = await apiRequest(item ? `/api/gallery/${item.id}` : "/api/gallery", {
      method: item ? "PATCH" : "POST",
      body: JSON.stringify(values),
    });
    if (!ok) {
      setServerError(fromApiError(payload));
      return;
    }
    toast.success(item ? "Photo updated" : "Photo uploaded");
    await onSaved();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <Field label="Photo" error={errors.imageUrl?.message} required>
        <ImageUpload value={imageUrl} onChange={(url) => setValue("imageUrl", url, { shouldValidate: true })} folder="gallery" />
      </Field>

      <Field label="Caption" error={errors.caption?.message} hint="Optional description shown in the lightbox.">
        <Input placeholder="e.g. Semi-final round at the North Bengal Championship" {...register("caption")} />
      </Field>

      <FormGrid>
        <Field label="Album" error={errors.album?.message}>
          <Select {...register("album")}>
            {GALLERY_ALBUMS.map((album) => (
              <option key={album} value={album}>
                {album}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Display order" error={errors.displayOrder?.message} hint="Lower numbers appear first">
          <Input type="number" min={0} max={999} {...register("displayOrder")} />
        </Field>
      </FormGrid>

      <Field label="Linked event" error={errors.eventId?.message} hint="Optional — connect this photo to an event.">
        <Select {...register("eventId")}>
          <option value="">No event</option>
          {events.map((event) => (
            <option key={event.id} value={event.id}>
              {event.title}
            </option>
          ))}
        </Select>
      </Field>

      <FormError message={serverError} />

      <div className="flex justify-end gap-3 border-t border-white/[0.08] pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="h-10 px-5 text-xs">
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} className="h-10 px-5 text-xs">
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {item ? "Save changes" : "Add photo"}
        </Button>
      </div>
    </form>
  );
}
