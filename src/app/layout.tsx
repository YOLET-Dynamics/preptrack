import type React from "react";
import "./globals.css";
import type { Metadata } from "next";
import { Funnel_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { HttpInterceptor } from "@/provider/HttpInterceptor";
import { AuthGuard } from "@/provider/AuthGuard";
import { NetworkProvider } from "@/provider/NetworkProvider";
import { AuthProvider } from "@/provider/AuthProvider";
import { QueryProvider } from "@/provider/QueryProvider";
import { ThemeProvider } from "@/provider/theme-provider";

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
    <html lang="en" suppressHydrationWarning>
      <body className={`${funnelSans.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
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
