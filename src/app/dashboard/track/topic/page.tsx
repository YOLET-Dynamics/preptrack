"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { profileApi } from "@/api/profile";
import { Loader2, ArrowLeft, AlertTriangle, BookOpenCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUserTopicStore } from "@/store/userTopicStore";
import { TopicDetailsCard } from "@/components/profile/topicDetailsCard";
import { UserConceptCard } from "@/components/profile/userConceptCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { formatError } from "@/common/utils";

export default function TopicDetailPage() {
  const router = useRouter();
  const { userTopic } = useUserTopicStore();

  const {
    data: topicDetailData,
    isLoading: isLoadingDetails,
    error: detailsError,
    refetch,
  } = useQuery({
    queryKey: [profileApi.getUserTopicDetail.name, userTopic?.topic.id],
    queryFn: () => profileApi.getUserTopicDetail(userTopic!.topic.id!),
    enabled: !!userTopic?.topic.id,
    staleTime: 5 * 60 * 1000,
  });

  const displayTopicData = topicDetailData ?? userTopic;

  const renderConceptList = () => {
    if (isLoadingDetails) {
      return <ConceptLoadingSkeleton />;
    }

    if (detailsError) {
      return <ConceptErrorDisplay error={detailsError} onRetry={refetch} />;
    }

    const concepts = topicDetailData?.concept_evals;

    if (!concepts || concepts.length === 0) {
      return <ConceptEmptyState />;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {concepts.map((concept, index) => (
          <UserConceptCard
            key={concept.concept?.id || index}
            conceptData={concept}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 space-y-6">
      <Button
        variant="outline"
        size="sm"
        onClick={() => router.back()}
        className="bg-transparent dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700/50 shrink-0"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      {isLoadingDetails && !userTopic ? (
        <Skeleton className="h-[200px] w-full rounded-lg bg-gray-700/50" />
      ) : displayTopicData ? (
        <TopicDetailsCard topicData={displayTopicData} />
      ) : (
        <div className="text-center py-10 text-muted-foreground">
          Topic data not found.
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-200 mb-4">
          Concept Evaluations
        </h2>
        {renderConceptList()}
      </div>
    </div>
  );
}

const ConceptLoadingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {[...Array(3)].map((_, index) => (
      <Skeleton
        key={index}
        className="h-[130px] w-full rounded-lg bg-gray-700/50"
      />
    ))}
  </div>
);

const ConceptErrorDisplay = ({
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
    <AlertTitle className="text-red-300">Failed to load concepts</AlertTitle>
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

const ConceptEmptyState = () => (
  <div className="text-center py-10 px-4 bg-gray-800/50 border border-dashed border-gray-700 rounded-lg min-h-[150px] flex flex-col justify-center items-center">
    <BookOpenCheck className="mx-auto h-10 w-10 text-gray-500 mb-3" />
    <p className="text-md font-medium text-gray-400">No Concept Data</p>
    <p className="text-sm text-gray-500 mt-1">
      No concept evaluations found for this topic yet.
    </p>
  </div>
);
