"use client";

import * as React from "react";
import {
  Bold,
  Code2,
  Heading2,
  Heading3,
  Italic,
  Link2,
  List,
  ListOrdered,
  Pilcrow,
  Quote,
  Redo2,
  RemoveFormatting,
  Underline,
  Undo2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const BUTTON =
  "inline-flex h-8 w-8 items-center justify-center rounded-md text-cream/55 transition hover:bg-white/[0.07] hover:text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/60";

export function RichTextEditor({
  value,
  onChange,
  id,
  placeholder = "Write the article…",
  minHeight = "min-h-[280px]",
}: {
  value: string;
  onChange: (html: string) => void;
  id?: string;
  placeholder?: string;
  minHeight?: string;
}) {
  const editorRef = React.useRef<HTMLDivElement | null>(null);
  const [mode, setMode] = React.useState<"visual" | "html">("visual");

  React.useEffect(() => {
    if (mode !== "visual") return;
    const el = editorRef.current;
    if (!el) return;
    if (document.activeElement === el) return;
    if (el.innerHTML !== value) el.innerHTML = value;
  }, [value, mode]);

  const emit = () => {
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  };

  const run = (command: string, argument?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, argument);
    emit();
  };

  const addLink = () => {
    const url = window.prompt("Link URL (https://…)");
    if (!url) return;
    if (!/^https?:\/\//i.test(url)) {
      window.alert("Please enter a full URL starting with http:// or https://");
      return;
    }
    run("createLink", url);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] focus-within:border-gold-400/50">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-white/[0.07] bg-white/[0.02] px-2 py-1.5">
        <button type="button" className={BUTTON} title="Paragraph" aria-label="Paragraph" onMouseDown={(e) => e.preventDefault()} onClick={() => run("formatBlock", "p")}>
          <Pilcrow className="h-4 w-4" />
        </button>
        <button type="button" className={BUTTON} title="Heading 2" aria-label="Heading 2" onMouseDown={(e) => e.preventDefault()} onClick={() => run("formatBlock", "h2")}>
          <Heading2 className="h-4 w-4" />
        </button>
        <button type="button" className={BUTTON} title="Heading 3" aria-label="Heading 3" onMouseDown={(e) => e.preventDefault()} onClick={() => run("formatBlock", "h3")}>
          <Heading3 className="h-4 w-4" />
        </button>
        <span className="mx-1 h-5 w-px bg-white/10" />
        <button type="button" className={BUTTON} title="Bold" aria-label="Bold" onMouseDown={(e) => e.preventDefault()} onClick={() => run("bold")}>
          <Bold className="h-4 w-4" />
        </button>
        <button type="button" className={BUTTON} title="Italic" aria-label="Italic" onMouseDown={(e) => e.preventDefault()} onClick={() => run("italic")}>
          <Italic className="h-4 w-4" />
        </button>
        <button type="button" className={BUTTON} title="Underline" aria-label="Underline" onMouseDown={(e) => e.preventDefault()} onClick={() => run("underline")}>
          <Underline className="h-4 w-4" />
        </button>
        <span className="mx-1 h-5 w-px bg-white/10" />
        <button type="button" className={BUTTON} title="Bulleted list" aria-label="Bulleted list" onMouseDown={(e) => e.preventDefault()} onClick={() => run("insertUnorderedList")}>
          <List className="h-4 w-4" />
        </button>
        <button type="button" className={BUTTON} title="Numbered list" aria-label="Numbered list" onMouseDown={(e) => e.preventDefault()} onClick={() => run("insertOrderedList")}>
          <ListOrdered className="h-4 w-4" />
        </button>
        <button type="button" className={BUTTON} title="Quote" aria-label="Quote" onMouseDown={(e) => e.preventDefault()} onClick={() => run("formatBlock", "blockquote")}>
          <Quote className="h-4 w-4" />
        </button>
        <button type="button" className={BUTTON} title="Add link" aria-label="Add link" onMouseDown={(e) => e.preventDefault()} onClick={addLink}>
          <Link2 className="h-4 w-4" />
        </button>
        <span className="mx-1 h-5 w-px bg-white/10" />
        <button type="button" className={BUTTON} title="Clear formatting" aria-label="Clear formatting" onMouseDown={(e) => e.preventDefault()} onClick={() => run("removeFormat")}>
          <RemoveFormatting className="h-4 w-4" />
        </button>
        <button type="button" className={BUTTON} title="Undo" aria-label="Undo" onMouseDown={(e) => e.preventDefault()} onClick={() => run("undo")}>
          <Undo2 className="h-4 w-4" />
        </button>
        <button type="button" className={BUTTON} title="Redo" aria-label="Redo" onMouseDown={(e) => e.preventDefault()} onClick={() => run("redo")}>
          <Redo2 className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => setMode((current) => (current === "visual" ? "html" : "visual"))}
          className={cn(
            "ml-auto inline-flex h-8 items-center gap-1.5 rounded-md border border-white/10 px-2.5 text-[0.62rem] font-semibold uppercase tracking-[0.08em] transition",
            mode === "html" ? "border-gold-400/40 bg-gold-400/10 text-gold-200" : "text-cream/45 hover:text-cream"
          )}
          aria-pressed={mode === "html"}
        >
          <Code2 className="h-3.5 w-3.5" /> HTML
        </button>
      </div>

      {mode === "visual" ? (
        <div
          id={id}
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          role="textbox"
          aria-multiline="true"
          aria-label="Rich text content"
          data-placeholder={placeholder}
          onInput={emit}
          onBlur={emit}
          className={cn(
            "rte-content prose-editorial w-full bg-transparent px-4 py-4 text-sm leading-relaxed text-cream/85 focus:outline-none",
            minHeight
          )}
        />
      ) : (
        <textarea
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          spellCheck={false}
          className={cn(
            "w-full resize-y bg-transparent px-4 py-4 font-mono text-xs leading-relaxed text-cream/80 focus:outline-none",
            minHeight
          )}
          aria-label="HTML source"
        />
      )}

      <div className="flex items-center justify-between gap-3 border-t border-white/[0.07] px-3 py-1.5 text-[0.6rem] text-cream/25">
        <span>Use the toolbar or switch to HTML for full control.</span>
        <span>{value.replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length} words</span>
      </div>
    </div>
  );
}
