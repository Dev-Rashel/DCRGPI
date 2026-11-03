import { handleApiError, ok } from "@/lib/api";
import { getSettings, logActivity } from "@/lib/data";
import { connectDB } from "@/lib/db";
import { Settings } from "@/lib/models";
import { adminGuard } from "@/lib/route-helpers";
import { sanitizePlainText, sanitizeRichText } from "@/lib/sanitize";
import { settingsSchema } from "@/lib/validation";

export async function GET() {
  try {
    return ok(await getSettings());
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request) {
  const guard = await adminGuard();
  if (guard.response) return guard.response;

  try {
    const payload = settingsSchema.parse(await request.json());
    await connectDB();

    const update = {
      ...payload,
      aboutContent: sanitizeRichText(payload.aboutContent ?? ""),
      history: sanitizeRichText(payload.history ?? ""),
      mission: sanitizePlainText(payload.mission ?? ""),
      vision: sanitizePlainText(payload.vision ?? ""),
      footerTagline: sanitizePlainText(payload.footerTagline ?? ""),
      footerText: sanitizePlainText(payload.footerText ?? ""),
      instituteInfo: sanitizePlainText(payload.instituteInfo ?? ""),
      copyright: sanitizePlainText(payload.copyright ?? ""),
      heroTitle: sanitizePlainText(payload.heroTitle),
      heroSubtitle: sanitizePlainText(payload.heroSubtitle ?? ""),
      heroEyebrow: sanitizePlainText(payload.heroEyebrow ?? ""),
      objectives: payload.objectives.map((item) => sanitizePlainText(item)),
      coreValues: payload.coreValues.map((item) => ({
        title: sanitizePlainText(item.title),
        description: sanitizePlainText(item.description ?? ""),
      })),
    };

    const settings = await Settings.findOneAndUpdate(
      { key: "site" },
      { $set: { ...update, key: "site" } },
      { new: true, upsert: true, runValidators: true }
    ).lean();

    await logActivity({ action: "Updated", entity: "Website settings", detail: "Global content", actor: guard.session.name });

    return ok(settings);
  } catch (error) {
    return handleApiError(error);
  }
}
