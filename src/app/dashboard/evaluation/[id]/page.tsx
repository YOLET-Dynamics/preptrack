"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { contentApi } from "@/api/content";
import { useExamStore, useExamAttemptStore } from "@/store/examStore";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { X, ArrowRight, BookOpen, AlertTriangle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import LoadingPerformance from "@/components/exam/LoadingPerformance";
import ResourceModal from "@/components/exam/ResourceModal";
import { formatError } from "@/common/utils";
import { AnswerMinified, QuestionMinified } from "@/models/content/question";

interface ExamProgress {
  currentQuestionIndex: number;
  currentQuestionNumber: number;
  pageNumber: number;
}

interface TimerState {
  startTime: number;
  key: number;
}

interface UserInteraction {
  selectedAnswerId: string | null;
  isAnswerSubmitted: boolean;
}

const CORRECT_MESSAGES = [
  "Excellent work! 🌟",
  "You're crushing it! 💪",
  "Perfect answer! 🎯",
  "Outstanding! 🏆",
  "Keep up the great work! ⭐",
  "You're on fire! 🔥",
];

const INCORRECT_MESSAGES = [
  "Keep going! You're learning! 📚",
  "Don't give up! You've got this! 💪",
  "Mistakes help us learn! 🌱",
  "Stay positive! Next one's yours! ⭐",
  "Every attempt makes you stronger! 💡",
  "You're making progress! 🎯",
];

const getDifficultyBadgeClasses = (difficulty: string | undefined): string => {
  const lowerDifficulty = difficulty?.toLowerCase() || "";
  if (lowerDifficulty.startsWith("easy")) {
    return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200 border-green-300 dark:border-green-700";
  }
  if (lowerDifficulty.startsWith("med")) {
    return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200 border-yellow-300 dark:border-yellow-700";
  }
  if (
    lowerDifficulty.startsWith("hard") ||
    lowerDifficulty.startsWith("expert")
  ) {
    return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200 border-red-300 dark:border-red-700";
  }

  return "bg-gray-100 text-gray-800 dark:bg-gray-700/30 dark:text-gray-200 border-gray-300 dark:border-gray-600";
};

const getRandomMessage = (messages: string[]) => {
  return messages[Math.floor(Math.random() * messages.length)];
};

export default function EvaluationPage() {
  const router = useRouter();
  const params = useParams();
  const examId = params.id as string;

  const {
    examData,
    setExamData,
    isLoading: isLoadingStore,
    setIsLoading: setIsLoadingStore,
  } = useExamStore();
  const { addResponse, resetResponses, responses } = useExamAttemptStore();

  const [error, setError] = useState<string | null>(null);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showResources, setShowResources] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // For final submission loading
  const [showLoadingPerformance, setShowLoadingPerformance] = useState(false);

  const [examProgress, setExamProgress] = useState<ExamProgress>({
    currentQuestionIndex: 0,
    currentQuestionNumber: 1,
    pageNumber: 1,
  });

  const [timerState, setTimerState] = useState<TimerState>({
    startTime: Date.now(),
    key: 0,
  });

  const [userInteraction, setUserInteraction] = useState<UserInteraction>({
    selectedAnswerId: null,
    isAnswerSubmitted: false,
  });

  useEffect(() => {
    const loadInitialData = async () => {
      if (!examData && examId) {
        console.log("No exam data found in store, fetching...");
        setIsLoadingStore(true);
        setError(null);
        try {
          const data = await contentApi.getExamData(examId, 1);
          setExamData(data);
          setExamProgress({
            currentQuestionIndex: 0,
            currentQuestionNumber: 1,
            pageNumber: 1,
          });
          resetResponses(); // Ensure responses are clear on fresh load
        } catch (err: any) {
          console.error("Failed to fetch initial exam data:", err);
          setError(formatError(err) || "Failed to load exam. Please go back.");
          toast.error("Failed to load exam data");
        } finally {
          setIsLoadingStore(false);
        }
      } else if (examData && examData.exam_info.id !== examId) {
        // If store has data for a *different* exam, clear it and fetch
        console.log("Exam ID mismatch, resetting and fetching...");
        resetResponses();
        // Let the !examData condition trigger the fetch in the next render cycle
      }
    };

    loadInitialData();
    // Only run on mount or when examId changes
  }, [examId, examData, setExamData, setIsLoadingStore, resetResponses]);

  // Prevent accidental navigation/closing
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue =
        "Are you sure you want to leave? Your progress will be lost.";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // Simple visibility change warning (less strict than reference)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        toast.warning("Switching tabs might affect your exam session.", {
          duration: 5000,
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const currentQuestion = useMemo((): QuestionMinified | undefined => {
    if (!examData || !examData.questions) return undefined;
    return examData.questions[examProgress.currentQuestionIndex];
  }, [examData?.questions, examProgress.currentQuestionIndex]);

  const totalQuestions = useMemo(
    () => examData?.exam_info.total_questions ?? 0,
    [examData?.exam_info.total_questions]
  );

  const progressPercent = useMemo(() => {
    if (!totalQuestions) return 0;
    // Progress based on starting the current question number
    return ((examProgress.currentQuestionNumber - 1) / totalQuestions) * 100;
  }, [examProgress.currentQuestionNumber, totalQuestions]);

  const isLastQuestionOnPage = useMemo(() => {
    return (
      examProgress.currentQuestionIndex ===
      (examData?.questions?.length ?? 0) - 1
    );
  }, [examProgress.currentQuestionIndex, examData?.questions?.length]);

  const isLastQuestionOverall = useMemo(() => {
    return examProgress.currentQuestionNumber === totalQuestions;
  }, [examProgress.currentQuestionNumber, totalQuestions]);

  const handleAnswerSelect = useCallback(
    (answerId: string) => {
      if (userInteraction.isAnswerSubmitted) return;

      setUserInteraction((prev) => ({ ...prev, selectedAnswerId: answerId }));

      // Show feedback immediately after selection
      const isCorrect = answerId === currentQuestion?.answer.id;
      toast(
        getRandomMessage(isCorrect ? CORRECT_MESSAGES : INCORRECT_MESSAGES),
        {
          // Sonner uses first arg as message, second as options
          description: isCorrect ? "Correct!" : "Incorrect",
          duration: 3000,
          classNames: {
            toast: isCorrect
              ? "border-green-500 bg-green-50 dark:bg-green-900/30 dark:border-green-700"
              : "border-orange-500 bg-orange-50 dark:bg-orange-900/30 dark:border-orange-700",
            title: isCorrect
              ? "text-green-700 dark:text-green-300"
              : "text-orange-700 dark:text-orange-300",
            description: isCorrect
              ? "text-green-600 dark:text-green-400"
              : "text-orange-600 dark:text-orange-400",
          },
        }
      );

      // Mark answer as submitted to show feedback styles and enable next button
      setUserInteraction((prev) => ({ ...prev, isAnswerSubmitted: true }));
      setShowFeedback(true); // Still using this state for button logic/timer pausing
    },
    [userInteraction.isAnswerSubmitted, currentQuestion?.answer.id]
  );

  const handleFetchMoreQuestions = useCallback(
    async (page: number) => {
      if (!examId) return;
      console.log(`Fetching page ${page} for exam ${examId}`);
      setIsLoadingStore(true);
      setError(null);
      try {
        const nextPageData = await contentApi.getExamData(examId, page);
        setExamData({
          exam_info: examData!.exam_info, // Keep original exam info
          questions: nextPageData.questions,
          concepts: examData!.concepts,
          topics: examData!.topics,
        });
        setExamProgress((prev) => ({
          ...prev,
          currentQuestionIndex: 0, // Reset index for the new page
          pageNumber: page,
        }));
      } catch (err: any) {
        // Catch specific error type if possible
        console.error(`Failed to fetch page ${page}:`, err);
        setError(formatError(err) || "Failed to fetch next set of questions.");
        toast.error("Error loading questions");
        // Potentially allow retry or exit?
      } finally {
        setIsLoadingStore(false);
      }
    },
    [examId, setIsLoadingStore, setExamData, examData]
  );

  const submitAttempt = useCallback(() => {
    if (!userInteraction.selectedAnswerId || !currentQuestion) return;

    const timeTaken = Math.ceil((Date.now() - timerState.startTime) / 1000);
    addResponse({
      answer_id: userInteraction.selectedAnswerId,
      question_id: currentQuestion.id,
      time_taken: timeTaken,
    });
  }, [
    userInteraction.selectedAnswerId,
    currentQuestion,
    timerState.startTime,
    addResponse,
  ]);

  const handleNext = useCallback(() => {
    if (!userInteraction.isAnswerSubmitted) return;

    submitAttempt();

    // Reset for next question
    setShowFeedback(false);
    setUserInteraction({ selectedAnswerId: null, isAnswerSubmitted: false });
    setTimerState((prev) => ({
      startTime: Date.now(),
      key: prev.key + 1,
    }));

    if (!isLastQuestionOverall) {
      if (!isLastQuestionOnPage) {
        // Move to next question on the same page
        setExamProgress((prev) => ({
          ...prev,
          currentQuestionIndex: prev.currentQuestionIndex + 1,
          currentQuestionNumber: prev.currentQuestionNumber + 1,
        }));
      } else {
        // Need to fetch next page
        const nextPage = examProgress.pageNumber + 1;
        setExamProgress((prev) => ({
          ...prev,
          // Index and page number updated by handleFetchMoreQuestions success
          currentQuestionNumber: prev.currentQuestionNumber + 1,
        }));
        handleFetchMoreQuestions(nextPage);
      }
    } else {
      setIsSubmitting(true);
      setShowLoadingPerformance(true);
    }
  }, [
    userInteraction.isAnswerSubmitted,
    submitAttempt,
    isLastQuestionOverall,
    isLastQuestionOnPage,
    examProgress.pageNumber,
    handleFetchMoreQuestions,
  ]);

  // Handle timer completion
  const onTimerComplete = useCallback(() => {
    if (!showFeedback) {
      toast.warning("Time's up for this question!");
      handleNext();
    }
  }, [showFeedback, handleNext]);

  const handleExit = useCallback(() => {
    setShowExitDialog(true);
  }, []);

  const confirmExit = useCallback(() => {
    resetResponses();

    router.back(); // Go back to the previous page (likely exam details)
  }, [router, resetResponses, setExamData]);

  const shuffledChoices = useMemo((): AnswerMinified[] => {
    if (!currentQuestion) return [];

    const choices = currentQuestion.choices || [];
    const answer = currentQuestion.answer;
    const allChoices = [...choices];
    if (answer && !choices.some((c) => c.id === answer.id)) {
      allChoices.push(answer);
    }

    // Fisher-Yates shuffle
    for (let i = allChoices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allChoices[i], allChoices[j]] = [allChoices[j], allChoices[i]];
    }
    return allChoices;
  }, [currentQuestion]);

  // ---- Render Logic ----

  if (isLoadingStore && !examData) {
    // Initial loading state
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    // Critical error state
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8 space-y-6 flex flex-col items-center">
        <Alert variant="destructive" className="w-full">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error Loading Exam</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button variant="outline" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  if (!examData || !currentQuestion) {
    // Should not happen if loading/error states are correct, but acts as a fallback
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8 space-y-6 flex flex-col items-center">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Exam Data Missing</AlertTitle>
          <AlertDescription>
            Could not load exam questions. Please try again later.
          </AlertDescription>
        </Alert>
        <Button variant="outline" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  // Main exam UI
  return (
    <>
      {showLoadingPerformance && (
        <LoadingPerformance
          examId={examId} // Pass examId to the loading component
          onError={() => {
            // Handle error during performance submission
            toast.error(
              "Failed to submit results. Please check your connection."
            );
            setShowLoadingPerformance(false);
            setIsSubmitting(false);
            // Potentially allow user to retry submission from here
          }}
        />
      )}

      <div className="min-h-screen bg-background py-6 sm:py-8 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1
              className="text-xl sm:text-2xl font-semibold text-foreground truncate pr-4"
              title={examData.exam_info.title}
            >
              {examData.exam_info.title}
            </h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleExit}
              aria-label="Exit Exam"
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Progress Bar & Info */}
          <div className="mb-6 sm:mb-8 space-y-3">
            <Progress value={progressPercent} className="w-full h-2" />
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <div className="flex items-center gap-2 flex-wrap">
                <span>
                  Question {examProgress.currentQuestionNumber} of{" "}
                  {totalQuestions}
                </span>
                <Badge
                  variant="outline"
                  className={cn(
                    "px-2.5 py-0.5",
                    getDifficultyBadgeClasses(currentQuestion.difficulty)
                  )}
                >
                  {currentQuestion.difficulty || "N/A"}
                </Badge>
                {currentQuestion.concept && (
                  <Badge
                    variant="outline"
                    className={cn(
                      "px-2.5 py-0.5",
                      "border-teal-300 text-teal-800 dark:border-teal-600 dark:text-teal-300 bg-teal-50 dark:bg-teal-900/30"
                    )}
                  >
                    {currentQuestion.concept}
                  </Badge>
                )}
              </div>
              <CountdownCircleTimer
                key={timerState.key}
                isPlaying={!showFeedback && !isLoadingStore} // Pause timer when feedback shown or loading new questions
                duration={
                  // Use average completion time, default to 120s, minimum 30s
                  Math.max(
                    30,
                    Number(currentQuestion?.avg_completion_time) * 1.5 || 120
                  )
                }
                colors={["#16a34a", "#facc15", "#ef4444"]} // Green, Yellow, Red
                colorsTime={[
                  Math.max(
                    30,
                    Number(currentQuestion?.avg_completion_time) * 1.5 || 120
                  ) * 0.6, // 60% time
                  Math.max(
                    30,
                    Number(currentQuestion?.avg_completion_time) * 1.5 || 120
                  ) * 0.3, // 30% time
                  0,
                ]} // Adjusted color timings
                size={40}
                strokeWidth={3}
                onComplete={onTimerComplete}
              >
                {({ remainingTime }) => (
                  <span className="text-xs font-medium text-foreground">
                    {remainingTime}
                  </span>
                )}
              </CountdownCircleTimer>
            </div>
          </div>

          {/* Loading indicator for fetching next page */}
          {isLoadingStore && (
            <div className="flex justify-center items-center my-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-3 text-muted-foreground">
                Loading next question...
              </span>
            </div>
          )}

          {/* Question Card - Hide if loading next page */}
          {!isLoadingStore && (
            <div className="bg-card rounded-lg border shadow-sm p-6 sm:p-8 mb-6 sm:mb-8">
              {/* Question Number and Text Container */}
              <div className="flex items-start gap-3 sm:gap-4 mb-8">
                {" "}
                {/* Use flex to align number and text */}
                {/* Rounded Question Number */}
                <div className="bg-cyan-400 flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 text-primary-foreground rounded-full flex items-center justify-center text-sm sm:text-base font-semibold">
                  {examProgress.currentQuestionNumber}
                </div>
                {/* Question Text */}
                <p className="flex-grow text-lg sm:text-xl font-semibold text-foreground">
                  {currentQuestion.value}
                </p>
              </div>

              {/* Answer Choices */}
              <div className="space-y-4">
                {" "}
                {/* Increased spacing between choices */}
                {shuffledChoices.map((choice) => {
                  const isSelected =
                    userInteraction.selectedAnswerId === choice.id;
                  const isCorrect = choice.id === currentQuestion.answer.id;
                  const isIncorrectSelected = isSelected && !isCorrect;

                  return (
                    <Button
                      key={choice.id}
                      variant="outline"
                      onClick={() => handleAnswerSelect(choice.id)}
                      disabled={showFeedback} // Disable after any answer is submitted
                      className={cn(
                        "w-full h-auto justify-start text-left py-3.5 px-5 whitespace-normal text-sm sm:text-base",
                        "border-border hover:border-primary/70 hover:bg-muted dark:hover:bg-primary/5 transition-all duration-150 ease-in-out",
                        showFeedback && isCorrect
                          ? "border-green-500 bg-green-100 text-green-900 dark:bg-green-700/30 dark:text-green-200 dark:border-green-600 hover:bg-green-100 dark:hover:bg-green-700/40 ring-2 ring-green-500/50"
                          : showFeedback && isIncorrectSelected
                          ? "border-red-500 bg-red-100 text-red-900 dark:bg-red-700/30 dark:text-red-200 dark:border-red-600 hover:bg-red-100 dark:hover:bg-red-700/40 ring-2 ring-red-500/50"
                          : isSelected && !showFeedback // Selected but not yet submitted
                          ? "border-primary bg-primary/10 ring-2 ring-primary dark:bg-primary/20 dark:border-primary-foreground/80"
                          : "text-foreground hover:text-primary",
                        showFeedback ? "cursor-not-allowed" : "cursor-pointer" // Cursor indication
                      )}
                    >
                      {choice.value}
                    </Button>
                  );
                })}
              </div>

              {/* Next/Finish Button - Show only after feedback is visible */}
              {showFeedback && (
                <Button
                  onClick={handleNext}
                  disabled={isLoadingStore || isSubmitting} // Disable while loading next page or submitting final
                  className="mt-6 w-full"
                  size="lg"
                >
                  {isLoadingStore || isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  {isLastQuestionOverall ? "Finish Exam" : "Next Question"}
                </Button>
              )}

              {/* Resources Button */}
              {currentQuestion.resources &&
                currentQuestion.resources.length > 0 && (
                  <Button
                    variant="secondary"
                    onClick={() => setShowResources(true)}
                    className="mt-4 w-full flex items-center justify-center"
                    disabled={showFeedback} // Optionally disable when feedback is shown
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    View Resources
                  </Button>
                )}
            </div>
          )}

          {/* Resource Modal */}
          <ResourceModal
            visible={showResources}
            onClose={() => setShowResources(false)}
            resources={currentQuestion.resources}
          />
        </div>

        {/* Exit Confirmation Dialog */}
        <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure you want to exit?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Your progress will be lost if you leave the exam.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmExit}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Exit Exam
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
}
