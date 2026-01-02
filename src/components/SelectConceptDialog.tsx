import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Check,
  ArrowLeft,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react";
import { contentApi } from "@/api/content";
import { Concept } from "@/models/content/concept";
import { PaginationRes } from "@/models/common/pageInfo";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTopicStore } from "@/store/topicStore";
import { useConceptStore } from "@/store/conceptStore";
import { useContentReqStore } from "@/store/contentReqStore";
import Pagination from "./Pagination";
import LoadingInitEval from "./LoadingInitEval";
import { cn } from "@/lib/utils";

interface SelectConceptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBack: () => void;
}

const MAX_CONCEPTS_PER_TOPIC = 16;

export default function SelectConceptDialog({
  open,
  onOpenChange,
  onBack,
}: SelectConceptDialogProps) {
  const [topicPages, setTopicPages] = useState<{ [key: string]: number }>({});
  const [expandedTopics, setExpandedTopics] = useState<{
    [key: string]: boolean;
  }>({});
  const [showLoadingEval, setShowLoadingEval] = useState(false);

  const { selectedTopics } = useTopicStore();
  const {
    selectedConcepts,
    addConcept,
    removeConcept,
    clearSelectedConcepts,
    setConcepts,
  } = useConceptStore();
  const {
    content: contentReq,
    addContent: addContentReq,
    resetContent: resetContentReq,
  } = useContentReqStore();

  const { data: conceptsData, isLoading: isLoadingConcepts } = useQuery<
    PaginationRes<Concept>[],
    Error
  >({
    queryKey: [
      contentApi.getConcepts.name,
      selectedTopics.map((t) => t.id),
      topicPages,
    ],
    queryFn: async () => {
      const conceptPromises = selectedTopics.map((topic) =>
        contentApi.getConcepts(topic.id, topicPages[topic.id] || 1)
      );
      return Promise.all(conceptPromises);
    },
    enabled: open && selectedTopics.length > 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  useEffect(() => {
    if (conceptsData) {
      setConcepts(conceptsData.flatMap((res) => res.rows));
    }
  }, [conceptsData, setConcepts]);

  const toggleTopicExpansion = (topicId: string) => {
    setExpandedTopics((prev) => ({
      ...prev,
      [topicId]: !prev[topicId],
    }));
  };

  const handlePageChange = (topicId: string, newPage: number) => {
    setTopicPages((prev) => ({
      ...prev,
      [topicId]: newPage,
    }));
  };

  const toggleConceptSelection = (concept: Concept) => {
    const isSelected = selectedConcepts.some((c) => c.id === concept.id);
    const conceptsInThisTopic = selectedConcepts.filter(
      (c) => c.topic.id === concept.topic.id
    ).length;

    if (isSelected) {
      removeConcept(concept.id);

      const updatedContentReq = contentReq
        .map((item) => {
          if (item.topic_id === concept.topic.id) {
            return {
              ...item,
              concept_id: item.concept_id.filter((id) => id !== concept.id),
            };
          }
          return item;
        })
        .filter((item) => item.concept_id.length > 0);

      resetContentReq();
      updatedContentReq.forEach((item) => addContentReq(item));
    } else {
      if (conceptsInThisTopic < MAX_CONCEPTS_PER_TOPIC) {
        addConcept(concept);
        addContentReq({ topic_id: concept.topic.id, concept_id: [concept.id] });
      } else {
        console.warn(
          `Max concepts (${MAX_CONCEPTS_PER_TOPIC}) reached for topic ${concept.topic.name}`
        );
      }
    }
  };

  const handleClearAll = () => {
    clearSelectedConcepts();
    resetContentReq();
  };

  const handleContinue = () => {
    setShowLoadingEval(true);
  };

  const handleLoadingError = () => {
    setShowLoadingEval(false);
  };

  if (showLoadingEval) {
    return <LoadingInitEval onError={handleLoadingError} />;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl w-[95vw] max-h-[90vh] flex flex-col font-dm-sans bg-white text-brand-indigo border-brand-indigo/10 rounded-2xl shadow-xl">
        <DialogHeader className="flex-shrink-0 border-b border-brand-indigo/10 pb-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              aria-label="Go back"
              className="h-8 w-8 text-brand-indigo/40 hover:text-brand-green hover:bg-brand-green/10 rounded-lg"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl font-semibold text-brand-indigo font-inter">
              <BookOpen className="h-5 w-5 text-brand-green" />
              Select Sub-units (Concepts)
            </DialogTitle>
          </div>
        </DialogHeader>
        <div className="flex-grow overflow-y-auto py-4 pr-2 space-y-4">
          {isLoadingConcepts ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-brand-green" />
            </div>
          ) : (
            <div className="space-y-4">
              {selectedTopics.map((topic) => {
                const conceptsForTopic = conceptsData?.find(
                  (response) => response?.rows[0]?.topic?.id === topic.id
                );
                const currentPage = topicPages[topic.id] || 1;
                const totalPages = conceptsForTopic?.totalPages || 1;
                const selectedCount = selectedConcepts.filter(
                  (c) => c.topic.id === topic.id
                ).length;

                return (
                  <div
                    key={topic.id}
                    className="space-y-2 rounded-xl border border-brand-indigo/10 p-3 bg-white"
                  >
                    <button
                      onClick={() => toggleTopicExpansion(topic.id)}
                      className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-brand-indigo/5 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-brand-green flex-shrink-0" />
                        <span className="font-medium text-left text-brand-indigo font-inter">
                          Unit - {topic.name}
                        </span>
                        <span className="text-xs text-brand-indigo/50 whitespace-nowrap font-dm-sans">
                          ({selectedCount}/{MAX_CONCEPTS_PER_TOPIC} selected)
                        </span>
                      </div>
                      {expandedTopics[topic.id] ? (
                        <ChevronUp className="h-4 w-4 flex-shrink-0 text-brand-indigo/40" />
                      ) : (
                        <ChevronDown className="h-4 w-4 flex-shrink-0 text-brand-indigo/40" />
                      )}
                    </button>
                    {expandedTopics[topic.id] && (
                      <div className="space-y-4 pl-2 pt-2">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
                          {conceptsForTopic?.rows.map((concept) => {
                            const isSelected = selectedConcepts.some(
                              (c) => c.id === concept.id
                            );
                            return (
                              <button
                                key={concept.id}
                                onClick={() => toggleConceptSelection(concept)}
                                disabled={
                                  !isSelected &&
                                  selectedCount >= MAX_CONCEPTS_PER_TOPIC
                                }
                                className={cn(
                                  `
                                   aspect-[3/2] flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all duration-200
                                   text-center group relative
                                 `,
                                  isSelected
                                    ? "border-brand-green bg-brand-green/10"
                                    : "border-brand-indigo/10 bg-white hover:border-brand-green/50 disabled:opacity-50 disabled:pointer-events-none disabled:border-brand-indigo/10"
                                )}
                              >
                                {isSelected && (
                                  <div className="absolute top-1 right-1 bg-brand-green rounded-full p-0.5">
                                    <Check className="h-2.5 w-2.5 text-white" />
                                  </div>
                                )}
                                <span
                                  className={cn(
                                    "text-xs sm:text-sm font-medium flex-grow flex items-center justify-center px-1",
                                    isSelected
                                      ? "text-brand-green"
                                      : "text-brand-indigo"
                                  )}
                                >
                                  {concept.name}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                        {totalPages > 1 && (
                          <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={(page) =>
                              handlePageChange(topic.id, page)
                            }
                          />
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex-shrink-0 pt-4 border-t border-brand-indigo/10">
          <div className="flex items-center justify-between text-sm mb-4">
            <span className="font-medium text-brand-green">
              {selectedConcepts.length} Selected Concepts
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="text-red-500 hover:text-red-600 hover:bg-red-50 h-auto p-1 rounded-lg"
              disabled={selectedConcepts.length === 0}
            >
              Clear all
            </Button>
          </div>

          <Button
            className="w-full h-11 text-base bg-brand-indigo hover:bg-brand-indigo/90 text-white rounded-xl font-dm-sans font-medium disabled:opacity-50"
            disabled={selectedConcepts.length === 0}
            onClick={handleContinue}
          >
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
