"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Lightbulb,
  Clock, // Icon for time taken
  TrendingUp, // Icon for score change
  Info, // Icon for general info/skipped
  BookOpen, // Icon for concept
  BarChart, // Icon for difficulty
  Loader2, // Loader icon
} from "lucide-react";
import { useState } from "react";
import { evaluationApi } from "@/api/evaluation";
import { useExamReviewStore } from "@/store/examReviewStore";
import { useExamStore, useExamIdStore } from "@/store/examStore";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { QuestionResult } from "@/models/profile/questionResult";

// Refined Question Item Component
const QuestionItem = ({ item }: { item: QuestionResult }) => {
  const [isExplanationOpen, setIsExplanationOpen] = useState(false);

  const wasSkipped = !item.last_attempt;
  const isCorrect =
    !wasSkipped && item.last_attempt?.id === item.question.answer.id;
  const scoreChange = item.score - item.prev_score;

  return (
    <Card className="overflow-hidden border-border/60 shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader className="p-4 bg-muted/30 dark:bg-muted/20 border-b dark:border-border">
        {/* Question Number / ID could go here if available */}
        <CardTitle className="text-base font-medium leading-relaxed">
          {item.question.value}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        {/* User Answer / Skipped Alert */}
        <Alert
          variant={
            wasSkipped ? "default" : isCorrect ? "destructive" : "destructive"
          }
          className="flex items-start"
        >
          {wasSkipped ? (
            <Info className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5" />
          ) : isCorrect ? (
            <CheckCircle2 className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5 text-green-600 dark:text-green-500" />
          ) : (
            <XCircle className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5 text-red-600 dark:text-red-500" />
          )}
          <div className="flex-1">
            <AlertTitle className="mb-1">
              {wasSkipped ? "Skipped" : "Your Answer"}
            </AlertTitle>
            {!wasSkipped && (
              <AlertDescription>{item.last_attempt?.value}</AlertDescription>
            )}
          </div>
        </Alert>

        {/* Correct Answer Alert (if incorrect) */}
        {!isCorrect && !wasSkipped && (
          <Alert variant="default" className="flex items-start">
            <CheckCircle2 className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5 text-green-600 dark:text-green-500" />
            <div className="flex-1">
              <AlertTitle className="mb-1">Correct Answer</AlertTitle>
              <AlertDescription>{item.question.answer.value}</AlertDescription>
            </div>
          </Alert>
        )}

        {/* Explanation Collapsible */}
        {item.question.answer.explanation && (
          <Collapsible
            open={isExplanationOpen}
            onOpenChange={setIsExplanationOpen}
            className="pt-2"
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-1.5 px-2 h-auto py-1 text-sm text-primary hover:text-primary/90"
              >
                <Lightbulb className="h-4 w-4" />
                Explanation
                {isExplanationOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2">
              <p className="text-sm text-muted-foreground pl-4 border-l-2 border-border ml-2 py-1">
                {item.question.answer.explanation.description}
              </p>
            </CollapsibleContent>
          </Collapsible>
        )}
      </CardContent>
      <CardFooter className="p-4 bg-muted/30 dark:bg-muted/20 border-t dark:border-border flex flex-wrap gap-x-4 gap-y-2 justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1" title="Time Taken">
          <Clock className="h-3.5 w-3.5" />
          <span>{item.time_taken}s</span>
        </div>
        <div
          className="flex items-center gap-1"
          title={`Score: ${item.score}% (Previous: ${item.prev_score}%)`}
        >
          <TrendingUp className="h-3.5 w-3.5" />
          <span>
            {item.score}%
            {scoreChange !== 0 && (
              <span
                className={cn(
                  "ml-1",
                  scoreChange > 0 ? "text-green-600" : "text-red-600"
                )}
              >
                ({scoreChange > 0 ? "+" : ""}
                {scoreChange}%)
              </span>
            )}
          </span>
        </div>
        <div
          className="flex items-center gap-1"
          title={`Difficulty: ${item.question.difficulty}`}
        >
          <BarChart className="h-3.5 w-3.5" />
          <span>{item.question.difficulty}</span>
        </div>
        <div
          className="flex items-center gap-1 truncate"
          title={`Concept: ${item.question.concept}`}
        >
          <BookOpen className="h-3.5 w-3.5" />
          <span className="truncate">{item.question.concept}</span>
        </div>
      </CardFooter>
    </Card>
  );
};

// Main Page Component
export default function ExamReviewPage() {
  const router = useRouter();
  const params = useParams();
  const { currentPage, setCurrentPage } = useExamReviewStore(); // Removed setReviewData if not used directly
  const { examData } = useExamStore();
  const { examId } = useExamIdStore();

  const effectiveExamId =
    examData?.exam_info?.id || examId || (params.id as string);

  const {
    data: reviewData,
    isLoading,
    error,
    isFetching,
    isPlaceholderData, // Use this to show loading indicator during page change
  } = useQuery({
    queryKey: [evaluationApi.getExamAnswers.name, effectiveExamId, currentPage],
    queryFn: () => {
      if (!effectiveExamId) throw new Error("Exam ID is missing");
      return evaluationApi.getExamAnswers(effectiveExamId, currentPage);
    },
    enabled: !!effectiveExamId,
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
  });

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= (reviewData?.total_pages ?? 1)) {
      setCurrentPage(newPage);
      // Scroll to top when page changes
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-var(--header-height,100px))] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (
    error ||
    !reviewData ||
    !reviewData.question_results ||
    reviewData.question_results.length === 0
  ) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4 flex flex-col items-center justify-center min-h-[calc(100vh-var(--header-height,100px)-100px)]">
        <Alert variant="destructive" className="w-full max-w-md mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Review</AlertTitle>
          <AlertDescription>
            {error
              ? `Failed to load exam review: ${error.message}`
              : "No question results were found for this exam page."}{" "}
            <br />
            Please try again or go back.
          </AlertDescription>
        </Alert>
        <Button variant="outline" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  const { question_results, page_number, total_pages } = reviewData;

  return (
    <div className="container max-w-4xl mx-auto py-6 md:py-8 px-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6 md:mb-8">
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 flex-shrink-0"
          onClick={() => router.back()}
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl md:text-2xl font-semibold">Exam Review</h1>
          {examData?.exam_info.title && (
            <p
              className="text-sm text-muted-foreground truncate mt-0.5"
              title={examData.exam_info.title}
            >
              {examData.exam_info.title}
            </p>
          )}
        </div>
      </div>

      {/* Question List - Add loading overlay during page fetch */}
      <div
        className={cn(
          "space-y-6 relative",
          isFetching && isPlaceholderData && "opacity-50 pointer-events-none"
        )}
      >
        {isFetching && isPlaceholderData && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        {question_results.map((item) => (
          <QuestionItem key={item.question.id} item={item} />
        ))}
      </div>

      {/* Pagination */}
      {total_pages > 1 && (
        <div className="flex justify-between items-center mt-8 pt-4 border-t dark:border-border">
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || isFetching}
            variant="outline"
          >
            Previous Page
          </Button>
          <span className="text-sm font-medium text-muted-foreground">
            Page {currentPage} / {total_pages}
          </span>
          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === total_pages || isFetching}
            variant="outline"
          >
            Next Page
          </Button>
        </div>
      )}
    </div>
  );
}
