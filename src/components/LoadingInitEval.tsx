import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useUserSubjectStore } from "@/store/userSubject";
import { useContentReqStore } from "@/store/contentReqStore";
import { useExamIdStore, useExamInitStore } from "@/store/examStore";
import { profileApi } from "@/api/profile";
import { InitExamReq } from "@/models/profile/initExam";

interface LoadingInitEvalProps {
  onError: () => void;
}

export default function LoadingInitEval({ onError }: LoadingInitEvalProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const { userSubject } = useUserSubjectStore();
  const { content } = useContentReqStore();
  const { setExamId } = useExamIdStore();
  const { setIsInit } = useExamInitStore();

  useEffect(() => {
    if (!userSubject) {
      setError(
        "Subject information is missing. Please select a subject first."
      );
      return;
    }

    const request: InitExamReq = {
      subject_id: userSubject.id,
      content: content,
    };

    const timer = setTimeout(() => {
      submitRequest(request);
    }, 1000);

    return () => clearTimeout(timer);
  }, [userSubject, content]);

  const submitRequest = async (request: InitExamReq) => {
    setError(null);
    try {
      const response = await profileApi.initExam(request);
      setExamId(response.exam_id);
      setIsInit(true);
      router.push(`/app/exam/${response.exam_id}`);
    } catch (err) {
      setError(
        typeof err === "string"
          ? err
          : "Something went wrong while preparing your evaluation. Please try again."
      );
    }
  };

  if (error) {
    return (
      <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
        <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button
            className="w-full"
            onClick={() => {
              setError(null);
              onError();
            }}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg">
        <div className="flex flex-col items-center justify-center">
          <div className="relative">
            <div className="grid grid-cols-2 gap-2 animate-spin">
              <div className="h-5 w-5 rounded-full bg-primary" />
              <div className="h-5 w-5 rounded-full bg-yellow-500" />
              <div className="h-5 w-5 rounded-full bg-yellow-500" />
              <div className="h-5 w-5 rounded-full bg-primary" />
            </div>
          </div>

          <h2 className="mt-8 text-xl font-semibold text-primary">
            Preparing your initial evaluation
          </h2>

          <p className="mt-4 max-w-md text-center text-muted-foreground">
            We need to assess your current knowledge level to create a
            personalized learning path for you.
          </p>
        </div>
      </div>
    </div>
  );
}
