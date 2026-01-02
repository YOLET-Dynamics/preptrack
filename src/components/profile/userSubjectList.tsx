"use client";

import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { profileApi } from "@/api/profile";
import { useUserSubjectStore } from "@/store/userSubject";
import { SubjectMinified } from "@/models/content/subject";
import { Library, AlertTriangle, Leaf } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { formatError } from "@/common/utils";

const subjectConfig: Record<
  string,
  { icon: React.ElementType; color: string }
> = {
  default: { icon: Leaf, color: "text-brand-green" },
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
      <div className="flex space-x-3 overflow-x-auto pb-3 -mb-3 scrollbar-thin scrollbar-thumb-brand-indigo/20 scrollbar-track-transparent">
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
      <h3 className="text-sm font-medium text-brand-indigo/60 mb-3 font-dm-sans uppercase tracking-wide">
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
        "min-w-[120px] flex-shrink-0 cursor-pointer transition-all duration-200 hover:scale-[1.02] bg-white border rounded-xl",
        isActive
          ? "border-brand-green ring-2 ring-brand-green/20 shadow-md"
          : "border-brand-indigo/10 hover:border-brand-green/30 hover:shadow-sm",
        "group"
      )}
    >
      <CardContent className="flex flex-col items-center justify-center p-4">
        <div
          className={cn(
            "p-2.5 rounded-xl mb-3 transition-colors",
            isActive
              ? "bg-brand-green/15"
              : "bg-brand-indigo/5 group-hover:bg-brand-green/10"
          )}
        >
          <IconComponent
            className={cn(
              "w-5 h-5 transition-colors",
              isActive
                ? "text-brand-green"
                : "text-brand-indigo/50 group-hover:text-brand-green"
            )}
            strokeWidth={isActive ? 2 : 1.5}
          />
        </div>
        <span
          className={cn(
            "text-xs font-medium text-center transition-colors line-clamp-2 font-dm-sans",
            isActive
              ? "text-brand-indigo"
              : "text-brand-indigo/60 group-hover:text-brand-indigo"
          )}
        >
          {subject.name}
        </span>
      </CardContent>
    </Card>
  );
};

const LoadingSkeleton = () => (
  <div className="flex gap-3">
    {[...Array(4)].map((_, index) => (
      <Skeleton
        key={index}
        className="h-[100px] w-[120px] rounded-xl bg-brand-indigo/5"
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
    className="bg-red-50 border-red-200 text-red-700 rounded-xl"
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
  <div className="text-center py-8 px-4 bg-brand-indigo/5 border border-dashed border-brand-indigo/20 rounded-xl">
    <Library className="mx-auto h-8 w-8 text-brand-indigo/30 mb-3" />
    <p className="text-sm text-brand-indigo/60 font-dm-sans font-medium">
      No subjects found
    </p>
    <p className="text-xs text-brand-indigo/40 mt-1 font-dm-sans">
      You might need to select subjects in your profile settings.
    </p>
  </div>
);
