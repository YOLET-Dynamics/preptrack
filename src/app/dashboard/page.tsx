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
  ArrowRight,
} from "lucide-react";

const quickLinks = [
  {
    href: "/dashboard/test-paths",
    label: "Assessment",
    icon: ClipboardList,
    description: "Personalized collection of assessments.",
    color: "from-blue-500/10 to-indigo-500/10",
  },
  {
    href: "/dashboard/study-guides",
    label: "Study Guides",
    icon: BookOpen,
    description: "Personalized and bite-sized lessons.",
    color: "from-emerald-500/10 to-teal-500/10",
  },
  {
    href: "/dashboard/track",
    label: "Track",
    icon: BarChart2,
    description: "View analytics and monitor your performance.",
    color: "from-purple-500/10 to-pink-500/10",
  },
  {
    href: "/dashboard/profile",
    label: "Profile",
    icon: User,
    description: "Manage your account settings and information.",
    color: "from-orange-500/10 to-amber-500/10",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8 max-w-6xl">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-brand-indigo font-inter">
          Welcome back
        </h1>
        <p className="text-brand-indigo/60 font-dm-sans mt-1">
          Continue your learning journey
        </p>
      </div>

      {/* Announcements Section */}
      <Card className="bg-white border border-brand-indigo/10 shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="flex flex-row items-center gap-3 border-b border-brand-indigo/5 pb-4 bg-gradient-to-r from-brand-green/5 to-transparent">
          <div className="p-2.5 rounded-xl bg-brand-green/10">
            <Bell className="h-5 w-5 text-brand-green" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold text-brand-indigo font-inter">
              Announcements
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="text-sm text-brand-indigo/50 italic font-dm-sans">
            No announcements right now. Check back later!
          </p>
        </CardContent>
      </Card>

      {/* Quick Links Section */}
      <div>
        <h2 className="text-xl font-semibold mb-5 text-brand-indigo font-inter">
          Quick Links
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {quickLinks.map((link) => (
            <Link href={link.href} key={link.href} className="block group">
              <Card
                className={`bg-gradient-to-br ${link.color} border border-brand-indigo/5 group-hover:border-brand-green/30 transition-all duration-300 h-full group-hover:-translate-y-1 group-hover:shadow-lg rounded-2xl overflow-hidden`}
              >
                <CardHeader className="flex flex-row items-start gap-4 p-5">
                  <div className="bg-white p-2.5 rounded-xl shadow-sm group-hover:shadow-md transition-shadow">
                    <link.icon className="h-5 w-5 text-brand-indigo group-hover:text-brand-green transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-medium text-brand-indigo group-hover:text-brand-green transition-colors font-inter">
                        {link.label}
                      </CardTitle>
                      <ArrowRight className="h-4 w-4 text-brand-indigo/30 group-hover:text-brand-green group-hover:translate-x-1 transition-all" />
                    </div>
                    <CardDescription className="text-sm text-brand-indigo/60 mt-1 font-dm-sans">
                      {link.description}
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border border-brand-indigo/10 shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-brand-indigo font-inter">
              Recent Activity
            </CardTitle>
            <CardDescription className="text-brand-indigo/50 font-dm-sans">
              Your recent progress will appear here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-16 h-16 rounded-full bg-brand-indigo/5 flex items-center justify-center mb-4">
                <BarChart2 className="h-8 w-8 text-brand-indigo/30" />
              </div>
              <p className="text-sm text-brand-indigo/40 font-dm-sans">
                No recent activity yet.
              </p>
              <p className="text-xs text-brand-indigo/30 font-dm-sans mt-1">
                Start a study session to see your progress
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-brand-indigo/10 shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-brand-indigo font-inter">
              Study Streak
            </CardTitle>
            <CardDescription className="text-brand-indigo/50 font-dm-sans">
              Keep your momentum going!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="text-5xl font-bold text-brand-green font-inter mb-2">
                0
              </div>
              <p className="text-sm text-brand-indigo/50 font-dm-sans">
                days in a row
              </p>
              <p className="text-xs text-brand-indigo/30 font-dm-sans mt-3">
                Complete a lesson to start your streak
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
