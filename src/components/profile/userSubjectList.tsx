"use client";

import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { profileApi } from "@/api/profile";
import { useUserSubjectStore } from "@/store/userSubject";
import { SubjectMinified } from "@/models/content/subject";
import {
  Library,
  AlertTriangle,
  BookOpen, // Keeping a few relevant ones just in case, but default is primary
  TestTube,
  Leaf,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { formatError } from "@/common/utils";

const subjectConfig: Record<
  string,
  { icon: React.ElementType; color: string }
> = {
  default: { icon: Leaf, color: "text-green-500" },
};

const getBaseSubjectName = (name: string): string => {
  return name.split("-")[0] || name;
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
      <div className="flex space-x-3 overflow-x-auto pb-3 -mb-3 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800/50">
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
      <h3 className="text-base font-medium text-gray-300 mb-3">
        Your Courses
      </h3>
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
  const baseSubjectName = getBaseSubjectName(subject.name);
  const config = subjectConfig.default;
  const IconComponent = config.icon;

  return (
    <Card
      onClick={onClick}
      className={cn(
        "min-w-[120px] flex-shrink-0 cursor-pointer transition-all duration-200 hover:scale-[1.03] hover:shadow-md bg-gray-800/70 border",
        isActive
          ? "border-cyan-500 ring-2 ring-cyan-500/50 bg-gradient-to-br from-gray-750 to-gray-800"
          : "border-gray-700 hover:border-gray-600",
        "group"
      )}
    >
      <CardContent className="flex flex-col items-center justify-center p-4">
        <div
          className={cn(
            "p-2.5 rounded-lg mb-3 transition-colors",
            isActive
              ? "bg-cyan-500/20"
              : "bg-gray-700/60 group-hover:bg-gray-600/80"
          )}
        >
          <IconComponent
            className={cn(
              "w-5 h-5 transition-colors",
              isActive
                ? "text-cyan-400"
                : `${config.color} opacity-80 group-hover:opacity-100`
            )}
            strokeWidth={isActive ? 2 : 1.5}
          />
        </div>
        <span
          className={cn(
            "text-xs font-medium text-center transition-colors line-clamp-2",
            isActive
              ? "text-gray-100"
              : "text-gray-300 group-hover:text-gray-100"
          )}
        >
          {subject.name}
        </span>
      </CardContent>
    </Card>
  );
};

const LoadingSkeleton = () => (
  <div className="flex flex-wrap gap-3">
    {[...Array(4)].map((_, index) => (
      <Skeleton
        key={index}
        className="h-[110px] w-[120px] rounded-lg bg-gray-700/50"
      />
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
    className="bg-red-900/30 border-red-500/50 text-red-300"
  >
    <AlertTriangle className="h-4 w-4 !text-red-400" />
    <AlertTitle className="text-red-300">Failed to load courses</AlertTitle>
    <AlertDescription className="text-red-400/90">
      {formatError(error instanceof Error ? error.message : String(error))}
      {onRetry && (
        <button
          onClick={onRetry}
          className="ml-2 text-cyan-400 hover:underline text-xs"
        >
          (Retry)
        </button>
      )}
    </AlertDescription>
  </Alert>
);

const EmptyState = () => (
  <div className="text-center py-6 px-4 bg-gray-800/50 border border-dashed border-gray-700 rounded-lg">
    <Library className="mx-auto h-8 w-8 text-gray-500 mb-2" />
    <p className="text-sm text-gray-400">No subjects found.</p>
    <p className="text-xs text-gray-500 mt-1">
      You might need to select subjects in your profile settings.
    </p>
  </div>
);
