import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(value?: string | Date | null, opts?: Intl.DateTimeFormatOptions) {
  if (!value) return "—";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...opts,
  }).format(date);
}

export function formatDateTime(value?: string | Date | null) {
  if (!value) return "—";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function excerptFrom(html: string, length = 160) {
  const text = html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > length ? `${text.slice(0, length).trimEnd()}…` : text;
}

export function readingTime(html: string) {
  const words = html.replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function absoluteUrl(path = "") {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  const base = configured || (vercelHost ? `https://${vercelHost.replace(/\/$/, "")}` : "http://localhost:3000");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function truncate(value: string, length = 120) {
  return value.length > length ? `${value.slice(0, length).trimEnd()}…` : value;
}

function parseHex(value: string): [number, number, number] {
  const match = /^#?([0-9a-f]{6})$/i.exec(value.trim());
  if (!match) return [238, 196, 106];
  const int = Number.parseInt(match[1], 16);
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
}

function mixChannel(channel: number, target: number, amount: number) {
  return Math.round(channel + (target - channel) * amount);
}

/**
 * Builds the gold accent CSS variables used by the public site from the
 * administrator's chosen hex colour. Falls back to the default palette.
 */
export function accentPalette(hex: string): Record<string, string> {
  const [r, g, b] = parseHex(hex);
  const lighten = (amount: number) =>
    `${mixChannel(r, 255, amount)} ${mixChannel(g, 255, amount)} ${mixChannel(b, 255, amount)}`;
  const darken = (amount: number) =>
    `${mixChannel(r, 0, amount)} ${mixChannel(g, 0, amount)} ${mixChannel(b, 0, amount)}`;

  return {
    "--gold-300": lighten(0.34),
    "--gold-400": `${r} ${g} ${b}`,
    "--gold-500": darken(0.12),
    "--gold-600": darken(0.28),
  };
}

