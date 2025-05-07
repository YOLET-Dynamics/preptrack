"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ChevronRight,
  CheckSquare,
  Loader2,
  AlertTriangle,
  BookOpenCheck,
  ListChecks,
} from "lucide-react";
import { useStudyGuideSectionStore } from "@/store/studyGuideStore";
import { studyGuideApi } from "@/api/studyGuide";
import { cn } from "@/lib/utils";
import { StudyGuide, StudyGuideSection } from "@/models/studyguide/studyguide";
import { Card } from "@/components/ui/card";
import { formatError } from "@/common/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

const SectionCard = ({
  guideId,
  section,
  index,
}: {
  guideId: string;
  section: StudyGuideSection;
  index: number;
}) => {
  const router = useRouter();
  const { setSection } = useStudyGuideSectionStore();
  const totalLessons = section.lessons?.length || 0;
  const completionPercentage = parseFloat(section.completion) || 0;
  const isCompleted = completionPercentage === 100;

  const handleSectionClick = () => {
    setSection(section);
    router.push(`/dashboard/study-guides/section/${section.id}`);
  };

  return (
    <Card
      className={cn(
        "group relative transition-all duration-200 ease-in-out",
        "bg-transparent rounded-lg shadow-sm",
        "hover:shadow-xl hover:scale-[1.015] hover:border-primary",
        isCompleted
          ? "border border-neutral-600 border-l-4 border-l-green-500 dark:border-l-green-400"
          : "border border-cyan-500"
      )}
    >
      <button
        onClick={handleSectionClick}
        className="w-full p-4 flex items-center justify-between text-left"
        aria-label={`View section ${index + 1}: ${section.title}`}
      >
        <div className="flex items-center gap-4 flex-grow min-w-0">
          <div
            className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors",
              isCompleted
                ? "bg-green-600 group-hover:bg-green-700 text-white"
                : "bg-gradient-to-br from-cyan-700 to-cyan-900 group-hover:from-cyan-600 group-hover:to-cyan-800 text-white"
            )}
          >
            {isCompleted ? (
              <CheckSquare className="h-5 w-5" />
            ) : (
              <span className="text-lg font-medium">{index + 1}</span>
            )}
          </div>

          {/* Section Details */}
          <div className="flex-grow min-w-0">
            <h3
              className={cn(
                "font-medium text-foreground truncate transition-colors",
                isCompleted
                  ? "group-hover:text-green-700 dark:group-hover:text-green-300"
                  : "group-hover:text-primary"
              )}
            >
              {section.title}
            </h3>
            <div className="flex items-center text-xs text-muted-foreground space-x-2 mt-1">
              <div className="flex items-center">
                <ListChecks className="h-3 w-3 mr-1" />
                <span>
                  {totalLessons} {totalLessons === 1 ? "Lesson" : "Lessons"}
                </span>
              </div>
              {completionPercentage > 0 &&
                !isCompleted && ( // Show only if in progress
                  <>
                    <span className="mx-1 select-none">•</span>
                    <span className="text-primary/80">
                      {completionPercentage.toFixed(0)}% Complete
                    </span>
                  </>
                )}
              {isCompleted && (
                <>
                  <span className="mx-1 select-none">•</span>
                  <span className="text-green-600 dark:text-green-400 font-medium">
                    Completed
                  </span>
                </>
              )}
            </div>
            {/* Progress bar for in-progress sections */}
            {!isCompleted && completionPercentage > 0 && (
              <Progress
                value={completionPercentage}
                className="h-1 mt-1.5 bg-muted/70 [&>div]:bg-primary/70"
              />
            )}
          </div>
        </div>
        <ChevronRight
          className={cn(
            "h-5 w-5 text-muted-foreground flex-shrink-0 ml-4 transition-colors",
            isCompleted
              ? "group-hover:text-green-700 dark:group-hover:text-green-400"
              : "group-hover:text-primary"
          )}
        />
      </button>
    </Card>
  );
};

export default function StudyGuideDetailPage() {
  const router = useRouter();
  const params = useParams();
  const guideId = params.id as string;

  const {
    data: guide,
    isLoading,
    error,
  } = useQuery<StudyGuide, Error>({
    queryKey: [studyGuideApi.getStudyGuideByID.name, guideId],
    queryFn: () => studyGuideApi.getStudyGuideByID(guideId),
    enabled: !!guideId, // Ensure guideId is available
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
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
          onClick={() => router.push("/dashboard/study-guides")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Study Guides
        </Button>
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error Loading Study Guide</AlertTitle>
          <AlertDescription>{formatError(error as any)}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!guide) {
    return (
      <div className="container mx-auto max-w-4xl py-10 px-4">
        <Button
          variant="outline"
          size="sm"
          className="mb-4"
          onClick={() => router.push("/dashboard/study-guides")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Study Guides
        </Button>
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Study Guide Not Found</AlertTitle>
          <AlertDescription>
            The requested study guide could not be found. It might have been
            deleted or the ID is incorrect.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const completionPercentage = parseFloat(guide.completion) || 0;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="icon"
            className="h-6 w-6"
            onClick={() => router.back()}
            aria-label="Go back"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1
            className="text-xl md:text-2xl font-semibold tracking-tight line-clamp-1"
            title={guide.title}
          >
            {guide.title}
          </h1>
        </div>
      </div>

      <Card className="p-4 bg-card border border-border rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ease-in-out">
        {guide.description && (
          <p className="text-sm text-muted-foreground mb-3">
            {guide.description}
          </p>
        )}
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="text-muted-foreground">Overall Progress</span>
          <span
            className={cn(
              "font-medium",
              completionPercentage === 100
                ? "text-green-600 dark:text-green-400"
                : "text-foreground"
            )}
          >
            {completionPercentage.toFixed(0)}%
          </span>
        </div>
        <Progress
          value={completionPercentage}
          className="h-2 bg-muted [&>div]:bg-gradient-to-r [&>div]:from-cyan-500 [&>div]:to-blue-500"
        />
      </Card>

      {/* Sections List */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground tracking-tight">
          Sections
        </h2>
        {guide.sections && guide.sections.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {guide.sections.map((section, index) => (
              <SectionCard
                key={section.id}
                guideId={guide.id}
                section={section}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-muted-foreground border border-dashed border-border rounded-lg min-h-[150px] flex flex-col justify-center items-center">
            <BookOpenCheck className="h-8 w-8 mb-2 text-muted-foreground/50" />
            <p className="text-base mb-1">No Sections Found</p>
            <p className="text-xs">
              This study guide does not have any sections yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
