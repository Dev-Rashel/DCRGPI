import type { Metadata } from "next";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { getSettings } from "@/lib/data";
import { accentPalette } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: { index: true, follow: true },
};

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();

  return (
    <div
      className="relative flex min-h-screen flex-col"
      style={accentPalette(settings.themeAccent) as React.CSSProperties}
    >
      <Navbar settings={settings} />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer settings={settings} />
    </div>
  );
}
