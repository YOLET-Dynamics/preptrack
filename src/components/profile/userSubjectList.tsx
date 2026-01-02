"use client";

import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { profileApi } from "@/api/profile";
import { useUserSubjectStore } from "@/store/userSubject";
import { SubjectMinified } from "@/models/content/subject";
import { Library, AlertTriangle, Leaf, ChevronRight, Check } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { formatError } from "@/common/utils";

const subjectConfig: Record<
  string,
  { icon: React.ElementType; gradient: string; bgGradient: string }
> = {
  default: {
    icon: Leaf,
    gradient: "from-brand-green to-emerald-600",
    bgGradient: "from-brand-green/10 to-emerald-500/5",
  },
};

export default function UserSubjectList() {
  const { userSubject, setUserSubject } = useUserSubjectStore();

  const {
    data: userSubjectData,
    error: subjectsError,
    isLoading: isSubjectsLoading,
    refetch,
  } = useQuery({
    queryKey: ["userSubjects", profileApi.getUserSubjects.name],
    queryFn: () => profileApi.getUserSubjects(),
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (
      userSubjectData?.Subjects &&
      userSubjectData.Subjects.length > 0 &&
      !userSubject
    ) {
      setUserSubject(userSubjectData.Subjects[0]);
    }
  }, [userSubjectData, setUserSubject]);

  const renderContent = () => {
    if (isSubjectsLoading) {
      return <LoadingSkeleton />;
    }

    if (subjectsError) {
      return <ErrorDisplay error={subjectsError} onRetry={refetch} />;
    }

    if (!userSubjectData || userSubjectData.Subjects.length === 0) {
      return <EmptyState />;
    }

    const sortedSubjects = [...userSubjectData.Subjects].sort((a, b) =>
      a.id === userSubject?.id ? -1 : b.id === userSubject?.id ? 1 : 0
    );

    return (
      <div className="flex gap-3 overflow-x-auto pb-2 -mb-2 scrollbar-thin scrollbar-thumb-brand-indigo/10 scrollbar-track-transparent">
        {sortedSubjects.map((subject) => (
          <SubjectCard
            key={subject.id}
            subject={subject}
            isActive={userSubject?.id === subject.id}
            onClick={() => setUserSubject(subject)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="w-full mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-semibold text-brand-indigo/50 font-inter uppercase tracking-wider">
          Your Courses
        </h3>
        {userSubjectData && userSubjectData.Subjects.length > 0 && (
          <span className="text-xs text-brand-indigo/40 font-dm-sans">
            {userSubjectData.Subjects.length} enrolled
          </span>
        )}
      </div>
      {renderContent()}
    </div>
  );
}

interface SubjectCardProps {
  subject: SubjectMinified;
  isActive: boolean;
  onClick: () => void;
}

const SubjectCard = ({ subject, isActive, onClick }: SubjectCardProps) => {
  const config = subjectConfig.default;
  const IconComponent = config.icon;

  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex items-center gap-3 min-w-[180px] sm:min-w-[200px] flex-shrink-0 rounded-2xl p-4 transition-all duration-300 text-left",
        isActive
          ? "bg-gradient-to-br from-brand-green/10 via-brand-green/5 to-transparent border-2 border-brand-green/40 shadow-lg shadow-brand-green/10"
          : "bg-white border border-brand-indigo/10 hover:border-brand-green/30 hover:shadow-md hover:-translate-y-0.5"
      )}
    >
      {/* Gradient orb background for active */}
      {isActive && (
        <div className="absolute -top-6 -right-6 w-24 h-24 bg-brand-green/20 rounded-full blur-2xl pointer-events-none" />
      )}

      {/* Icon container */}
      <div
        className={cn(
          "relative flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-300",
          isActive
            ? `bg-gradient-to-br ${config.gradient} shadow-lg shadow-brand-green/30`
            : "bg-brand-indigo/5 group-hover:bg-gradient-to-br group-hover:from-brand-green/20 group-hover:to-brand-green/10"
        )}
      >
        <IconComponent
          className={cn(
            "w-5 h-5 transition-all duration-300",
            isActive
              ? "text-white"
              : "text-brand-indigo/40 group-hover:text-brand-green"
          )}
          strokeWidth={2}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 relative z-10">
        <p
          className={cn(
            "text-sm font-medium truncate transition-colors font-inter",
            isActive ? "text-brand-indigo" : "text-brand-indigo/70 group-hover:text-brand-indigo"
          )}
        >
          {subject.name}
        </p>
        <p
          className={cn(
            "text-xs transition-colors font-dm-sans",
            isActive ? "text-brand-green" : "text-brand-indigo/40"
          )}
        >
          {isActive ? "Active" : "Switch to this course"}
        </p>
      </div>

      {/* Active indicator or arrow */}
      <div
        className={cn(
          "flex items-center justify-center w-7 h-7 rounded-full transition-all duration-300",
          isActive
            ? "bg-brand-green"
            : "bg-brand-indigo/5 group-hover:bg-brand-green/10"
        )}
      >
        {isActive ? (
          <Check className="w-4 h-4 text-white" strokeWidth={2.5} />
        ) : (
          <ChevronRight
            className="w-4 h-4 text-brand-indigo/30 group-hover:text-brand-green transition-colors"
          />
        )}
      </div>
    </button>
  );
};

const LoadingSkeleton = () => (
  <div className="flex gap-3">
    {[...Array(3)].map((_, index) => (
      <div
        key={index}
        className="flex items-center gap-3 min-w-[180px] sm:min-w-[200px] rounded-2xl p-4 bg-white border border-brand-indigo/5"
      >
        <Skeleton className="w-11 h-11 rounded-xl bg-brand-indigo/5" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-24 rounded bg-brand-indigo/5" />
          <Skeleton className="h-3 w-16 rounded bg-brand-indigo/5" />
        </div>
        <Skeleton className="w-7 h-7 rounded-full bg-brand-indigo/5" />
      </div>
    ))}
  </div>
);

const ErrorDisplay = ({
  error,
  onRetry,
}: {
  error: Error;
  onRetry?: () => void;
}) => (
  <Alert
    variant="destructive"
    className="bg-red-50 border-red-200/50 text-red-700 rounded-2xl"
  >
    <AlertTriangle className="h-4 w-4 !text-red-500" />
    <AlertTitle className="text-red-700 font-inter">
      Failed to load courses
    </AlertTitle>
    <AlertDescription className="text-red-600 font-dm-sans">
      {formatError(error instanceof Error ? error.message : String(error))}
      {onRetry && (
        <button
          onClick={onRetry}
          className="ml-2 text-brand-green hover:underline text-xs font-medium"
        >
          Retry
        </button>
      )}
    </AlertDescription>
  </Alert>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-10 px-6 bg-gradient-to-br from-brand-indigo/5 to-transparent border border-dashed border-brand-indigo/15 rounded-2xl">
    <div className="p-4 bg-brand-indigo/5 rounded-2xl mb-4">
      <Library className="h-8 w-8 text-brand-indigo/30" />
    </div>
    <p className="text-sm text-brand-indigo/70 font-inter font-medium mb-1">
      No courses found
    </p>
    <p className="text-xs text-brand-indigo/40 text-center max-w-[200px] font-dm-sans">
      Select courses in your profile settings to get started.
    </p>
  </div>
);
