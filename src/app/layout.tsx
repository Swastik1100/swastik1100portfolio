// ============================================================
//  app/layout.tsx  —  Root layout for the portfolio
//  ▸ Loads Google Fonts (Inter, Space Grotesk, JetBrains Mono)
//  ▸ Imports globals.css with 3-theme design system
//  ▸ Sets default theme to "light"
//  ▸ Provides metadata for SEO
// ============================================================
import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// ─── Google Fonts ────────────────────────────────────────────
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display:  "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display:  "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display:  "swap",
});

// ─── Metadata ────────────────────────────────────────────────
export const metadata: Metadata = {
  title: {
    default:  "Swastik | Developer Portfolio",
    template: "%s — Swastik",
  },
  description:
    "Full-stack developer, gym rat, and explorer. Building things at the edge of code & craft.",
  keywords: [
    "Swastik",
    "portfolio",
    "developer",
    "full-stack",
    "Next.js",
    "TypeScript",
    "React",
  ],
  authors: [{ name: "Swastik" }],
  creator: "Swastik",
  openGraph: {
    type:        "website",
    locale:      "en_US",
    url:         "https://swastik.dev",
    siteName:    "Swastik",
    title:       "Swastik | Developer Portfolio",
    description: "Full-stack developer, gym rat, and explorer.",
  },
  twitter: {
    card:    "summary_large_image",
    title:   "Swastik | Developer Portfolio",
    description: "Full-stack developer, gym rat, and explorer.",
  },
  robots: {
    index:  true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width:        "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f7f7" },
    { media: "(prefers-color-scheme: dark)",  color: "#0a0a0a" },
  ],
};

// ─── Root Layout ─────────────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-theme="light"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased">
        {/* ─── ThemeProvider wrapper (bind later) ────────────── */}
        {/* <ThemeProvider> */}

        {/* ─── AchievementProvider wrapper (bind later) ──────── */}
        {/* <AchievementProvider> */}

        {children}

        {/* </AchievementProvider> */}
        {/* </ThemeProvider> */}
      </body>
    </html>
  );
}
