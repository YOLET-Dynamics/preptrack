"use client";
import UserSubjectList from "@/components/profile/userSubjectList";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

export default function StudyGuidesPage() {
  const handleAddStudyGuide = () => {
    console.log("Add Study-Guide");
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Study-Guides
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Personalized and bite-sized lessons.
          </p>
        </div>

        <Button
          onClick={handleAddStudyGuide}
          variant="outline"
          className="bg-transparent dark:border-cyan-500 dark:text-cyan-500 dark:hover:bg-cyan-500/10 shrink-0 w-full sm:w-auto"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          New Study-Guide
        </Button>
      </div>

      <div className="space-y-4">
        <UserSubjectList />
      </div>
    </div>
  );
}
