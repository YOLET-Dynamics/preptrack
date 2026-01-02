"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { profileApi } from "@/api/profile";
import { ArrowLeft, AlertTriangle, BookOpenCheck } from "lucide-react";
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
    <div className="max-w-7xl mx-auto space-y-6">
      <Button
        variant="outline"
        size="sm"
        onClick={() => router.back()}
        className="border-brand-indigo/20 text-brand-indigo hover:bg-brand-indigo/5 rounded-lg font-dm-sans"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      {isLoadingDetails && !userTopic ? (
        <Skeleton className="h-[200px] w-full rounded-xl bg-brand-indigo/5" />
      ) : displayTopicData ? (
        <TopicDetailsCard topicData={displayTopicData} />
      ) : (
        <div className="text-center py-10 text-brand-indigo/50 font-dm-sans">
          Topic data not found.
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-lg font-medium text-brand-indigo font-inter mb-4">
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
        className="h-[130px] w-full rounded-xl bg-brand-indigo/5"
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
    className="bg-red-50 border-red-200 text-red-700 rounded-xl"
  >
    <AlertTriangle className="h-4 w-4 !text-red-500" />
    <AlertTitle className="text-red-700 font-inter">Failed to load concepts</AlertTitle>
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

const ConceptEmptyState = () => (
  <div className="text-center py-10 px-4 bg-brand-indigo/5 border border-dashed border-brand-indigo/20 rounded-xl min-h-[150px] flex flex-col justify-center items-center">
    <BookOpenCheck className="mx-auto h-10 w-10 text-brand-indigo/30 mb-3" />
    <p className="text-base font-medium text-brand-indigo/60 font-dm-sans">No Concept Data</p>
    <p className="text-sm text-brand-indigo/40 mt-1 font-dm-sans">
      No concept evaluations found for this topic yet.
    </p>
  </div>
);
