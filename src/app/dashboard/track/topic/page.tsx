"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { profileApi } from "@/api/profile";
import { ArrowLeft, AlertTriangle, BookOpenCheck, Layers } from "lucide-react";
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
      {/* Back button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.back()}
        className="text-brand-indigo/60 hover:text-brand-indigo hover:bg-brand-indigo/5 rounded-xl font-dm-sans -ml-2"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Progress
      </Button>

      {/* Topic Details Card */}
      {isLoadingDetails && !userTopic ? (
        <TopicDetailsSkeleton />
      ) : displayTopicData ? (
        <TopicDetailsCard topicData={displayTopicData} />
      ) : (
        <div className="text-center py-10 text-brand-indigo/50 font-dm-sans bg-white rounded-2xl border border-brand-indigo/10">
          Topic data not found.
        </div>
      )}

      {/* Concept Evaluations Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-xl">
            <Layers className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-brand-indigo font-inter">
              Concept Breakdown
            </h2>
            <p className="text-sm text-brand-indigo/50 font-dm-sans">
              Detailed performance by concept
            </p>
          </div>
        </div>
        {renderConceptList()}
      </div>
    </div>
  );
}

const TopicDetailsSkeleton = () => (
  <div className="bg-white border border-brand-indigo/10 rounded-2xl overflow-hidden">
    <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-6">
      <Skeleton className="h-8 w-2/3 bg-white/20 rounded-lg mb-3" />
      <Skeleton className="h-4 w-1/3 bg-white/20 rounded-lg" />
    </div>
    <div className="p-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[...Array(4)].map((_, index) => (
          <Skeleton key={index} className="h-24 rounded-xl bg-brand-indigo/5" />
        ))}
      </div>
    </div>
  </div>
);

const ConceptLoadingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {[...Array(3)].map((_, index) => (
      <div key={index} className="bg-white border border-brand-indigo/10 rounded-2xl p-4">
        <div className="flex items-start gap-3 mb-4">
          <Skeleton className="h-10 w-16 rounded-lg bg-brand-indigo/5" />
          <Skeleton className="h-5 flex-1 rounded bg-brand-indigo/5" />
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-lg bg-brand-indigo/5" />
          ))}
        </div>
      </div>
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
    className="bg-red-50 border-red-200/50 text-red-700 rounded-2xl"
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
  <div className="flex flex-col items-center justify-center py-12 px-6 bg-gradient-to-br from-blue-50/50 to-transparent border border-dashed border-blue-200/50 rounded-2xl">
    <div className="p-4 bg-blue-50 rounded-2xl mb-4">
      <BookOpenCheck className="h-8 w-8 text-blue-400" />
    </div>
    <p className="text-base font-medium text-brand-indigo font-inter mb-1">No Concept Data</p>
    <p className="text-sm text-brand-indigo/50 font-dm-sans text-center max-w-sm">
      Complete some exercises to see your concept-level performance breakdown.
    </p>
  </div>
);
