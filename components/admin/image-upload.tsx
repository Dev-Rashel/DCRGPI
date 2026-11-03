"use client";

import * as React from "react";
import { ImagePlus, Loader2, Link2, Trash2, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function ImageUpload({
  value,
  onChange,
  folder = "general",
  previewClassName,
  compact = false,
}: {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  previewClassName?: string;
  compact?: boolean;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const upload = async (file: File) => {
    setError(null);
    if (file.size > 4 * 1024 * 1024) {
      setError("File is too large. Maximum size is 4 MB.");
      return;
    }
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("folder", folder);
      const response = await fetch("/api/upload", { method: "POST", body });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        const message = payload.error ?? "The image could not be uploaded.";
        setError(message);
        toast.error(message);
        return;
      }
      onChange(payload.data.url as string);
      toast.success("Image uploaded");
    } catch {
      setError("Network error while uploading. Please try again.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2.5">
      <div
        className={cn(
          "group relative flex items-center justify-center overflow-hidden rounded-xl border border-dashed border-white/15 bg-white/[0.025]",
          compact ? "h-24 w-24" : "aspect-[16/9] w-full",
          previewClassName
        )}
      >
        {value ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="Selected preview" className="h-full w-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-ink-950/70 opacity-0 backdrop-blur-[1px] transition group-hover:opacity-100 group-focus-within:opacity-100">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="rounded-full border border-white/25 p-2 text-cream transition hover:border-gold-400/60 hover:text-gold-200"
                aria-label="Replace image"
              >
                <ImagePlus className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => onChange("")}
                className="rounded-full border border-white/25 p-2 text-cream transition hover:border-red-400/60 hover:text-red-300"
                aria-label="Remove image"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex h-full w-full flex-col items-center justify-center gap-2 px-4 text-center text-cream/40 transition hover:bg-white/[0.02] hover:text-cream/70"
          >
            {uploading ? (
              <Loader2 className="h-6 w-6 animate-spin text-gold-300" />
            ) : (
              <UploadCloud className="h-6 w-6 text-gold-400/60" />
            )}
            <span className="text-[0.68rem] font-medium">
              {uploading ? "Uploading…" : compact ? "Add photo" : "Click to upload, or paste a URL below"}
            </span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void upload(file);
        }}
      />

      <div className="flex items-center gap-2">
        <Link2 className="h-3.5 w-3.5 shrink-0 text-cream/30" />
        <Input
          value={value}
          onChange={(event) => {
            setError(null);
            onChange(event.target.value);
          }}
          placeholder="https://res.cloudinary.com/… or /placeholder.svg"
          className="h-9 text-xs"
          aria-label="Image URL"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-white/10 px-3 text-[0.65rem] font-semibold uppercase tracking-[0.08em] text-cream/60 transition hover:border-gold-400/40 hover:text-gold-200 disabled:opacity-50"
        >
          {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <UploadCloud className="h-3.5 w-3.5" />}
          Upload
        </button>
      </div>
      {error && <p className="text-[0.68rem] text-red-300">{error}</p>}
    </div>
  );
}
