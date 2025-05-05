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
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

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
    // Navigate to the lesson list page for this section
    // Assuming the route will be /dashboard/study-guides/[guideId]/section/[sectionId]
    router.push(`/dashboard/study-guides/${guideId}/section/${section.id}`);
  };

  return (
    <Card
      className={cn(
        "overflow-hidden transition-shadow hover:shadow-md",
        isCompleted
          ? "bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800/50"
          : "bg-card border-border"
      )}
    >
      <button
        onClick={handleSectionClick}
        className="w-full p-4 flex items-center justify-between text-left group"
        aria-label={`View section ${index + 1}: ${section.title}`}
      >
        <div className="flex items-center gap-4 flex-grow min-w-0">
          {/* Index/Completion Icon */}
          <div
            className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
              isCompleted
                ? "bg-green-600 text-white"
                : "bg-primary/10 text-primary"
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
            <h3 className="font-medium text-foreground truncate group-hover:text-primary">
              {section.title}
            </h3>
            <div className="flex items-center text-xs text-muted-foreground space-x-2 mt-1">
              <div className="flex items-center">
                <ListChecks className="h-3 w-3 mr-1" />
                <span>
                  {totalLessons} {totalLessons === 1 ? "Lesson" : "Lessons"}
                </span>
              </div>
              {completionPercentage > 0 && (
                <div className="flex items-center">
                  <span className="mx-1">•</span>
                  <span
                    className={cn(
                      isCompleted
                        ? "text-green-600 dark:text-green-400"
                        : "text-muted-foreground"
                    )}
                  >
                    {completionPercentage.toFixed(0)}% Complete
                  </span>
                </div>
              )}
            </div>
            {/* Optional: Add progress bar */}
            {/* <Progress value={completionPercentage} className="h-1 mt-1.5" /> */}
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0 ml-4 group-hover:text-primary" />
      </button>
    </Card>
  );
};

export default function StudyGuideDetailPage() {
  const router = useRouter();
  const params = useParams();
  const guideId = params.id as string;

  // Use useQuery to fetch study guide details
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
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => router.back()} // Use router.back() for simple back navigation
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
        {/* Optional: Add other actions like Edit, Delete, etc. here */}
      </div>

      {/* Description & Overall Progress */}
      <Card className="p-4 bg-card border border-border">
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
        <Progress value={completionPercentage} className="h-2" />
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
