"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { profileApi } from "@/api/profile";
import { UserTopicCard } from "./userTopicCard";
import { Loader2, AlertTriangle, BookOpenCheck } from "lucide-react";
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
      <h3 className="text-base font-medium text-gray-300 mb-3">Topics</h3>
      {renderContent()}
    </div>
  );
}

const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {[...Array(3)].map((_, index) => (
      <Skeleton
        key={index}
        className="h-[180px] w-full rounded-lg bg-gray-700/50"
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
    className="bg-red-900/30 border-red-500/50 text-red-300"
  >
    <AlertTriangle className="h-4 w-4 !text-red-400" />
    <AlertTitle className="text-red-300">Failed to load topics</AlertTitle>
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
  <div className="text-center py-10 px-4 bg-gray-800/50 border border-dashed border-gray-700 rounded-lg min-h-[150px] flex flex-col justify-center items-center">
    <BookOpenCheck className="mx-auto h-10 w-10 text-gray-500 mb-3" />
    <p className="text-md font-medium text-gray-400">No Topics Found</p>
    <p className="text-sm text-gray-500 mt-1">
      No topic data available for this course yet.
    </p>
  </div>
);

const SelectSubjectMessage = () => (
  <div className="text-center py-10 px-4 bg-gray-800/50 border border-dashed border-gray-700 rounded-lg min-h-[150px] flex flex-col justify-center items-center">
    <p className="text-md font-medium text-gray-400">Select a Course</p>
    <p className="text-sm text-gray-500 mt-1">
      Please select a course above to view its topics.
    </p>
  </div>
);
