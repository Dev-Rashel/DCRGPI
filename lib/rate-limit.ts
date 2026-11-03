const buckets = new Map<string, { count: number; resetAt: number }>();

/**
 * Small in-memory fixed-window rate limiter. Good enough for a single
 * serverless/edge instance; for multi-region deployments swap for Upstash
 * Redis or MongoDB-backed storage.
 */
export function rateLimit(key: string, limit = 5, windowMs = 60_000) {
  const now = Date.now();
  const entry = buckets.get(key);

  if (!entry || entry.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1, retryAfter: 0 };
  }

  entry.count += 1;
  if (entry.count > limit) {
    return {
      success: false,
      remaining: 0,
      retryAfter: Math.ceil((entry.resetAt - now) / 1000),
    };
  }
  return { success: true, remaining: limit - entry.count, retryAfter: 0 };
}

export function clientKey(request: Request, scope: string) {
  const forwarded = request.headers.get("x-forwarded-for") ?? "";
  const ip = forwarded.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
  return `${scope}:${ip}`;
}

// Periodic cleanup so the map does not grow unbounded in long-lived processes.
if (typeof setInterval !== "undefined") {
  const timer = setInterval(() => {
    const now = Date.now();
    for (const [key, value] of buckets) {
      if (value.resetAt < now) buckets.delete(key);
    }
  }, 5 * 60_000);
  if (typeof timer === "object" && "unref" in timer) timer.unref();
}
