"use client";
import UserSubjectList from "@/components/profile/userSubjectList";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { studyGuideApi } from "@/api/studyGuide";
import { useUserSubjectStore } from "@/store/userSubject";
import { useTopicStore } from "@/store/topicStore";
import { useTestorStudyGuide } from "@/store/testPathOrStudyGuide";
import SelectSubjectDialog from "@/components/SelectSubjectDialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { formatError } from "@/common/utils";
import FullScreenLoader from "@/components/FullScreenLoader";
import { TestPathFilters } from "@/components/test-path/filters";
import { StudyGuide } from "@/models/studyguide/studyguide";
import { StudyGuideCard } from "@/components/study-guide/card";
import { useStudyGuideStore } from "@/store/studyGuideStore";
import { toast } from "sonner";

export default function StudyGuidesPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showSubjectDialog, setShowSubjectDialog] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const { setTestorStudyGuide, testorStudyGuide, resetTestorStudyGuide } =
    useTestorStudyGuide();
  const { userSubject } = useUserSubjectStore();
  const { selectedTopics, clearSelectedTopics } = useTopicStore();
  const { setGuide } = useStudyGuideStore();
  const [filters, setFilters] = useState({
    showCompleted: false,
    showHidden: false,
  });

  const {
    data: studyGuides,
    isLoading: isLoadingGuides,
    error: guidesError,
    isRefetching: isRefetchingGuides,
  } = useQuery({
    queryKey: [
      studyGuideApi.getStudyGuides.name,
      userSubject?.id,
      filters.showCompleted,
      filters.showHidden,
    ],
    queryFn: () =>
      studyGuideApi.getStudyGuides(
        userSubject!.id,
        filters.showCompleted,
        filters.showHidden
      ),
    enabled: !!userSubject,
  });

  const generateStudyGuideMutation = useMutation({
    mutationFn: studyGuideApi.generateStudyGuide,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [studyGuideApi.getStudyGuides.name, userSubject?.id],
      });
      clearSelectedTopics();
      resetTestorStudyGuide();
      router.push(`/dashboard/study-guides/${data.study_guide_id}`);
    },
    onError: (error: any) => {
      toast.error("Failed to generate study guide");
      setGenerationError(formatError(error));
      resetTestorStudyGuide();
    },
    onSettled: () => {
      setIsGenerating(false);
    },
  });

  const toggleHiddenMutation = useMutation({
    mutationFn: ({ guideId, hidden }: { guideId: string; hidden: boolean }) =>
      studyGuideApi.changeStudyGuideStatus(guideId, hidden),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [studyGuideApi.getStudyGuides.name, userSubject?.id],
      });
    },
    onError: (error: any) => {
      toast.error("Failed to toggle hidden status");
    },
  });

  useEffect(() => {
    const topicIds = selectedTopics.map((topic) => topic.id);

    if (
      testorStudyGuide === "sg" &&
      userSubject &&
      topicIds.length > 0 &&
      !showSubjectDialog &&
      !isGenerating &&
      !generateStudyGuideMutation.isSuccess
    ) {
      setIsGenerating(true);
      setGenerationError(null);
      generateStudyGuideMutation.mutate({
        subject_id: userSubject.id,
        topics: topicIds,
      });
    } else if (
      testorStudyGuide === "sg" &&
      !showSubjectDialog &&
      !isGenerating
    ) {
      resetTestorStudyGuide();
    }
  }, [
    testorStudyGuide,
    userSubject,
    selectedTopics,
    showSubjectDialog,
    isGenerating,
    generateStudyGuideMutation,
    resetTestorStudyGuide,
  ]);

  const handleAddStudyGuide = () => {
    setGenerationError(null);
    clearSelectedTopics();
    setTestorStudyGuide("sg");
    setShowSubjectDialog(true);
  };

  const handleGuidePressed = (guide: StudyGuide) => {
    setGuide(guide);
    router.push(`/dashboard/study-guides/${guide.id}`);
  };

  const handleToggleHidden = (guide: StudyGuide) => {
    toggleHiddenMutation.mutate({
      guideId: guide.id,
      hidden: !guide.hidden,
    });
  };

  let guidesErrorMessage = "Failed to load study guides";
  if (guidesError) {
    guidesErrorMessage = formatError(guidesError as any);
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 space-y-6 relative">
      {isGenerating && (
        <FullScreenLoader message="Generating your Study Guide..." />
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-brand-indigo font-inter">
            Study-Guides
          </h1>
          <p className="text-sm md:text-base text-brand-indigo/60 font-dm-sans">
            Personalized and bite-sized lessons.
          </p>
        </div>

        <Button
          onClick={handleAddStudyGuide}
          variant="outline"
          className="bg-transparent border-brand-green text-brand-green hover:bg-brand-green/10 shrink-0 w-full sm:w-auto"
          disabled={isGenerating || toggleHiddenMutation.isPending}
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          New Study-Guide
        </Button>
      </div>

      {generationError && !isGenerating && (
        <Alert variant="destructive" className="my-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error Generating Study Guide</AlertTitle>
          <AlertDescription>{generationError}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <UserSubjectList />
        <TestPathFilters filters={filters} onChange={setFilters} />
      </div>

      <div className="min-h-[200px]">
        {isLoadingGuides || isRefetchingGuides ? (
          <div className="flex justify-center items-center py-10 min-h-[200px]">
            <Loader2 className="h-8 w-8 animate-spin text-brand-green" />
          </div>
        ) : guidesError ? (
          <Alert variant="destructive" className="my-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error Loading Study Guides</AlertTitle>
            <AlertDescription>{guidesErrorMessage}</AlertDescription>
          </Alert>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {studyGuides && studyGuides.length > 0 ? (
              studyGuides.map((guide) => (
                <StudyGuideCard
                  key={guide.id}
                  guide={guide}
                  onPress={() => handleGuidePressed(guide)}
                  onToggleHidden={() => handleToggleHidden(guide)}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-brand-indigo/60 border border-dashed border-brand-indigo/20 rounded-xl min-h-[200px] flex flex-col justify-center items-center bg-white/50">
                <p className="text-lg mb-2 font-inter text-brand-indigo">No Study Guides Found</p>
                <p className="text-sm font-dm-sans">
                  {userSubject
                    ? "No study guides available for the selected course. Try creating one!"
                    : "Please select a course above to view study guides."}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <SelectSubjectDialog
        open={showSubjectDialog}
        onOpenChange={setShowSubjectDialog}
      />
    </div>
  );
}
