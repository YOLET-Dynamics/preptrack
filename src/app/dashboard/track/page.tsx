"use client";

import UserSubjectList from "@/components/profile/userSubjectList";
import UserTopicList from "@/components/profile/userTopicList";
import { useUserSubjectStore } from "@/store/userSubject";
import { BarChart2, TrendingUp } from "lucide-react";

export default function TrackPage() {
  const { userSubject } = useUserSubjectStore();

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 space-y-8">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 p-6 sm:p-8">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-green/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4" />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
              <BarChart2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white font-inter">
                Progress
              </h1>
              <p className="text-white/70 font-dm-sans mt-1">
                Track your learning journey and performance over time
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl">
            <TrendingUp className="h-4 w-4 text-brand-green" />
            <span className="text-white/90 text-sm font-medium font-dm-sans">
              Keep improving!
            </span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="space-y-6">
        <UserSubjectList />
        <UserTopicList subjectId={userSubject?.id} />
      </div>
    </div>
  );
}
