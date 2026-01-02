import type React from "react";
import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Inter, DM_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { HttpInterceptor } from "@/provider/HttpInterceptor";
import { AuthGuard } from "@/provider/AuthGuard";
import { NetworkProvider } from "@/provider/NetworkProvider";
import { AuthProvider } from "@/provider/AuthProvider";
import { QueryProvider } from "@/provider/QueryProvider";
import { ThemeProvider } from "@/provider/theme-provider";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "PrepTrack | Precision Learning for Radiation Therapy",
    template: "%s | PrepTrack",
  },
  description:
    "Master radiation therapy exams with PrepTrack's intelligent learning platform. Personalized study paths, adaptive question banks, and expert-curated content to help you ace your certification.",
  keywords: [
    "radiation therapy",
    "RTT exam prep",
    "radiation therapy certification",
    "medical physics",
    "dosimetry",
    "ARRT exam",
    "radiation oncology",
    "study guide",
    "practice questions",
    "exam preparation",
  ],
  authors: [{ name: "YOLET Labs" }],
  creator: "YOLET Labs",
  publisher: "PrepTrack",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://preptrack.app"),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    card: "summary_large_image",
    title: "PrepTrack | Precision Learning for Radiation Therapy",
    description:
      "Master radiation therapy exams with personalized study paths, adaptive question banks, and expert-curated content.",
    creator: "@preptrack",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://preptrack.app",
    siteName: "PrepTrack",
    title: "PrepTrack | Precision Learning for Radiation Therapy",
    description:
      "Master radiation therapy exams with personalized study paths, adaptive question banks, and expert-curated content.",
  },
  category: "education",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${inter.variable} ${dmSans.variable} font-dm-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <HttpInterceptor>
              <AuthGuard>
                <QueryProvider>
                  <NetworkProvider>{children}</NetworkProvider>
                </QueryProvider>
              </AuthGuard>
            </HttpInterceptor>
          </AuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
