"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Timer,
  CheckCircle,
  X,
  ChevronDown,
  AlertCircle,
  Loader2,
  ListChecks,
  XCircle,
  ChevronUp,
} from "lucide-react";
import { useExamIdStore } from "@/store/examStore";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { profileApi } from "@/api/profile";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { EvaluationResult } from "@/models/profile/examResult";
import { ExamConcept } from "@/models/content/exam";

export default function ResultPage() {
  const params = useParams();
  const router = useRouter();
  const examId = params.id as string;
  const { setExamId } = useExamIdStore();

  const {
    data: evaluationData,
    isLoading,
    error,
  } = useQuery<EvaluationResult, Error>({
    queryKey: [profileApi.getExamEvaluation.name, examId],
    queryFn: () =>
      profileApi.getExamEvaluation({
        examID: examId,
        pageNumber: 1,
      }),
    enabled: !!examId,
    staleTime: 5 * 60 * 1000,
  });

  const typedEvaluationData = evaluationData as EvaluationResult | undefined;

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-var(--header-height,100px))] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !typedEvaluationData) {
    return (
      <div className="container max-w-3xl mx-auto py-8 px-4 flex flex-col items-center justify-center min-h-[calc(100vh-var(--header-height,100px)-100px)]">
        <Alert variant="destructive" className="w-full max-w-md mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Results</AlertTitle>
          <AlertDescription>
            {error
              ? `Failed to load exam results: ${error.message}`
              : "Exam results could not be found."}
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

  const handleViewReview = () => {
    setExamId(typedEvaluationData.id);
    router.push(`/dashboard/evaluation/review/${typedEvaluationData.id}`);
  };

  return (
    <div className="container max-w-3xl mx-auto py-6 md:py-8 px-4">
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
          <h1 className="text-xl md:text-2xl font-semibold">Exam Result</h1>
          <p
            className="text-sm text-muted-foreground truncate mt-0.5"
            title={typedEvaluationData.exam_title}
          >
            {typedEvaluationData.exam_title}
          </p>
        </div>
      </div>

      {/* Main Score and Stats Card - Reusing Performance Page Style */}
      <Card className="mb-6 rounded-xl overflow-hidden border border-border/60 shadow-sm">
        <CardHeader className="p-4 md:p-6 bg-muted/30 dark:bg-muted/20 border-b dark:border-border">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <CardTitle
                className="text-lg font-medium truncate"
                title={typedEvaluationData.exam_title}
              >
                {typedEvaluationData.exam_title}
              </CardTitle>
              <CardDescription className="mt-1">
                Overall Performance Summary
              </CardDescription>
            </div>
            <div className="text-right flex-shrink-0">
              <span className="text-3xl font-bold text-primary block">
                {typedEvaluationData.exam_score ?? "--"}%
              </span>
              <span className="text-xs text-muted-foreground">
                Overall Score
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
            {/* Time Taken Stat */}
            <StatItem
              label="Time Taken"
              value={
                typedEvaluationData.time_taken > 60
                  ? `${(typedEvaluationData.time_taken / 60).toFixed(1)}m`
                  : `${typedEvaluationData.time_taken ?? "--"}s`
              }
              icon={Timer}
              iconColor="text-blue-600 dark:text-blue-400"
            />

            {/* Correct Answers Stat */}
            <StatItem
              label="Correct"
              value={`${typedEvaluationData.correct ?? "--"} / ${
                typedEvaluationData.total_questions ?? "--"
              }`}
              icon={CheckCircle}
              iconColor="text-green-600 dark:text-green-400"
            />

            {/* Wrong Answers Stat */}
            <StatItem
              label="Wrong"
              value={`${typedEvaluationData.wrong ?? "--"} / ${
                typedEvaluationData.total_questions ?? "--"
              }`}
              icon={XCircle}
              iconColor="text-red-600 dark:text-red-500"
            />

            {/* Skipped Questions Stat */}
            <StatItem
              label="Skipped"
              value={`${typedEvaluationData.skipped ?? "--"} / ${
                typedEvaluationData.total_questions ?? "--"
              }`}
              icon={AlertCircle}
              iconColor="text-yellow-600 dark:text-yellow-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* View Answers Button */}
      <Button
        variant="default"
        className="w-full mb-8 shadow-sm"
        onClick={handleViewReview}
      >
        View Answers & Explanations
      </Button>

      {/* Concept Results Section */}
      {typedEvaluationData.concepts &&
        typedEvaluationData.concepts.length > 0 && (
          <Card className="border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ListChecks className="h-5 w-5 text-primary" /> Concept
                Performance
              </CardTitle>
              <CardDescription>
                Breakdown of your performance by concept.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-2">
              {typedEvaluationData.concepts.map((concept) => (
                <ConceptAccordionItem key={concept.id} concept={concept} />
              ))}
            </CardContent>
          </Card>
        )}
    </div>
  );
}

// Reusable Stat Item Component
const StatItem = ({
  label,
  value,
  icon: Icon,
  iconColor,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  iconColor?: string;
}) => (
  <div className="bg-background dark:bg-muted/40 rounded-lg p-3 border border-border/50 shadow-xs">
    <div className="flex justify-between items-start mb-1">
      <span className="text-lg font-semibold text-foreground">{value}</span>
      <Icon
        className={cn(
          "h-4 w-4 mt-1 flex-shrink-0",
          iconColor || "text-muted-foreground"
        )}
      />
    </div>
    <span className="text-xs text-muted-foreground">{label}</span>
  </div>
);

// Updated Concept Accordion Item to use ExamConcept
const ConceptAccordionItem = ({ concept }: { concept: ExamConcept }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full border rounded-lg dark:border-border overflow-hidden"
    >
      <CollapsibleTrigger className="flex w-full justify-between items-center p-3 md:p-4 bg-muted/50 dark:bg-muted/30 hover:bg-muted/80 dark:hover:bg-muted/50 transition-colors">
        <span
          className="font-medium dark:text-foreground text-sm truncate pr-2"
          title={concept.name}
        >
          {concept.name}
        </span>
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Chevron */}
          {isOpen ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="p-3 md:p-4 bg-background dark:bg-background/50 border-t dark:border-border">
        <div className="space-y-1 text-sm text-muted-foreground">
          <p>
            <span className="font-medium text-foreground">ID:</span>{" "}
            {concept.id}
          </p>
          <p>Further details about this concept could be shown here.</p>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
