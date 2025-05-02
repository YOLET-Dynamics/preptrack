import React from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
    description: "Create and manage your test preparation paths.",
  },
  {
    href: "/dashboard/study-guides",
    label: "Explore Study Guides",
    icon: BookOpen,
    description: "Access curated study materials and guides.",
  },
  {
    href: "/dashboard/track",
    label: "Track Your Progress",
    icon: BarChart2,
    description: "View analytics and monitor your performance.",
  },
  {
    href: "/dashboard/profile",
    label: "Update Profile",
    icon: User,
    description: "Manage your account settings and information.",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Announcements Section */}
      <Card className="bg-gray-900/60 border-gray-700 text-gray-100 shadow-lg backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center gap-3 border-b border-gray-700 pb-4">
          <Bell className="h-6 w-6 text-cyan-400" />
          <CardTitle className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">
            Announcements
          </CardTitle>
        </CardHeader>
        <CardContent className="">
          <p className="text-sm text-gray-500 italic">
            No announcements right now.
          </p>
        </CardContent>
      </Card>

      {/* Quick Links Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-gray-200">
          Quick Links
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {quickLinks.map((link) => (
            <Link href={link.href} key={link.href} className="block group">
              <Card className="bg-gray-900/60 border-gray-700 group-hover:border-cyan-600/70 transition-all duration-200 text-gray-100 shadow-md backdrop-blur-sm h-full group-hover:bg-gray-800/80 group-hover:-translate-y-1">
                <CardHeader className="flex flex-row items-start gap-4 pb-2 px-4">
                  <div className="bg-gradient-to-br from-cyan-500 to-teal-500 p-2 rounded-lg flex items-center justify-center mt-1">
                    <link.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-medium text-gray-100 group-hover:text-cyan-300 transition-colors">
                      {link.label}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-400 mt-1">
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
        <Card className="bg-gray-900/60 border-gray-700 text-gray-100 shadow-md backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-gray-200">
              Recent Activity
            </CardTitle>
            <CardDescription className="text-gray-400">
              Your recent progress will appear here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 italic">
              No recent activity yet.
            </p>
            {/* Placeholder content */}
          </CardContent>
        </Card>

        <Card className="bg-gray-900/60 border-gray-700 text-gray-100 shadow-md backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-gray-200">
              Stats Overview
            </CardTitle>
            <CardDescription className="text-gray-400">
              Key statistics at a glance.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 italic">
              Statistics loading...
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
