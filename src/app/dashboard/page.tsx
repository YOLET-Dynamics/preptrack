import React from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Bell,
  ClipboardList,
  BookOpen,
  BarChart2,
  User,
} from "lucide-react";

const quickLinks = [
  {
    href: "/dashboard/test-paths",
    label: "Assessment",
    icon: ClipboardList,
    description: "Personalized collection of assessments.",
  },
  {
    href: "/dashboard/study-guides",
    label: "Study Guides",
    icon: BookOpen,
    description: "Personalized and bite-sized lessons.",
  },
  {
    href: "/dashboard/track",
    label: "Track",
    icon: BarChart2,
    description: "View analytics and monitor your performance.",
  },
  {
    href: "/dashboard/profile",
    label: "Profile",
    icon: User,
    description: "Manage your account settings and information.",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Announcements Section */}
      <Card className="bg-brand-indigo/15 border-brand-indigo/40 text-white shadow-lg backdrop-blur-sm rounded-2xl">
        <CardHeader className="flex flex-row items-center gap-3 border-b border-brand-indigo/30 pb-4">
          <div className="p-2 rounded-xl bg-brand-green/10">
            <Bell className="h-5 w-5 text-brand-green" />
          </div>
          <CardTitle className="text-xl font-semibold text-brand-green font-inter">
            Announcements
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="text-sm text-white/40 italic font-dm-sans">
            No announcements right now.
          </p>
        </CardContent>
      </Card>

      {/* Quick Links Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-6 text-white font-inter">
          Quick Links
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {quickLinks.map((link) => (
            <Link href={link.href} key={link.href} className="block group">
              <Card className="bg-brand-indigo/15 border-brand-indigo/40 group-hover:border-brand-green/40 transition-all duration-300 text-white shadow-lg backdrop-blur-sm h-full group-hover:bg-brand-indigo/25 group-hover:-translate-y-1 rounded-2xl">
                <CardHeader className="flex flex-row items-start gap-4 pb-2 px-5 pt-5">
                  <div className="bg-brand-green/10 p-2.5 rounded-xl flex items-center justify-center group-hover:bg-brand-green/20 transition-colors">
                    <link.icon className="h-5 w-5 text-brand-green" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-medium text-white group-hover:text-brand-green transition-colors font-inter">
                      {link.label}
                    </CardTitle>
                    <CardDescription className="text-sm text-white/50 mt-1 font-dm-sans">
                      {link.description}
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Placeholder Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-brand-indigo/15 border-brand-indigo/40 text-white shadow-lg backdrop-blur-sm rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-white font-inter">
              Recent Activity
            </CardTitle>
            <CardDescription className="text-white/50 font-dm-sans">
              Your recent progress will appear here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-white/40 italic font-dm-sans">
              No recent activity yet.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
