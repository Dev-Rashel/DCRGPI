export function toDateTimeLocal(value?: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (part: number) => String(part).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(
    date.getMinutes()
  )}`;
}

export function fromApiError(payload: unknown): string {
  if (!payload || typeof payload !== "object") return "Something went wrong. Please try again.";
  const record = payload as { error?: unknown; issues?: { path?: string; message?: string }[] };
  const issue = Array.isArray(record.issues) && record.issues.length ? record.issues[0] : null;
  if (issue?.message) {
    return issue.path ? `${issue.path}: ${issue.message}` : issue.message;
  }
  return typeof record.error === "string" ? record.error : "Something went wrong. Please try again.";
}

export async function apiRequest(
  url: string,
  options: RequestInit = {}
): Promise<{ ok: boolean; payload: any }> {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...(options.headers ?? {}),
    },
  });
  const payload = await response.json().catch(() => ({}));
  return { ok: response.ok, payload };
}

export function downloadCsv(filename: string, headers: string[], rows: (string | number | null | undefined)[][]) {
  const escape = (value: string | number | null | undefined) => `"${String(value ?? "").replace(/"/g, '""')}"`;
  const csv = `\uFEFF${headers.map(escape).join(",")}\n${rows.map((row) => row.map(escape).join(",")).join("\n")}`;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
