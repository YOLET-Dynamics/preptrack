"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  BookOpen,
  HelpCircle,
  Gauge,
  Loader2,
  AlertTriangle,
  FileText,
  ListChecks,
  CalendarDays,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { formatError } from "@/common/utils";
import { evaluationApi } from "@/api/evaluation";
import { useExamStore } from "@/store/examStore";
import { Exam } from "@/models/content/exam";
import useEvaluationStore from "@/store/evaluationStore";
import { contentApi } from "@/api/content";
import { profileApi } from "@/api/profile";

type ExamDetails = Exam & {
  subject?: string;
  total_questions?: number;
  difficulty?: string;
  topics?: { id: string; name: string }[];
  concepts?: { id: string; name: string }[];
};

export default function ExamDetailPage() {
  const router = useRouter();
  const params = useParams();
  const examId = params.id as string;
  const { setExamData } = useExamStore();
  const { setEvaluation } = useEvaluationStore();

  const {
    data: examData,
    isLoading: isLoadingExam,
    error: examError,
    refetch: refetchExam,
  } = useQuery<ExamDetails, Error>({
    queryKey: [contentApi.getExamData.name, examId],
    queryFn: () => contentApi.getExamData(examId, 1),
    enabled: !!examId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: prevEvaluation, isLoading: isLoadingEvaluation } = useQuery({
    queryKey: [profileApi.getExamEvaluation.name, examId, 1],
    queryFn: () =>
      profileApi.getExamEvaluation({
        examID: examId as string,
        pageNumber: 1,
      }),
    enabled: !!examId,
    staleTime: 5 * 60 * 1000,
  });

  const handleTakeExam = async () => {
    if (isLoadingExam) return;
    let currentExamData = examData;
    if (!currentExamData) {
      const result = await refetchExam();
      if (result.error || !result.data) {
        return;
      }
      currentExamData = result.data;
    }
    setExamData(currentExamData);
    router.push(`/dashboard/evaluation/${examId}`);
  };

  const handleViewResults = () => {
    if (!prevEvaluation) return;
    setEvaluation(prevEvaluation);
    router.push(`/dashboard/exam/result/${examId}`);
  };

  const isLoading = isLoadingExam || isLoadingEvaluation;

  if (isLoading && !examData) {
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (examError) {
    return (
      <div className="max-w-5xl mx-auto p-4 md:p-6 lg:p-8 space-y-6">
        <Button
          variant="outline"
          size="sm"
          className="mb-4"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error Loading Exam Details</AlertTitle>
          <AlertDescription>{formatError(examError as any)}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!examData) {
    // Handle case where exam data is not found after loading
    return (
      <div className="max-w-5xl mx-auto p-4 md:p-6 lg:p-8 space-y-6">
        <Button
          variant="outline"
          size="sm"
          className="mb-4"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Exam Not Found</AlertTitle>
          <AlertDescription>
            The requested exam could not be found.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9"
            onClick={() => router.back()}
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1
            className="text-2xl font-semibold tracking-tight line-clamp-1"
            title={examData.exam_info.title}
          >
            {examData.exam_info.title}
          </h1>
        </div>
        <Button
          size="lg"
          onClick={prevEvaluation ? handleViewResults : handleTakeExam}
          disabled={isLoading}
          className="w-full sm:w-auto shrink-0"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : prevEvaluation ? (
            "See Results"
          ) : (
            "Take Exam"
          )}
        </Button>
      </div>

      {/* Key Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Subject: {examData.subject || "N/A"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center pt-2">
            <InfoItem
              icon={BookOpen}
              label="Exam Title"
              value={examData.exam_info.title}
              iconColor="text-blue-500"
              bgColor="bg-blue-100 dark:bg-blue-900/30"
            />
            <InfoItem
              icon={HelpCircle}
              label="Questions"
              value={`${examData.total_questions || 0} Question${
                examData.total_questions !== 1 ? "s" : ""
              }`}
              iconColor="text-green-500"
              bgColor="bg-green-100 dark:bg-green-900/30"
            />
            <InfoItem
              icon={Gauge}
              label="Difficulty"
              value={examData.difficulty || "N/A"}
              iconColor="text-red-500"
              bgColor="bg-red-100 dark:bg-red-900/30"
            />
          </div>
        </CardContent>
      </Card>

      {examData.exam_info.description && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5" /> Description
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {examData.exam_info.description}
            </p>
          </CardContent>
        </Card>
      )}

      {(examData.topics?.length || examData.concepts?.length) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ListChecks className="h-5 w-5" /> Covered Content
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {examData.topics && examData.topics.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2 text-muted-foreground">
                  Units / Topics
                </h3>
                <div className="flex flex-wrap gap-2">
                  {examData.topics.map((topic) => (
                    <Badge key={topic.id} variant="secondary">
                      {topic.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {examData.concepts && examData.concepts.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2 text-muted-foreground">
                  Sub-units / Concepts
                </h3>
                <div className="flex flex-wrap gap-2">
                  {examData.concepts.map((concept) => (
                    <Badge key={concept.id} variant="outline">
                      {concept.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

const InfoItem = ({
  icon: Icon,
  label,
  value,
  iconColor,
  bgColor,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  iconColor: string;
  bgColor: string;
}) => (
  <div className="flex flex-col items-center space-y-2">
    <div className={cn("p-3 rounded-full", bgColor)}>
      <Icon className={cn("h-6 w-6", iconColor)} />
    </div>
    <span className="text-xs text-muted-foreground">{label}</span>
    <span className="text-sm font-medium text-foreground">{value}</span>
  </div>
);
