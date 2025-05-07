import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useExamStore, useExamAttemptStore, useExamInitStore } from "@/store/examStore"; // Assuming these are correctly located
import { evaluationApi } from "@/api/evaluation";
import useExamEvaluationStore from "@/store/examEvalStore"; // Assuming correct location
import { formatError } from "@/common/utils";

interface LoadingPerformanceProps {
  onError: () => void;
  examId: string;
}

export default function LoadingPerformance({
  onError,
  examId,
}: LoadingPerformanceProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  // const { examData } = useExamStore(); // examId is passed as prop now
  const { responses, resetResponses } = useExamAttemptStore();
  const { setExamEvaluation } = useExamEvaluationStore();
  const { isInit } = useExamInitStore(); // Assuming this store and state exist

  useEffect(() => {
    // Ensure examId and responses are available before proceeding
    if (!examId || !responses || responses.length === 0) {
      setError("Missing exam data or responses to submit.");
      // Optional: Automatically call onError after a delay or let the user click 'Try Again'
      // setTimeout(onError, 3000);
      return;
    }

    const request = {
      exam_id: examId,
      attempts: responses,
      is_init: isInit, // Include is_init from the store
    };

    const timer = setTimeout(() => {
      submitRequest(request);
    }, 1500); // Slight delay to show the loading animation

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examId]); // Depend only on examId to run once when the component mounts with the ID

  const submitRequest = async (request: any) => {
    try {
      setError(null);
      const response = await evaluationApi.evaluateExam(request);
      setExamEvaluation(response); // Store the evaluation results
      resetResponses(); // Clear the attempts from the store
      router.replace("/dashboard/track/performance"); // Navigate to the new performance page
    } catch (err: any) { // Catch specific error type if possible
      setError(
        formatError(err) ||
          "Something went wrong while analyzing your results. Please try again."
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100] flex items-center justify-center">
      <div className="bg-card p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
        {error ? (
          <div className="flex flex-col items-center justify-center">
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Button
              className="w-full"
              onClick={() => {
                setError(null);
                onError(); // Allow the parent component to handle retry/closing
              }}
            >
              Close
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-6" />
            <h2 className="text-xl font-semibold text-foreground mb-3">
              Analyzing Your Results
            </h2>
            <p className="text-muted-foreground">
              We're processing your answers to provide detailed performance
              insights. Please wait a moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
