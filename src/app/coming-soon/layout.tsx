import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Coming Soon",
  description:
    "This feature is coming soon to PrepTrack. Stay tuned for updates!",
};

export default function ComingSoonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
