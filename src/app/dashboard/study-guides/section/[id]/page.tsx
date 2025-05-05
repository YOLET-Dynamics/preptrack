"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  ChevronRight,
  BookOpen,
  CheckCircle2,
  Loader2,
  AlertTriangle,
  FileText,
  HelpCircle,
} from "lucide-react";
import { useStudyGuideSectionStore } from "@/store/studyGuideStore";
import { useExamIdStore, useExamInitStore } from "@/store/examStore";
import { studyGuideApi } from "@/api/studyGuide";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { formatError } from "@/common/utils";
import { Lesson } from "@/models/studyguide/studyguide";
import { Skeleton } from "@/components/ui/skeleton";
import rehypeRaw from "rehype-raw";

const LessonListItem = ({
  lesson,
  isSelected,
  isLoadingContent,
  onClick,
}: {
  lesson: Lesson;
  isSelected: boolean;
  isLoadingContent: boolean;
  onClick: () => void;
}) => {
  const Icon = lesson.completed ? CheckCircle2 : BookOpen;
  const iconColor = lesson.completed
    ? "text-green-600 dark:text-green-500"
    : "text-muted-foreground";

  return (
    <button
      onClick={onClick}
      className={cn(
        `w-full flex items-center gap-3 p-3 rounded-md text-left transition-colors duration-150`,
        isSelected
          ? "bg-primary/10 dark:bg-primary/20"
          : "hover:bg-muted/50 dark:hover:bg-muted/30",
        lesson.completed && !isSelected ? "opacity-70" : ""
      )}
      aria-current={isSelected ? "page" : undefined}
    >
      <Icon className={cn("h-5 w-5 flex-shrink-0", iconColor)} />
      <span
        className={cn(
          "flex-grow text-sm font-medium truncate",
          isSelected ? "text-primary" : "text-foreground"
        )}
      >
        {lesson.title}
      </span>
      {isLoadingContent && isSelected ? (
        <Loader2 className="h-4 w-4 animate-spin text-primary ml-auto flex-shrink-0" />
      ) : (
        !lesson.completed && (
          <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
        )
      )}
    </button>
  );
};

const LessonContentViewer = ({
  sectionId,
  selectedLessonId,
}: {
  sectionId: string;
  selectedLessonId: string | null;
}) => {
  const router = useRouter();
  const { setExamId } = useExamIdStore();
  const { setIsInit } = useExamInitStore();

  const {
    data: lessonContent,
    isLoading: isLoadingLessonContent,
    error: lessonContentError,
    isFetching: isFetchingLessonContent,
  } = useQuery({
    queryKey: [
      studyGuideApi.getLessonContent.name,
      selectedLessonId,
      sectionId,
    ],
    queryFn: () =>
      studyGuideApi.getLessonContent(selectedLessonId!, sectionId!),
    enabled: !!selectedLessonId && !!sectionId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const handleTakeLessonExam = () => {
    if (lessonContent?.exam?.id) {
      setExamId(lessonContent.exam.id);
      setIsInit(false); // Assuming this means start a new attempt
      router.push(`/dashboard/exam/${lessonContent.exam.id}`); // Adjusted path
    }
  };

  if (!selectedLessonId) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8 text-muted-foreground">
        <FileText className="h-12 w-12 mb-4 opacity-50" />
        <p className="text-lg font-medium">Select a lesson</p>
        <p className="text-sm">
          Choose a lesson from the list to view its content.
        </p>
      </div>
    );
  }

  if (isLoadingLessonContent) {
    // Initial loading skeleton
    return (
      <div className="p-6 lg:p-8 space-y-6">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    );
  }

  if (lessonContentError) {
    return (
      <div className="p-6 lg:p-8">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error Loading Lesson Content</AlertTitle>
          <AlertDescription>
            {formatError(lessonContentError as any)}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!lessonContent) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground p-8">
        Lesson content not available.
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 relative">
      {isFetchingLessonContent && !isLoadingLessonContent && (
        <div className="absolute top-4 right-4">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground/50" />
        </div>
      )}
      <div className="flex items-start justify-between gap-4 mb-6">
        <h2 className="text-xl lg:text-2xl font-semibold text-foreground flex-1">
          {lessonContent.title}
        </h2>
        {lessonContent.exam?.id && (
          <Button
            size="sm"
            onClick={handleTakeLessonExam}
            variant="outline"
            className="shrink-0"
          >
            <HelpCircle className="h-4 w-4 mr-2" />
            Take Lesson Quiz
          </Button>
        )}
      </div>
      <article className="prose prose-slate dark:prose-invert max-w-none prose-p:leading-relaxed prose-a:text-primary hover:prose-a:text-primary/80 prose-img:rounded-md prose-img:border prose-img:border-border">
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
          {lessonContent.content}
        </ReactMarkdown>
      </article>

      {lessonContent.resources && lessonContent.resources.length > 0 && (
        <div className="mt-10 pt-6 border-t border-border">
          <h3 className="text-lg font-semibold mb-4 text-foreground">
            Additional Resources
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {lessonContent.resources.map((resource) => (
              <a
                key={resource.id}
                href={resource.resource_url} // Assuming it's a link or image source
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-lg overflow-hidden border border-border aspect-video relative group bg-muted hover:shadow-md transition-shadow"
              >
                {/* Basic image display, consider adding specific handlers for different resource types */}
                <img
                  src={resource.resource_url}
                  alt={`Resource for ${lessonContent.title}`}
                  className="absolute inset-0 w-full h-full object-cover" // Use object-cover for better fitting
                  loading="lazy"
                  onError={(e) => {
                    // Optional: Handle image load errors (e.g., show placeholder)
                    e.currentTarget.style.display = "none"; // Hide broken image icon
                    // Or set src to a placeholder image
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                  {/* <span className="text-white text-xs line-clamp-1">View Resource</span> */}
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default function StudyGuideSectionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const sectionId = params.id as string;

  const { section: sectionFromStore, setSection } = useStudyGuideSectionStore();
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const { setExamId } = useExamIdStore();
  const { setIsInit } = useExamInitStore();

  // Fetch section details if not in store or if ID differs
  const {
    data: fetchedSectionData,
    isLoading: isLoadingSection,
    error: sectionError,
  } = useQuery({
    queryKey: [studyGuideApi.getSectionByID.name, sectionId],
    queryFn: () => studyGuideApi.getSectionByID(sectionId),
    enabled:
      !!sectionId && (!sectionFromStore || sectionFromStore.id !== sectionId),
    staleTime: 10 * 60 * 1000, // Cache section data for 10 mins
  });

  // Memoize the section data to use, preferring store data if available and matches ID
  const section = useMemo(() => {
    if (sectionFromStore && sectionFromStore.id === sectionId) {
      return sectionFromStore;
    }
    return fetchedSectionData;
  }, [sectionFromStore, fetchedSectionData, sectionId]);

  // Update store and select first lesson when section data becomes available
  useEffect(() => {
    if (fetchedSectionData) {
      setSection(fetchedSectionData);
      // Automatically select the first non-completed lesson, or the first lesson if all completed
      const firstLessonId =
        fetchedSectionData.lessons?.find((l) => !l.completed)?.id ||
        fetchedSectionData.lessons?.[0]?.id ||
        null;
      setSelectedLessonId(firstLessonId);
    } else if (
      sectionFromStore &&
      sectionFromStore.id === sectionId &&
      !selectedLessonId
    ) {
      // If using store data and no lesson selected yet, select first one
      const firstLessonId =
        sectionFromStore.lessons?.find((l) => !l.completed)?.id ||
        sectionFromStore.lessons?.[0]?.id ||
        null;
      setSelectedLessonId(firstLessonId);
    }
  }, [
    fetchedSectionData,
    sectionFromStore,
    sectionId,
    setSection,
    selectedLessonId,
  ]);

  const handleTakeSectionExam = () => {
    if (section?.section_exam?.id) {
      setExamId(section.section_exam.id);
      setIsInit(false);
      router.push(`/dashboard/exam/${section.section_exam.id}`);
    }
  };

  if (isLoadingSection && !section) {
    return (
      <div className="flex h-[calc(100vh-150px)] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (sectionError) {
    return (
      <div className="container mx-auto max-w-4xl py-10 px-4">
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
          <AlertTitle>Error Loading Section Details</AlertTitle>
          <AlertDescription>
            {formatError(sectionError as any)}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!section) {
    return (
      <div className="container mx-auto max-w-4xl py-10 px-4">
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
          <AlertTitle>Section Not Found</AlertTitle>
          <AlertDescription>
            The requested section could not be found.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const isSectionExamEnabled = (parseFloat(section.completion) || 0) >= 75;

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="flex items-center gap-4 px-4 py-3 border-b border-border flex-shrink-0 h-[65px]">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.back()}
          aria-label="Go back"
          className="h-8 w-8"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1 flex items-baseline gap-2 min-w-0">
          <h1
            className="font-semibold text-lg lg:text-xl text-foreground truncate"
            title={section.title}
          >
            {section.title}
          </h1>
          <span className="text-sm text-muted-foreground flex-shrink-0">
            ({section.lessons?.length || 0} Lessons)
          </span>
        </div>
        {section.section_exam?.id && (
          <Button
            size="sm"
            onClick={handleTakeSectionExam}
            disabled={!isSectionExamEnabled}
            aria-label="Take Section Exam"
            title={
              !isSectionExamEnabled
                ? `Complete at least 75% of the section to unlock the exam`
                : `Take Section Exam`
            }
          >
            <HelpCircle className="h-4 w-4 mr-2" />
            Take Section Exam
          </Button>
        )}
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-[280px] lg:w-[320px] border-r border-border bg-muted/30 overflow-y-auto flex-shrink-0">
          <div className="p-3 space-y-1.5">
            {(section.lessons || []).map((lesson) => (
              <LessonListItem
                key={lesson.id}
                lesson={lesson}
                isSelected={selectedLessonId === lesson.id}
                isLoadingContent={
                  selectedLessonId === lesson.id &&
                  queryClient.isFetching({
                    queryKey: [
                      studyGuideApi.getLessonContent.name,
                      lesson.id,
                      sectionId,
                    ],
                  }) > 0
                }
                onClick={() => setSelectedLessonId(lesson.id)}
              />
            ))}
            {section.lessons?.length === 0 && (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No lessons in this section yet.
              </div>
            )}
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto">
          <LessonContentViewer
            sectionId={section.id}
            selectedLessonId={selectedLessonId}
          />
        </main>
      </div>
    </div>
  );
}
