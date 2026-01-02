"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  Timer,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Target,
  Sparkles,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
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
import useExamEvaluationStore from "@/store/examEvalStore";
import { ConceptScore } from "@/models/evaluation/evaluateExam";
import { useExamReviewStore } from "@/store/examReviewStore";
import { testPathApi } from "@/api/testPath";
import useSubjectStore from "@/store/subjectStore";
import { cn } from "@/lib/utils";

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
  }, [router, examData?.exam_info?.id]);

  const handleClose = () => {
    router.back();
  };

  if (!examData || !examData.exam_info.id) {
    useEffect(() => {
      router.replace("/dashboard/track");
    }, [router]);
    return null;
  }

  if (errorMessage) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6 bg-white">
        <div className="text-center max-w-md">
          <div className="mb-6 h-20 w-20 rounded-2xl bg-red-50 mx-auto flex items-center justify-center">
            <AlertCircle className="h-10 w-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-brand-indigo font-inter mb-3">
            Oops! Something went wrong
          </h2>
          <p className="text-brand-indigo/60 font-dm-sans mb-8">
            {errorMessage}
          </p>
          <Button
            onClick={() => router.back()}
            className="bg-brand-indigo text-white hover:bg-brand-indigo/90 rounded-xl font-dm-sans"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const score = examEvaluation?.exam_score ?? 0;
  const getScoreColor = () => {
    if (score >= 70) return "text-brand-green";
    if (score >= 40) return "text-amber-500";
    return "text-blue-500";
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-white">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold text-brand-indigo font-inter">
            Performance Results
          </h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="text-brand-indigo/40 hover:text-brand-indigo hover:bg-brand-indigo/5 rounded-xl"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Main Score Card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 p-6 sm:p-8">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-green/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4" />

          <div className="relative z-10">
            {/* Title */}
            <div className="flex items-center gap-2 text-white/70 text-sm font-dm-sans mb-2">
              <Sparkles className="h-4 w-4" />
              <span>Exam Complete</span>
            </div>
            <h2
              className="text-xl sm:text-2xl font-bold text-white font-inter mb-6 line-clamp-2"
              title={examData?.exam_info.title}
            >
              {examData?.exam_info.title || "Evaluation Results"}
            </h2>

            {/* Score display */}
            <div className="flex items-center justify-between gap-6 mb-6">
              <div>
                <div className="flex items-baseline">
                  <span className="text-6xl sm:text-7xl font-bold text-white font-inter">
                    {examEvaluation?.exam_score ?? "--"}
                  </span>
                  <span className="text-3xl text-white/70 ml-1">%</span>
                </div>
                <p className="text-white/60 text-sm font-dm-sans mt-1">Overall Score</p>
              </div>

              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl">
                <TrendingUp className="h-4 w-4 text-brand-green" />
                <span className="text-white/90 text-sm font-medium font-dm-sans">
                  {score >= 70 ? "Great job!" : score >= 40 ? "Good effort!" : "Keep practicing!"}
                </span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Time Taken */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xl font-bold text-white font-inter">
                    {examEvaluation?.time_taken && examEvaluation?.time_taken > 60
                      ? `${(examEvaluation.time_taken / 60).toFixed(1)}m`
                      : `${examEvaluation?.time_taken ?? "--"}s`}
                  </span>
                  <Timer className="h-4 w-4 text-blue-200" />
                </div>
                <span className="text-xs text-white/60 font-dm-sans">Time Taken</span>
              </div>

              {/* Correct */}
              <div className="bg-brand-green/20 backdrop-blur-sm rounded-xl p-4 border border-brand-green/30">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold text-white font-inter">
                      {examEvaluation?.correct ?? "--"}
                    </span>
                    <span className="text-xs text-white/60">
                      /{examData?.exam_info.total_questions ?? "--"}
                    </span>
                  </div>
                  <CheckCircle className="h-4 w-4 text-brand-green" />
                </div>
                <span className="text-xs text-white/60 font-dm-sans">Correct</span>
              </div>

              {/* Wrong */}
              <div className="bg-red-500/20 backdrop-blur-sm rounded-xl p-4 border border-red-500/30">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold text-white font-inter">
                      {examEvaluation?.wrong ?? "--"}
                    </span>
                    <span className="text-xs text-white/60">
                      /{examData?.exam_info.total_questions ?? "--"}
                    </span>
                  </div>
                  <X className="h-4 w-4 text-red-300" />
                </div>
                <span className="text-xs text-white/60 font-dm-sans">Wrong</span>
              </div>

              {/* Skipped */}
              <div className="bg-amber-500/20 backdrop-blur-sm rounded-xl p-4 border border-amber-500/30">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold text-white font-inter">
                      {examEvaluation?.skipped ?? "--"}
                    </span>
                    <span className="text-xs text-white/60">
                      /{examData?.exam_info.total_questions ?? "--"}
                    </span>
                  </div>
                  <AlertCircle className="h-4 w-4 text-amber-300" />
                </div>
                <span className="text-xs text-white/60 font-dm-sans">Skipped</span>
              </div>
            </div>
          </div>
        </div>

        {/* View Answers Button */}
        <Button
          className="w-full h-12 bg-white border border-brand-indigo/10 text-brand-indigo hover:bg-brand-indigo/5 group rounded-xl font-dm-sans shadow-sm"
          onClick={() => {
            if (reviewData) {
              setReviewData(reviewData);
              router.push(`/dashboard/evaluation/review`);
            }
          }}
          disabled={reviewLoading || !reviewData}
        >
          {reviewLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-brand-indigo/30 border-t-brand-indigo rounded-full animate-spin mr-2" />
              Loading Answers...
            </>
          ) : (
            <>
              View Answers & Explanations
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </>
          )}
        </Button>

        {/* Concept Performance Section */}
        <div className="bg-white border border-brand-indigo/10 rounded-2xl p-5 sm:p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 bg-blue-50 rounded-xl">
              <Target className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-brand-indigo font-inter">
                Concept Performance
              </h2>
              <p className="text-xs text-brand-indigo/50 font-dm-sans">
                See how you performed on each concept
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {examEvaluation?.concept_score &&
            examEvaluation.concept_score.length > 0 ? (
              examEvaluation.concept_score.map((concept: ConceptScore) => (
                <ConceptAccordionItem key={concept.concept_id} concept={concept} />
              ))
            ) : (
              <div className="text-center py-8 text-brand-indigo/50 font-dm-sans">
                No concept breakdown available.
              </div>
            )}
          </div>
        </div>

        {/* Generate Test Path Button */}
        {isInit && (
          <Button
            className="w-full h-12 bg-gradient-to-r from-brand-green to-emerald-500 text-white hover:opacity-90 rounded-xl font-dm-sans font-medium shadow-lg shadow-brand-green/20"
            onClick={() => setIsModalOpen(true)}
            disabled={generatePathLoading}
          >
            {generatePathLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating Path...
              </div>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Personalized Path
              </>
            )}
          </Button>
        )}
      </div>

      {/* Generate Path Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-white border-brand-indigo/10 rounded-2xl p-6 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-brand-indigo font-inter">
              Name Your Test Path
            </DialogTitle>
            <DialogDescription className="text-brand-indigo/60 font-dm-sans mt-2">
              Optionally give your personalized test path a name (e.g., "Algebra Weak Areas").
            </DialogDescription>
          </DialogHeader>
          <Input
            placeholder="Optional Test Path Name"
            value={testPathName}
            onChange={(e) => setTestPathName(e.target.value)}
            className="h-12 bg-brand-indigo/5 border-brand-indigo/10 text-brand-indigo placeholder:text-brand-indigo/40 rounded-xl font-dm-sans mt-4"
          />
          {errorMessage && (
            <p className="text-sm text-red-500 font-dm-sans mt-2">{errorMessage}</p>
          )}
          <DialogFooter className="mt-6 gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                setTestPathName("");
                setErrorMessage(null);
              }}
              className="border-brand-indigo/10 text-brand-indigo hover:bg-brand-indigo/5 rounded-xl font-dm-sans"
            >
              Cancel
            </Button>
            <Button
              onClick={handleGeneratePath}
              disabled={generatePathLoading}
              className="bg-brand-indigo text-white hover:bg-brand-indigo/90 rounded-xl font-dm-sans"
            >
              {generatePathLoading ? "Generating..." : "Generate Path"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const ConceptAccordionItem = ({ concept }: { concept: ConceptScore }) => {
  const [isOpen, setIsOpen] = useState(false);

  const isFocusArea = concept.focus_area;
  const score = concept.score;

  const getScoreColor = () => {
    if (isFocusArea) return "text-red-500";
    if (score >= 70) return "text-brand-green";
    return "text-blue-500";
  };

  const getBgColor = () => {
    if (isFocusArea) return "bg-red-50 border-red-100";
    if (score >= 70) return "bg-brand-green/5 border-brand-green/20";
    return "bg-blue-50 border-blue-100";
  };

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full border border-brand-indigo/10 rounded-xl overflow-hidden hover:border-brand-indigo/20 transition-colors"
    >
      <CollapsibleTrigger className="flex w-full justify-between items-center p-4 bg-white hover:bg-brand-indigo/5 transition-colors">
        <span
          className="font-medium text-brand-indigo text-sm font-inter truncate pr-4 flex-1 text-left"
          title={concept.concept_name}
        >
          {concept.concept_name}
        </span>
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Focus indicator */}
          <span
            className={cn(
              "text-xs font-medium px-2 py-1 rounded-lg font-dm-sans",
              getBgColor()
            )}
          >
            {isFocusArea ? "Focus Area" : "Strong"}
          </span>
          {/* Score */}
          <span className={cn("text-sm font-semibold font-inter", getScoreColor())}>
            {score}%
          </span>
          {/* Chevron */}
          {isOpen ? (
            <ChevronUp className="h-4 w-4 text-brand-indigo/40" />
          ) : (
            <ChevronDown className="h-4 w-4 text-brand-indigo/40" />
          )}
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="p-4 bg-brand-indigo/5 border-t border-brand-indigo/10">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-brand-indigo/50 font-dm-sans">Score</span>
            <p className="font-semibold text-brand-indigo font-inter">{concept.score}%</p>
          </div>
          <div>
            <span className="text-brand-indigo/50 font-dm-sans">Questions</span>
            <p className="font-semibold text-brand-indigo font-inter">{concept.count}</p>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
