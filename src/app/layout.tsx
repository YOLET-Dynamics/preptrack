import type React from "react";
import "./globals.css";
import type { Metadata } from "next";
import { Funnel_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";

const funnelSans = Funnel_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-funnel-sans",
});

export const metadata: Metadata = {
  title: "PrepTrack | Precision Learning for Radiation Therapy",
  description: "preptrack.app - Precision Learning for Radiation Therapy",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${funnelSans.variable}`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
