"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ChevronRight,
  Loader2,
  AlertTriangle,
  ClipboardList, // Icon for sections
  BookOpen, // Icon for exams or general test path
  ListChecks, // Icon for number of exams
  CheckSquare, // Icon for completed items
} from "lucide-react";
import { testPathApi } from "@/api/testPath";
import { cn } from "@/lib/utils";
import { TestPath, TestPathSection } from "@/models/testPath";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatError } from "@/common/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

import { ExamMinified } from "@/models/content/exam";

const ExamListItem = ({
  exam,
  testPathId,
}: {
  exam: ExamMinified;
  testPathId: string;
}) => {
  const router = useRouter();

  const handleExamClick = () => {
    router.push(`/dashboard/exam/${exam.id}`);
  };

  return (
    <button
      onClick={handleExamClick}
      className="w-full text-left p-3 hover:bg-muted/50 dark:hover:bg-muted/30 rounded-md transition-colors flex items-center justify-between group"
      aria-label={`View exam: ${exam.title}`}
    >
      <div className="flex items-center gap-3">
        <BookOpen className="h-4 w-4 text-primary/80 flex-shrink-0" />
        <span className="text-sm text-foreground group-hover:text-primary truncate">
          {exam.title}
        </span>
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary ml-2 flex-shrink-0" />
    </button>
  );
};

const TestPathSectionItem = ({
  section,
  testPathId,
  index,
}: {
  section: TestPathSection;
  testPathId: string;
  index: number;
}) => {
  const totalExams = section.exams?.length || 0;
  const completionPercentage = parseFloat(section.completion) || 0;
  const isCompleted = completionPercentage === 100;

  return (
    <Card
      className={cn(
        "group relative transition-all duration-200 ease-in-out",
        "bg-card rounded-lg shadow-sm border",
        isCompleted
          ? "border-green-500/50 dark:border-green-400/40"
          : "border-border/60 hover:border-primary/80"
      )}
    >
      <CardHeader className="p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={cn(
                "w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 text-white",
                isCompleted
                  ? "bg-green-600"
                  : "bg-gradient-to-br from-cyan-600 to-blue-600"
              )}
            >
              {isCompleted ? (
                <CheckSquare className="h-4 w-4" />
              ) : (
                <ClipboardList className="h-4 w-4" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <CardTitle
                className={cn(
                  "text-base font-medium text-foreground truncate",
                  isCompleted ? "text-green-700 dark:text-green-300" : ""
                )}
                title={section.title}
              >
                {section.title}
              </CardTitle>
              <div className="flex items-center text-xs text-muted-foreground space-x-2 mt-0.5">
                <div className="flex items-center">
                  <ListChecks className="h-3 w-3 mr-1" />
                  <span>
                    {totalExams} {totalExams === 1 ? "Exam" : "Exams"}
                  </span>
                </div>
                {completionPercentage > 0 && (
                  <>
                    <span className="mx-1 select-none">•</span>
                    <span
                      className={
                        isCompleted
                          ? "text-green-600 dark:text-green-400"
                          : "text-primary/90"
                      }
                    >
                      {completionPercentage.toFixed(0)}% Complete
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        {!isCompleted && completionPercentage > 0 && (
          <Progress
            value={completionPercentage}
            className="h-1 mt-2 bg-muted/70 [&>div]:bg-primary/70"
          />
        )}
        {isCompleted && (
          <Progress
            value={100}
            className="h-1 mt-2 bg-green-500/20 [&>div]:bg-green-500"
          />
        )}
      </CardHeader>
      {totalExams > 0 && (
        <CardContent className="p-2 pt-0">
          <div className="space-y-1 border-t border-border/60 pt-2">
            {section.exams.map((exam) => (
              <ExamListItem key={exam.id} exam={exam} testPathId={testPathId} />
            ))}
          </div>
        </CardContent>
      )}
      {totalExams === 0 && (
        <CardContent className="p-4 pt-0">
          <p className="text-xs text-muted-foreground text-center py-2">
            No exams in this section.
          </p>
        </CardContent>
      )}
    </Card>
  );
};

export default function TestPathDetailPage() {
  const router = useRouter();
  const params = useParams();
  const testPathId = params.id as string;

  const {
    data: testPath,
    isLoading,
    error,
  } = useQuery<TestPath, Error>({
    queryKey: [testPathApi.getTestPathByID.name, testPathId],
    queryFn: () => testPathApi.getTestPathByID(testPathId),
    enabled: !!testPathId,
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-var(--header-height,100px))] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto max-w-4xl py-10 px-4">
        <Button
          variant="outline"
          size="sm"
          className="mb-4"
          onClick={() => router.push("/dashboard/test-paths")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Assessments
        </Button>
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error Loading Assessment</AlertTitle>
          <AlertDescription>{formatError(error as any)}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!testPath) {
    return (
      <div className="container mx-auto max-w-4xl py-10 px-4">
        <Button
          variant="outline"
          size="sm"
          className="mb-4"
          onClick={() => router.push("/dashboard/test-paths")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Assessments
        </Button>
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Assessment Not Found</AlertTitle>
          <AlertDescription>
            The requested assessment could not be found. It might have been
            deleted or the ID is incorrect.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const overallCompletionPercentage = parseFloat(testPath.completion) || 0;

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 flex-shrink-0"
            onClick={() => router.back()}
            aria-label="Go back"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1
            className="text-xl md:text-2xl font-semibold tracking-tight line-clamp-2"
            title={testPath.title}
          >
            {testPath.title}
          </h1>
        </div>
        {/* Future actions like 'Upgrade Path' could go here */}
      </div>

      <Card className="bg-card border border-border/60 rounded-lg shadow">
        <CardContent className="p-4">
          {/* <p className="text-sm text-muted-foreground mb-3">
            {testPath.description || "Review your progress and continue your learning journey."} 
          </p> // TestPath model doesn't have description currently */}
          <div className="flex items-center justify-between text-sm mb-1.5">
            <span className="text-muted-foreground">Overall Progress</span>
            <span
              className={cn(
                "font-medium",
                overallCompletionPercentage === 100
                  ? "text-green-600 dark:text-green-400"
                  : "text-foreground"
              )}
            >
              {overallCompletionPercentage.toFixed(0)}%
            </span>
          </div>
          <Progress
            value={overallCompletionPercentage}
            className="h-2 bg-muted [&>div]:bg-gradient-to-r [&>div]:from-cyan-500 [&>div]:to-blue-500"
            aria-label={`Overall progress: ${overallCompletionPercentage.toFixed(
              0
            )}%`}
          />
        </CardContent>
      </Card>

      {/* Sections List */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground tracking-tight">
          Sections ({testPath.sections?.length || 0})
        </h2>
        {testPath.sections && testPath.sections.length > 0 ? (
          <div className="space-y-3">
            {testPath.sections.map((section, index) => (
              <TestPathSectionItem
                key={section.id}
                section={section}
                testPathId={testPath.id}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-muted-foreground border border-dashed border-border rounded-lg min-h-[150px] flex flex-col justify-center items-center bg-card">
            <ClipboardList className="h-8 w-8 mb-2 text-muted-foreground/50" />
            <p className="text-base mb-1">No Sections Found</p>
            <p className="text-xs">
              This assessment does not have any sections configured yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
