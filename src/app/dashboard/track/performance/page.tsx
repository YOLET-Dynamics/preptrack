"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Timer, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useExamStore } from "@/store/examStore";
import { useExamInitStore } from "@/store/examStore";
import { useContentReqStore } from "@/store/contentReqStore";
import { useQuery, useMutation } from "@tanstack/react-query";
import { evaluationApi } from "@/api/evaluation";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import useExamEvaluationStore from "@/store/examEvalStore";

import { ConceptScore } from "@/models/evaluation/evaluateExam";
import { useExamReviewStore } from "@/store/examReviewStore";
import { testPathApi } from "@/api/testPath";
import useSubjectStore from "@/store/subjectStore";

export default function PerformancePage() {
  const router = useRouter();
  const { examData } = useExamStore();
  const { examEvaluation } = useExamEvaluationStore();
  const { isInit } = useExamInitStore();
  const { setReviewData } = useExamReviewStore();
  const { subject } = useSubjectStore();
  const { content } = useContentReqStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [testPathName, setTestPathName] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const generatePathMutation = useMutation({
    mutationFn: testPathApi.generateTestPath,
    onSuccess: (data) => {
      router.push(`/dashboard/test-paths/${data.test_path_id}`);
    },
    onError: () => {
      setErrorMessage("Failed to generate test path");
    },
  });

  const handleGeneratePath = async () => {
    setIsModalOpen(false);
    generatePathMutation.mutate({
      subject_id: subject!.id,
      content: content,
      name: testPathName || undefined,
    });
  };

  const generatePathLoading = generatePathMutation.isPending;

  const { data: reviewData, isLoading: reviewLoading } = useQuery({
    queryKey: ["examAnswers", examData?.exam_info?.id],
    queryFn: () => evaluationApi.getExamAnswers(examData?.exam_info?.id, 1),
    enabled: !!examData?.exam_info?.id,
  });

  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      router.push(`/app/exam/${examData?.exam_info?.id}`);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [router]);

  const handleClose = () => {
    router.back();
  };

  if (!examData || !examData.exam_info.id) {
    // Redirect or show an error if essential data is missing
    // Using replace to avoid adding this temporary state to history
    // Consider redirecting to a more suitable page like the dashboard home
    useEffect(() => {
      router.replace("/dashboard/track"); // Or appropriate dashboard page
    }, [router]);
    return null; // Render nothing while redirecting
  }

  if (errorMessage) {
    return (
      <div className="flex h-screen items-center justify-center px-6">
        <div className="text-center">
          <div className="mb-4 h-16 w-16 rounded-full bg-red-50 dark:bg-red-900/20 mx-auto flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-red-500 dark:text-red-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Oops!
          </h2>
          <p className="text-base text-gray-600 dark:text-gray-400 mb-6">
            {errorMessage}
          </p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold dark:text-gray-100">
            Performance Results
          </h1>
          <button
            onClick={handleClose}
            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Main Score and Stats Card */}
        <div className="mb-6 rounded-xl p-6 bg-blue-50/50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50">
          {/* Header within the card */}
          <div className="flex items-center justify-between mb-6">
            <h2
              className="text-lg font-medium w-7/12 dark:text-gray-100 truncate"
              title={examData?.exam_info.title}
            >
              {examData?.exam_info.title || "Evaluation Results"}
            </h2>
            {/* Consider adding a visual score representation here if desired */}
            <div className="text-right">
              <span className="text-3xl font-bold dark:text-gray-100 block">
                {examEvaluation?.exam_score ?? "--"}%
              </span>
              <span className="text-xs text-muted-foreground">
                Overall Score
              </span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Time Taken Stat */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start mb-1">
                <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                  {examEvaluation?.time_taken && examEvaluation?.time_taken > 60
                    ? `${(examEvaluation.time_taken / 60).toFixed(1)}m`
                    : `${examEvaluation?.time_taken ?? "--"}s`}
                </span>
                <Timer className="h-4 w-4 text-blue-500 dark:text-blue-400 mt-1" />
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Time Taken
              </span>
            </div>

            {/* Correct Answers Stat */}
            <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-4 shadow-sm border border-green-200 dark:border-green-700">
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-semibold text-green-700 dark:text-green-300">
                    {examEvaluation?.correct ?? "--"}
                  </span>
                  <span className="text-xs text-green-600 dark:text-green-400 opacity-80">
                    / {examData?.exam_info.total_questions ?? "--"}
                  </span>
                </div>
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mt-1" />
              </div>
              <span className="text-xs text-green-700 dark:text-green-400">
                Correct
              </span>
            </div>

            {/* Wrong Answers Stat */}
            <div className="bg-red-50 dark:bg-red-900/30 rounded-lg p-4 shadow-sm border border-red-200 dark:border-red-700">
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-semibold text-red-700 dark:text-red-300">
                    {examEvaluation?.wrong ?? "--"}
                  </span>
                  <span className="text-xs text-red-600 dark:text-red-400 opacity-80">
                    / {examData?.exam_info.total_questions ?? "--"}
                  </span>
                </div>
                <X className="h-4 w-4 text-red-600 dark:text-red-400 mt-1" />
              </div>
              <span className="text-xs text-red-700 dark:text-red-400">
                Wrong
              </span>
            </div>

            {/* Skipped Questions Stat */}
            <div className="bg-yellow-50 dark:bg-yellow-900/30 rounded-lg p-4 shadow-sm border border-yellow-200 dark:border-yellow-700">
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-semibold text-yellow-700 dark:text-yellow-300">
                    {examEvaluation?.skipped ?? "--"}
                  </span>
                  <span className="text-xs text-yellow-600 dark:text-yellow-400 opacity-80">
                    / {examData?.exam_info.total_questions ?? "--"}
                  </span>
                </div>
                {/* Consider a different icon for skipped, e.g., AlertTriangle or Minus */}
                <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-1" />
              </div>
              <span className="text-xs text-yellow-700 dark:text-yellow-400">
                Skipped
              </span>
            </div>
          </div>
        </div>

        <Button
          variant="secondary"
          className="w-full mb-8"
          onClick={() => {
            if (reviewData) {
              setReviewData(reviewData);
              router.push(`/dashboard/evaluation/review`);
            }
          }}
          disabled={reviewLoading || !reviewData}
        >
          {reviewLoading ? "Loading Answers..." : "View Answers & Explanations"}
        </Button>

        {/* Concept Results Section */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4 dark:text-gray-100">
            Concept Performance
          </h2>
          <div className="space-y-3">
            {" "}
            {/* Adjusted spacing */}
            {examEvaluation?.concept_score &&
            examEvaluation.concept_score.length > 0 ? (
              examEvaluation.concept_score.map((concept: ConceptScore) => (
                <ConceptAccordionItem
                  key={concept.concept_id}
                  concept={concept}
                />
              ))
            ) : (
              <p className="text-muted-foreground text-sm">
                No concept breakdown available.
              </p>
            )}
          </div>
        </div>

        {/* Generate Test Path Button */}
        {isInit && (
          <Button
            className="w-full mt-6" // Standard button styling
            onClick={() => setIsModalOpen(true)}
            disabled={generatePathLoading}
          >
            {generatePathLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Generating Path...
              </div>
            ) : (
              "Generate Personalized Path"
            )}
          </Button>
        )}
      </div>

      {/* Generate Path Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="dark:bg-card dark:border-border">
          {" "}
          {/* Adjusted Dialog styling */}
          <DialogHeader>
            <DialogTitle className="dark:text-foreground">
              Name Your Test Path
            </DialogTitle>
            <DialogDescription className="dark:text-muted-foreground">
              Optionally give your new personalized test path a name (e.g.,
              "Algebra Weak Areas").
            </DialogDescription>
          </DialogHeader>
          <Input
            placeholder="Optional Test Path Name"
            value={testPathName}
            onChange={(e) => setTestPathName(e.target.value)} // Removed trim for potentially intended spaces
            className="dark:bg-input dark:border-input dark:text-foreground dark:placeholder-muted-foreground"
          />
          {errorMessage && ( // Show error inside the dialog
            <p className="text-sm text-red-500 dark:text-red-400">
              {errorMessage}
            </p>
          )}
          <DialogFooter>
            {/* Simplified Skip/Generate logic */}
            <Button
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                setTestPathName(""); // Clear name on skip
                setErrorMessage(null); // Clear error on close
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleGeneratePath} // Directly call handler
              disabled={generatePathLoading} // Disable during generation
              className="dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90"
            >
              {generatePathLoading ? "Generating..." : "Generate Path"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Renamed AccordionItem to ConceptAccordionItem for clarity
const ConceptAccordionItem = ({ concept }: { concept: ConceptScore }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Determine color based on focus_area and score (example logic)
  const scoreColor = concept.focus_area
    ? "text-red-500 dark:text-red-400"
    : "text-green-600 dark:text-green-400";
  const focusIndicatorColor = concept.focus_area
    ? "bg-red-500"
    : "bg-green-500";

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full border rounded-lg dark:border-border overflow-hidden"
    >
      <CollapsibleTrigger className="flex w-full justify-between items-center p-4 bg-muted/50 dark:bg-muted/30 hover:bg-muted/80 dark:hover:bg-muted/50 transition-colors">
        <span
          className="font-medium dark:text-foreground text-sm truncate pr-2"
          title={concept.concept_name}
        >
          {concept.concept_name}
        </span>
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Focus Area Indicator */}
          <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${focusIndicatorColor}`} />
            {concept.focus_area ? "Focus Area" : "Strong"}
          </span>
          {/* Score Indicator */}
          <span className={`text-sm font-semibold ${scoreColor}`}>
            {concept.score}%
          </span>
          {/* Chevron */}
          {isOpen ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="p-4 bg-background dark:bg-background/50 border-t dark:border-border">
        <div className="space-y-1 text-sm text-muted-foreground">
          <p>
            <span className="font-medium text-foreground">Score:</span>{" "}
            {concept.score}%
          </p>
          <p>
            <span className="font-medium text-foreground">Questions:</span>{" "}
            {concept.count}
          </p>
          {/* Add more details if available, e.g., specific sub-concepts */}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
