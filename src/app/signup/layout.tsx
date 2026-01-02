import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account",
  description:
    "Join PrepTrack and start mastering radiation therapy concepts with our intelligent learning platform. Free to start.",
};

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

