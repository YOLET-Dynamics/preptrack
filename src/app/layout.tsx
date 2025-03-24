import type React from "react";
import "./globals.css";
import type { Metadata } from "next";
import { Raleway, Funnel_Display } from "next/font/google";

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-raleway",
});

const funnelDisplay = Funnel_Display({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-funnel-display",
});

export const metadata: Metadata = {
  title: "PrepTrack | Coming Soon",
  description: "preptrack.app - Coming Soon",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${raleway.variable} ${funnelDisplay.variable}`}>
        {children}
      </body>
    </html>
  );
}
