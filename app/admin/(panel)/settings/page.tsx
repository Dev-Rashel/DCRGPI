import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { SettingsForm } from "@/components/admin/settings-form";
import { AdminPageHeader, AdminButton } from "@/components/admin/ui";
import { DemoNotice } from "@/components/admin/form";
import { demoMode, getSettings } from "@/lib/data";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Website settings" };

export default async function AdminSettingsPage() {
  const [settings, demo] = await Promise.all([getSettings(), Promise.resolve(demoMode())]);

  return (
    <div>
      <AdminPageHeader
        title="Website settings"
        description="Every word, image and link on the public site is managed here. Changes go live as soon as you save."
        actions={
          <AdminButton href="/" variant="outline" target="_blank">
            <ExternalLink className="h-3.5 w-3.5" /> View website
          </AdminButton>
        }
      />
      <div className="mb-4">
        <DemoNotice show={demo} />
      </div>
      <SettingsForm settings={settings} demo={demo} />
    </div>
  );
}
