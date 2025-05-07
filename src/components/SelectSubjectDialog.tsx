import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Check, Book, GraduationCap, Loader2 } from "lucide-react";
import { contentApi } from "@/api/content";
import { Subject } from "@/models/content/subject";
import { PaginationRes } from "@/models/common/pageInfo";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import Pagination from "./Pagination";
import SelectTopicDialog from "./SelectTopicDialog";
import { cn } from "@/lib/utils";
import { useUserSubjectStore } from "@/store/userSubject";
import { useTopicStore } from "@/store/topicStore";
import { useConceptStore } from "@/store/conceptStore";
import { useContentReqStore } from "@/store/contentReqStore";
import useSubjectStore from "@/store/subjectStore";

interface SelectSubjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SelectSubjectDialog({
  open,
  onOpenChange,
}: SelectSubjectDialogProps) {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [showTopicDialog, setShowTopicDialog] = useState(false);

  const { setSubject } = useSubjectStore();
  const { setUserSubject } = useUserSubjectStore();
  const { clearSelectedTopics } = useTopicStore();
  const { clearSelectedConcepts } = useConceptStore();
  const { resetContent, resetStudyGuideContent } = useContentReqStore();

  const { data: subjectsData, isLoading: isLoadingSubjects } = useQuery<
    PaginationRes<Subject>,
    Error
  >({
    queryKey: [contentApi.getSubject.name, currentPage],
    queryFn: () => contentApi.getSubject(currentPage),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  useEffect(() => {
    if (open) {
      setSelectedSubjectId(null);
      clearSelectedTopics();
      clearSelectedConcepts();
      resetContent();
      resetStudyGuideContent();
      setCurrentPage(1);
    }
  }, [
    open,
    clearSelectedTopics,
    clearSelectedConcepts,
    resetContent,
    resetStudyGuideContent,
  ]);

  const handleSubjectSelection = (subject: Subject) => {
    setSelectedSubjectId(subject.id);
  };

  const handleContinue = () => {
    const selectedSubjectData = subjectsData?.rows.find(
      (s) => s.id === selectedSubjectId
    );
    if (selectedSubjectData) {
      const minifiedSubject = {
        id: selectedSubjectData.id,
        name: selectedSubjectData.name,
        desc: selectedSubjectData.desc,
      };
      setSubject(minifiedSubject);
      setUserSubject(minifiedSubject);
      resetContent();
      resetStudyGuideContent();
      setShowTopicDialog(true);
    }
  };

  const handleTopicDialogClose = (isOpen: boolean) => {
    if (!isOpen) {
      setShowTopicDialog(false);
      onOpenChange(false);
    }
  };

  const handleTopicBack = () => {
    setShowTopicDialog(false);
  };

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= (subjectsData?.totalPages ?? 1)) {
      setCurrentPage(page);
      setSelectedSubjectId(null);
    }
  };

  const effectiveOpen = open && !showTopicDialog;

  return (
    <>
      <Dialog open={effectiveOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-3xl w-[95vw] max-h-[90vh] flex flex-col font-funnel-sans bg-background text-foreground border-border rounded-lg">
          <DialogHeader className="flex-shrink-0 border-b pb-4">
            <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl font-semibold text-foreground">
              <GraduationCap className="h-5 w-5 text-primary" />
              Select a course
            </DialogTitle>
          </DialogHeader>

          <div className="flex-grow overflow-y-auto py-4 pr-2 space-y-4">
            {isLoadingSubjects ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : subjectsData && subjectsData.rows.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {subjectsData.rows.map((subject) => {
                  const isSelected = subject.id === selectedSubjectId;
                  return (
                    <button
                      key={subject.id}
                      onClick={() => handleSubjectSelection(subject)}
                      className={cn(
                        `
                        relative flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all duration-150
                        aspect-square text-center group
                      `,
                        isSelected
                          ? "border-primary bg-primary/20 shadow-md"
                          : "border-border bg-card hover:border-primary/50 hover:shadow-sm"
                      )}
                    >
                      {isSelected && (
                        <div className="absolute top-2 right-2 bg-primary rounded-full p-0.5">
                          <Check className="h-3 w-3 text-background" />
                        </div>
                      )}
                      <Book
                        className={cn(
                          "h-6 w-6 mb-2",
                          isSelected
                            ? "text-primary"
                            : "text-muted-foreground group-hover:text-primary"
                        )}
                      />
                      <span
                        className={cn(
                          "text-xs sm:text-sm font-medium",
                          isSelected ? "text-primary" : "text-foreground"
                        )}
                      >
                        {subject.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No courses available.
              </div>
            )}
          </div>

          <div className="flex-shrink-0 pt-4 border-t border-border space-y-4">
            {subjectsData &&
              subjectsData.totalPages &&
              subjectsData.totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={subjectsData.totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            <Button
              className="w-full h-11 text-base bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50"
              disabled={!selectedSubjectId}
              onClick={handleContinue}
            >
              {selectedSubjectId
                ? `Continue with ${
                    subjectsData?.rows.find((s) => s.id === selectedSubjectId)
                      ?.name ?? "Selected Subject"
                  }`
                : "Select a Subject"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <SelectTopicDialog
        open={open && showTopicDialog}
        onOpenChange={handleTopicDialogClose}
        onBack={handleTopicBack}
      />
    </>
  );
}
