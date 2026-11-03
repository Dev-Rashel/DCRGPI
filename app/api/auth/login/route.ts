import bcrypt from "bcryptjs";
import { handleApiError, fail, ok } from "@/lib/api";
import { createSession } from "@/lib/auth";
import { connectDB, isDbConfigured } from "@/lib/db";
import { User } from "@/lib/models";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { loginSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const limited = rateLimit(clientKey(request, "login"), 6, 5 * 60_000);
  if (!limited.success) {
    return fail(`Too many login attempts. Try again in ${limited.retryAfter} seconds.`, 429);
  }

  try {
    const body = await request.json();
    const { email, password } = loginSchema.parse(body);

    // Preview mode: when no database is configured, allow the credentials
    // supplied via ADMIN_EMAIL / ADMIN_PASSWORD so the admin UI can be explored.
    if (!isDbConfigured()) {
      const demoEmail = process.env.ADMIN_EMAIL?.toLowerCase();
      const demoPassword = process.env.ADMIN_PASSWORD;
      if (demoEmail && demoPassword && email.toLowerCase() === demoEmail && password === demoPassword) {
        await createSession({
          id: "preview-admin",
          name: process.env.ADMIN_NAME || "Preview Administrator",
          email: demoEmail,
          role: "admin",
        });
        return ok({ name: process.env.ADMIN_NAME || "Preview Administrator", email: demoEmail, role: "admin" });
      }
      return fail(
        "Database is not configured. Set MONGODB_URI and run `npm run seed` to create an administrator account.",
        503
      );
    }

    const connection = await connectDB();
    if (!connection) return fail("The service is temporarily unavailable. Please try again.", 503);

    const user = await User.findOne({ email: email.toLowerCase() }).select("+passwordHash").lean();
    if (!user) {
      // Constant-ish time response to avoid user enumeration
      await bcrypt.compare(password, "$2a$10$invalidinvalidinvalidinvalidinvalidinvalidinvalidinva");
      return fail("Invalid email or password", 401);
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return fail("Invalid email or password", 401);

    await createSession({
      id: String(user._id),
      name: user.name,
      email: user.email,
      role: user.role as "admin" | "editor",
      image: user.image ?? "",
    });

    return ok({ name: user.name, email: user.email, role: user.role });
  } catch (error) {
    return handleApiError(error);
  }
}
