import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import { Toaster } from "sonner";
import { SITE_NAME } from "@/lib/constants";
import { absoluteUrl } from "@/lib/utils";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["SOFT", "WONK"],
});

export const metadata: Metadata = {
  metadataBase: new URL(absoluteUrl("/")),
  title: {
    default: `${SITE_NAME} — Think Bold. Speak Fearlessly.`,
    template: `%s · ${SITE_NAME}`,
  },
  description:
    "The official website of the Debating Club of RPI — a community of thinkers, speakers and future leaders at Rangpur Government Polytechnic Institute.",
  keywords: [
    "Debating Club of RPI",
    "Rangpur Government Polytechnic Institute",
    "debate club",
    "Bangladesh debating",
    "public speaking",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: absoluteUrl("/"),
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Think Bold. Speak Fearlessly.`,
    description: "A community of thinkers, speakers, and future leaders.",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Think Bold. Speak Fearlessly.`,
    description: "A community of thinkers, speakers, and future leaders.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#080c16",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} ${fraunces.variable}`} suppressHydrationWarning>
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-gold-400 focus:px-5 focus:py-2 focus:text-sm focus:font-semibold focus:text-ink-950"
        >
          Skip to content
        </a>
        {children}
        <Toaster
          theme="dark"
          position="bottom-right"
          richColors
          closeButton
          toastOptions={{
            style: {
              background: "#0d1322",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#f4efe4",
            },
          }}
        />
      </body>
    </html>
  );
}
