import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Check, ArrowLeft, Book, Loader2 } from "lucide-react";
import { contentApi } from "@/api/content";
import { Topic } from "@/models/content/topic";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUserSubjectStore } from "@/store/userSubject";
import { useTopicStore } from "@/store/topicStore";
import Pagination from "./Pagination";
import SelectConceptDialog from "./SelectConceptDialog";
import { useContentReqStore } from "@/store/contentReqStore";
import { useTestorStudyGuide } from "@/store/testPathOrStudyGuide";
import { cn } from "@/lib/utils";
import { PaginationRes } from "@/models/common/pageInfo";

interface SelectTopicDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBack: () => void;
}

const MAX_SELECTIONS = 5;

export default function SelectTopicDialog({
  open,
  onOpenChange,
  onBack,
}: SelectTopicDialogProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const { userSubject } = useUserSubjectStore();
  const { selectedTopics, addTopic, clearTopics, clearSelectedTopics } =
    useTopicStore();
  const [showConceptDialog, setShowConceptDialog] = useState(false);
  const [showStudyGuideLoading, setShowStudyGuideLoading] = useState(false);
  const { testorStudyGuide } = useTestorStudyGuide();
  const { addStudyGuideContent, resetStudyGuideContent } = useContentReqStore();

  const { data: topicsData, isLoading: isLoadingTopics } = useQuery<
    PaginationRes<Topic>,
    Error
  >({
    queryKey: [contentApi.getTopics.name, userSubject?.id, currentPage],
    queryFn: () => contentApi.getTopics(userSubject!.id, currentPage),
    enabled: !!userSubject,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const augmentedTopics = useMemo(() => {
    return topicsData?.rows.map((topic) => ({
      ...topic,
      isSelected: selectedTopics.some((selected) => selected.id === topic.id),
    }));
  }, [topicsData?.rows, selectedTopics]);

  const handleTopicToggle = (topic: Topic) => {
    const isSelected = selectedTopics.some((t) => t.id === topic.id);

    if (isSelected) {
      clearTopics();
      if (testorStudyGuide === "sg") {
        const remainingTopicIds = selectedTopics
          .filter((t) => t.id !== topic.id)
          .map((t) => t.id);
        resetStudyGuideContent();
        remainingTopicIds.forEach((id) => addStudyGuideContent(id));
      }
    } else if (selectedTopics.length < MAX_SELECTIONS) {
      addTopic(topic);
      if (testorStudyGuide === "sg") {
        addStudyGuideContent(topic.id);
      }
    } else {
      console.warn(`Max topics (${MAX_SELECTIONS}) reached.`);
    }
  };

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= (topicsData?.totalPages ?? 1)) {
      setCurrentPage(page);
    }
  };

  const handleContinue = () => {
    if (testorStudyGuide === "sg") {
      onOpenChange(false);
    } else if (testorStudyGuide === "tp") {
      resetStudyGuideContent();
      setShowConceptDialog(true);
    } else {
      console.warn("testorStudyGuide state is unexpected:", testorStudyGuide);
      onOpenChange(false);
    }
  };

  const handleClearAll = () => {
    clearSelectedTopics();
    if (testorStudyGuide === "sg") {
      resetStudyGuideContent();
    }
  };

  const handleCloseConceptDialog = (isOpen: boolean) => {
    if (!isOpen) {
      setShowConceptDialog(false);
    }
  };

  const handleCloseStudyGuideLoading = (isOpen: boolean) => {
    if (!isOpen) {
      setShowStudyGuideLoading(false);
    }
  };

  const effectiveOpen = open && !showConceptDialog && !showStudyGuideLoading;

  return (
    <>
      <Dialog open={effectiveOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-3xl w-[95vw] max-h-[90vh] flex flex-col font-dm-sans bg-white text-brand-indigo border-brand-indigo/10 rounded-2xl shadow-xl">
          <DialogHeader className="flex-shrink-0 border-b pb-4">
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
                <Book className="h-5 w-5 text-brand-green" />
                Select Topics from {userSubject?.name || "Course"}
              </DialogTitle>
            </div>
          </DialogHeader>

          <div className="flex-grow overflow-y-auto py-4 pr-2 space-y-4">
            {isLoadingTopics ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-brand-green" />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
                  {augmentedTopics?.map((topic) => (
                    <button
                      key={topic.id}
                      onClick={() => handleTopicToggle(topic)}
                      disabled={
                        !topic.isSelected &&
                        selectedTopics.length >= MAX_SELECTIONS
                      }
                      className={cn(
                        `
                        w-full relative flex items-center p-3 rounded-xl border-2 transition-all duration-200
                        text-left group
                      `,
                        topic.isSelected
                          ? "border-brand-green bg-brand-green/10 shadow-sm"
                          : "border-brand-indigo/10 bg-white hover:border-brand-green/50 disabled:opacity-50 disabled:pointer-events-none disabled:border-brand-indigo/10"
                      )}
                    >
                      {topic.isSelected && (
                        <div className="absolute top-2 right-2 bg-brand-green rounded-full p-0.5">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      )}
                      <Book
                        className={cn(
                          "h-4 w-4 mr-3 flex-shrink-0",
                          topic.isSelected
                            ? "text-brand-green"
                            : "text-brand-indigo/40 group-hover:text-brand-green"
                        )}
                      />
                      <span
                        className={cn(
                          "flex-grow text-xs sm:text-sm font-medium pr-4",
                          topic.isSelected ? "text-brand-green" : "text-brand-indigo"
                        )}
                      >
                        {topic.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex-shrink-0 pt-4 border-t">
            {topicsData && topicsData.totalPages > 1 && (
              <div className="mb-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={topicsData.totalPages || 1}
                  onPageChange={handlePageChange}
                />
              </div>
            )}

            <div className="flex items-center justify-between text-sm mb-4">
              <span className="font-medium text-brand-green">
                {selectedTopics.length}/{MAX_SELECTIONS} Selected Units
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                className="text-red-500 hover:text-red-600 hover:bg-red-50 h-auto p-1 rounded-lg"
                disabled={selectedTopics.length === 0}
              >
                Clear all
              </Button>
            </div>

            <Button
              className="w-full h-11 text-base bg-brand-indigo hover:bg-brand-indigo/90 text-white rounded-xl font-dm-sans font-medium disabled:opacity-50"
              disabled={selectedTopics.length === 0}
              onClick={handleContinue}
            >
              {selectedTopics.length > 0
                ? `Continue with ${selectedTopics.length} Topic${
                    selectedTopics.length > 1 ? "s" : ""
                  }`
                : "Select at least one Topic"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {testorStudyGuide === "tp" && (
        <SelectConceptDialog
          open={open && showConceptDialog}
          onOpenChange={handleCloseConceptDialog}
          onBack={() => setShowConceptDialog(false)}
        />
      )}
    </>
  );
}
