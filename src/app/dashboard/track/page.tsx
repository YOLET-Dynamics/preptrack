"use client";

import UserSubjectList from "@/components/profile/userSubjectList";
import UserTopicList from "@/components/profile/userTopicList";
import { useUserSubjectStore } from "@/store/userSubject";

export default function TrackPage() {
  const { userSubject } = useUserSubjectStore();

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-brand-indigo font-inter">
            Track
          </h1>
          <p className="text-sm md:text-base text-brand-indigo/60 font-dm-sans">
            Your performance over time.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <UserSubjectList />
        <UserTopicList subjectId={userSubject?.id} />
      </div>
    </div>
  );
}
