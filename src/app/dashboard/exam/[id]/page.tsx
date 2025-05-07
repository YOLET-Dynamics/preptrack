"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  GraduationCap,
  CheckSquare,
  Atom,
  Timer,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { formatError } from "@/common/utils";
import { useExamStore } from "@/store/examStore";
import { Exam } from "@/models/content/exam";
import { contentApi } from "@/api/content";

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

  const handleTakeExam = async () => {
    if (isLoadingExam) return;
    let currentExamData = examData;
    if (!currentExamData) {
      const result = await refetchExam();
      if (result.error || !result.data) {
        console.error("Failed to refetch exam data before starting exam.");
        return;
      }
      currentExamData = result.data;
    }
    if (currentExamData) {
      setExamData(currentExamData);
      router.push(`/dashboard/evaluation/${examId}`);
    } else {
      console.error("Exam data is still missing after refetch.");
    }
  };

  const isLoading = isLoadingExam;

  if (isLoading && !examData) {
    return (
      <div className="flex h-[calc(100vh-var(--header-height,100px))] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (examError) {
    return (
      <div className="container mx-auto max-w-4xl p-4 md:p-6 lg:p-8">
        <Button
          variant="outline"
          size="sm"
          className="mb-6"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Alert variant="destructive" className="flex items-center">
          <AlertTriangle className="h-5 w-5 mr-3 flex-shrink-0" />
          <div>
            <AlertTitle>Error Loading Exam Details</AlertTitle>
            <AlertDescription>{formatError(examError as any)}</AlertDescription>
          </div>
        </Alert>
      </div>
    );
  }

  if (!examData) {
    return (
      <div className="container mx-auto max-w-4xl p-4 md:p-6 lg:p-8">
        <Button
          variant="outline"
          size="sm"
          className="mb-6"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Alert className="flex items-center">
          <AlertTriangle className="h-5 w-5 mr-3 flex-shrink-0" />
          <div>
            <AlertTitle>Exam Not Found</AlertTitle>
            <AlertDescription>
              The requested exam could not be found or loaded. Please try again
              or go back.
            </AlertDescription>
          </div>
        </Alert>
      </div>
    );
  }

  const { exam_info, topics, concepts } = examData;

  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3 min-w-0">
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
            <h1
              className="text-2xl font-semibold tracking-tight truncate"
              title={exam_info.title}
            >
              {exam_info.title}
            </h1>
            {exam_info.subject && (
              <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                <GraduationCap className="h-4 w-4" />
                {exam_info.subject}
              </p>
            )}
          </div>
        </div>
        <Button
          size="lg"
          onClick={handleTakeExam}
          disabled={isLoading}
          className="w-full sm:w-auto shrink-0 transition-all duration-300 ease-in-out hover:scale-105"
          aria-label={`Take exam: ${exam_info.title}`}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <BookOpen className="mr-2 h-5 w-5" />
          )}
          Take Exam
        </Button>
      </div>

      <Card className="border-border/60 shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-center">
            <InfoItem
              icon={HelpCircle}
              label="Questions"
              value={`${exam_info.total_questions || 0}`}
              iconColor="text-blue-600 dark:text-blue-400"
              bgColor="bg-blue-100 dark:bg-blue-900/30"
              description={`Total questions in the exam`}
            />
            <InfoItem
              icon={Gauge}
              label="Difficulty"
              value={exam_info.difficulty || "N/A"}
              iconColor="text-orange-600 dark:text-orange-400"
              bgColor="bg-orange-100 dark:bg-orange-900/30"
              description={`Estimated difficulty level`}
            />
          </div>
        </CardContent>
      </Card>

      {exam_info.description && (
        <Card className="border-border/60 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" /> Description
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {exam_info.description}
            </p>
          </CardContent>
        </Card>
      )}

      {(topics?.length || concepts?.length) && (
        <Card className="border-border/60 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <ListChecks className="h-5 w-5 text-primary" /> Covered Content
            </CardTitle>
            <CardDescription>
              Topics and concepts included in this exam.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 pt-2">
            {topics && topics.length > 0 && (
              <div>
                <h3 className="text-base font-medium mb-3 flex items-center gap-1.5 text-foreground">
                  <CheckSquare className="h-4 w-4 text-indigo-500" />
                  Units / Topics ({topics.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {topics.map((topic) => (
                    <Badge
                      key={topic.id}
                      variant="secondary"
                      className="text-sm px-2.5 py-0.5 bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-200 border-indigo-200 dark:border-indigo-700"
                    >
                      {topic.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {concepts && concepts.length > 0 && (
              <div>
                <h3 className="text-base font-medium mb-3 flex items-center gap-1.5 text-foreground">
                  <Atom className="h-4 w-4 text-teal-500" />
                  Sub-units / Concepts ({concepts.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {concepts.map((concept) => (
                    <Badge
                      key={concept.id}
                      variant="outline"
                      className="text-sm px-2.5 py-0.5 border-teal-300 text-teal-800 dark:border-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-900/30"
                    >
                      {concept.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {!topics?.length && !concepts?.length && (
              <p className="text-sm text-muted-foreground">
                No specific topics or concepts listed for this exam.
              </p>
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
  description,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  iconColor: string;
  bgColor: string;
  description?: string;
}) => (
  <div
    className="flex flex-col items-center space-y-1.5 p-4 rounded-lg bg-background dark:bg-muted/30 border border-border/50"
    title={description}
  >
    <div className={cn("p-2.5 rounded-full", bgColor)}>
      <Icon className={cn("h-5 w-5", iconColor)} />
    </div>
    <span className="text-sm font-medium text-foreground pt-1">{value}</span>
    <span className="text-xs text-muted-foreground">{label}</span>
  </div>
);
