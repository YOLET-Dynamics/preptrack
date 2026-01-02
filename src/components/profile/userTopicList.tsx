"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { profileApi } from "@/api/profile";
import { UserTopicCard } from "./userTopicCard";
import { AlertTriangle, BookOpenCheck } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { formatError } from "@/common/utils";

interface UserTopicListProps {
  subjectId: string | undefined;
}

export default function UserTopicList({ subjectId }: UserTopicListProps) {
  const {
    data: topics,
    isLoading,
    error,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: [profileApi.getUserTopics.name, subjectId],
    queryFn: () => profileApi.getUserTopics(subjectId!),
    enabled: !!subjectId,
    staleTime: 5 * 60 * 1000,
  });

  const renderContent = () => {
    if (!subjectId) {
      return <SelectSubjectMessage />;
    }

    if (isLoading || isRefetching) {
      return <LoadingSkeleton />;
    }

    if (error) {
      return <ErrorDisplay error={error} onRetry={refetch} />;
    }

    if (!topics || topics.length === 0) {
      return <EmptyState />;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {topics.map((topic, index) => (
          <UserTopicCard key={topic.topic.id || index} topicData={topic} />
        ))}
      </div>
    );
  };

  return (
    <div className="w-full">
      <h3 className="text-sm font-medium text-brand-indigo/60 mb-3 font-dm-sans uppercase tracking-wide">
        Topics
      </h3>
      {renderContent()}
    </div>
  );
}

const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {[...Array(3)].map((_, index) => (
      <Skeleton
        key={index}
        className="h-[180px] w-full rounded-xl bg-brand-indigo/5"
      />
    ))}
  </div>
);

const ErrorDisplay = ({
  error,
  onRetry,
}: {
  error: Error | unknown;
  onRetry?: () => void;
}) => (
  <Alert
    variant="destructive"
    className="bg-red-50 border-red-200 text-red-700 rounded-xl"
  >
    <AlertTriangle className="h-4 w-4 !text-red-500" />
    <AlertTitle className="text-red-700 font-inter">Failed to load topics</AlertTitle>
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
  <div className="text-center py-10 px-4 bg-brand-indigo/5 border border-dashed border-brand-indigo/20 rounded-xl min-h-[150px] flex flex-col justify-center items-center">
    <BookOpenCheck className="mx-auto h-10 w-10 text-brand-indigo/30 mb-3" />
    <p className="text-base font-medium text-brand-indigo/60 font-dm-sans">No Topics Found</p>
    <p className="text-sm text-brand-indigo/40 mt-1 font-dm-sans">
      No topic data available for this course yet.
    </p>
  </div>
);

const SelectSubjectMessage = () => (
  <div className="text-center py-10 px-4 bg-brand-indigo/5 border border-dashed border-brand-indigo/20 rounded-xl min-h-[150px] flex flex-col justify-center items-center">
    <p className="text-base font-medium text-brand-indigo/60 font-dm-sans">Select a Course</p>
    <p className="text-sm text-brand-indigo/40 mt-1 font-dm-sans">
      Please select a course above to view its topics.
    </p>
  </div>
);
