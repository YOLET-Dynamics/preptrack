"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { PlusIcon, Loader2, AlertTriangle } from "lucide-react";
import UserSubjectList from "@/components/profile/userSubjectList";
import { useUserSubjectStore } from "@/store/userSubject";
import { testPathApi } from "@/api/testPath";
import { TestPath } from "@/models/testPath";
import { TestPathFilters } from "@/components/test-path/filters";
import { useRouter } from "next/navigation";
import { TestPathCard } from "@/components/test-path/card";
import SelectSubjectDialog from "@/components/SelectSubjectDialog";
import { HttpResponse } from "@/common/response";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useTestPathStore } from "@/store/testPath";
import { useTestorStudyGuide } from "@/store/testPathOrStudyGuide";
import { formatError } from "@/common/utils";

export default function TestPathsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showSubjectDialog, setShowSubjectDialog] = useState(false);
  const [filters, setFilters] = useState({
    showCompleted: false,
    showHidden: false,
  });
  const { userSubject } = useUserSubjectStore();
  const { setTestPath } = useTestPathStore();
  const { setTestorStudyGuide } = useTestorStudyGuide();

  const {
    data: pathData,
    isLoading,
    error,
    isRefetching,
  } = useQuery({
    queryKey: [
      testPathApi.getTestPaths.name,
      userSubject?.id,
      filters.showCompleted,
      filters.showHidden,
    ],
    queryFn: () =>
      testPathApi.getTestPaths(
        userSubject!.id,
        filters.showCompleted,
        filters.showHidden
      ),
    enabled: !!userSubject,
  });

  const toggleHiddenMutation = useMutation({
    mutationFn: ({
      testPathId,
      hidden,
    }: {
      testPathId: string;
      hidden: boolean;
    }) => testPathApi.changeTestPathStatus(testPathId, hidden),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [testPathApi.getTestPaths.name, userSubject?.id],
      });
    },
  });

  const handleAddTP = () => {
    setTestorStudyGuide("tp");
    setShowSubjectDialog(true);
  };

  const handleTPPressed = (testPath: TestPath) => {
    setTestPath(testPath);
    router.push(`/dashboard/test-paths/${testPath.id}`);
  };

  const handleToggleHidden = (testPath: TestPath) => {
    toggleHiddenMutation.mutate({
      testPathId: testPath.id,
      hidden: !testPath.hidden,
    });
  };

  let errorMessage = "Failed to load test paths";

  if (error) {
    const err: HttpResponse<any> = error as any;
    errorMessage =
      typeof err.data === "string" ? err.data : "An unknown error occurred";
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Assessments
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Personalized collection of assessments.
          </p>
        </div>

        <Button
          onClick={handleAddTP}
          variant="outline"
          className="bg-transparent dark:border-cyan-500 dark:text-cyan-500 dark:hover:bg-cyan-500/10 shrink-0 w-full sm:w-auto"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          New Assessment
        </Button>
      </div>

      <div className="space-y-4">
        <UserSubjectList />
        <TestPathFilters filters={filters} onChange={setFilters} />
      </div>

      {isLoading || isRefetching ? (
        <div className="flex justify-center items-center py-10 min-h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <Alert variant="destructive" className="my-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error Loading Test Paths</AlertTitle>
          <AlertDescription>{formatError(errorMessage)}</AlertDescription>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pathData && pathData.length > 0 ? (
            pathData.map((path) => (
              <TestPathCard
                key={path.id}
                testPath={path}
                onPress={() => handleTPPressed(path)}
                onToggleHidden={() => handleToggleHidden(path)}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-10 text-muted-foreground border border-dashed border-border rounded-lg">
              <p className="text-lg mb-2">No Test Paths Found</p>
              <p className="text-sm">
                {userSubject
                  ? "No test paths available for the selected course. Try creating one!"
                  : "Please select a course above to view test paths."}
              </p>
            </div>
          )}
        </div>
      )}

      <SelectSubjectDialog
        open={showSubjectDialog}
        onOpenChange={setShowSubjectDialog}
      />
    </div>
  );
}
