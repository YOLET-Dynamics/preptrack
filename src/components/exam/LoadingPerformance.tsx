import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useExamAttemptStore, useExamInitStore } from "@/store/examStore";
import { evaluationApi } from "@/api/evaluation";
import useExamEvaluationStore from "@/store/examEvalStore";
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

  const { responses, resetResponses } = useExamAttemptStore();
  const { setExamEvaluation } = useExamEvaluationStore();
  const { isInit } = useExamInitStore();

  useEffect(() => {
    if (!examId || !responses || responses.length === 0) {
      setError("Missing exam data or responses to submit.");
      return;
    }

    const request = {
      exam_id: examId,
      attempts: responses,
      is_init: isInit,
    };

    const timer = setTimeout(() => {
      submitRequest(request);
    }, 1500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examId]);

  const submitRequest = async (request: any) => {
    try {
      setError(null);
      const response = await evaluationApi.evaluateExam(request);
      setExamEvaluation(response);
      resetResponses();
      router.replace("/dashboard/track/performance");
    } catch (err: any) {
      setError(
        formatError(err) ||
          "Something went wrong while analyzing your results. Please try again."
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-[100] flex items-center justify-center">
      <div className="bg-white border border-brand-indigo/10 p-8 rounded-2xl shadow-xl max-w-md w-full mx-4">
        {error ? (
          <div className="flex flex-col items-center justify-center">
            <Alert variant="destructive" className="mb-4 bg-red-50 border-red-200 rounded-xl">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <AlertTitle className="text-red-700 font-inter">Error</AlertTitle>
              <AlertDescription className="text-red-600 font-dm-sans">{error}</AlertDescription>
            </Alert>
            <Button
              className="w-full bg-brand-indigo text-white hover:bg-brand-indigo/90 rounded-xl font-dm-sans"
              onClick={() => {
                setError(null);
                onError();
              }}
            >
              Close
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-brand-green/20 rounded-full blur-xl animate-pulse" />
              <Loader2 className="h-12 w-12 animate-spin text-brand-green relative z-10" />
            </div>
            <h2 className="text-xl font-semibold text-brand-indigo font-inter mb-3">
              Analyzing Your Results
            </h2>
            <p className="text-brand-indigo/60 font-dm-sans">
              We're processing your answers to provide detailed performance
              insights. Please wait a moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
