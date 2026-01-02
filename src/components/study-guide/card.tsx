import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { EyeIcon, EyeOffIcon, BookText, Layers, ArrowRight, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { StudyGuide } from "@/models/studyguide/studyguide";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface StudyGuideCardProps {
  guide: StudyGuide;
  onPress: () => void;
  onToggleHidden: () => void;
}

export function StudyGuideCard({
  guide,
  onPress,
  onToggleHidden,
}: StudyGuideCardProps) {
  const completionPercentage = parseFloat(guide.completion) || 0;
  const sectionLength = guide.sections?.length || 0;
  const lessonCount =
    guide.sections?.reduce(
      (prev, curr) => prev + (curr.lessons?.length || 0),
      0
    ) || 0;

  const isCompleted = guide.completed && !guide.hidden;
  const isInProgress = completionPercentage > 0 && !guide.completed;

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl transition-all duration-300",
        "bg-white border",
        guide.hidden
          ? "border-brand-indigo/10 opacity-60 hover:opacity-100"
          : isCompleted
            ? "border-brand-green/30 hover:border-brand-green/50"
            : isInProgress
              ? "border-brand-indigo/15 hover:border-brand-green/40"
              : "border-brand-indigo/10 hover:border-brand-green/30",
        !guide.hidden && "hover:shadow-xl hover:shadow-brand-green/5 hover:-translate-y-1"
      )}
    >
      {/* Gradient background overlay */}
      <div
        className={cn(
          "absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none",
          !guide.hidden && "group-hover:opacity-100"
        )}
        style={{
          background: "linear-gradient(135deg, rgba(131, 200, 140, 0.05) 0%, transparent 50%)",
        }}
      />

      {/* Completed indicator stripe */}
      {isCompleted && (
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-brand-green to-brand-green/60" />
      )}

      {/* Hidden badge */}
      {guide.hidden && (
        <div className="absolute top-4 left-4 z-20">
          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-50 text-amber-600 border border-amber-200/50 font-dm-sans">
            Hidden
          </span>
        </div>
      )}

      {/* Toggle visibility button */}
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 h-8 w-8 text-brand-indigo/30 hover:text-brand-indigo hover:bg-brand-indigo/5 rounded-lg z-20 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                onToggleHidden();
              }}
              aria-label={guide.hidden ? "Show study guide" : "Hide study guide"}
            >
              {guide.hidden ? (
                <EyeOffIcon className="h-4 w-4" />
              ) : (
                <EyeIcon className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent
            side="top"
            className="bg-brand-indigo text-white border-0 font-dm-sans"
          >
            <p>{guide.hidden ? "Show" : "Hide"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Main clickable area */}
      <div
        className="relative flex flex-col p-5 cursor-pointer"
        onClick={onPress}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onPress();
        }}
      >
        {/* Header with title */}
        <div className="mb-4 pr-10">
          <div className="flex items-start gap-3">
            {isCompleted && (
              <div className="flex-shrink-0 mt-0.5">
                <CheckCircle2 className="w-5 h-5 text-brand-green" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base text-brand-indigo group-hover:text-brand-green transition-colors font-inter leading-snug">
                {guide.title}
              </h3>
              {guide.description && (
                <p className="text-sm text-brand-indigo/50 line-clamp-2 mt-1.5 font-dm-sans">
                  {guide.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Stats pills */}
        <div className="flex flex-wrap gap-2 mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-indigo/5 text-brand-indigo/60 text-xs font-medium font-dm-sans">
            <Layers className="h-3.5 w-3.5" />
            <span>{sectionLength} {sectionLength === 1 ? "Section" : "Sections"}</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-indigo/5 text-brand-indigo/60 text-xs font-medium font-dm-sans">
            <BookText className="h-3.5 w-3.5" />
            <span>{lessonCount} {lessonCount === 1 ? "Lesson" : "Lessons"}</span>
          </div>
        </div>

        {/* Progress section */}
        <div className="space-y-3 pt-3 border-t border-brand-indigo/5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-brand-indigo/40 font-dm-sans">Progress</span>
            <span
              className={cn(
                "text-sm font-semibold font-inter",
                isCompleted ? "text-brand-green" : "text-brand-indigo"
              )}
            >
              {completionPercentage.toFixed(0)}%
            </span>
          </div>
          <div className="relative h-2 bg-brand-indigo/5 rounded-full overflow-hidden">
            <div
              className={cn(
                "absolute inset-y-0 left-0 rounded-full transition-all duration-500",
                isCompleted
                  ? "bg-gradient-to-r from-brand-green to-emerald-500"
                  : "bg-gradient-to-r from-brand-green/80 to-brand-green"
              )}
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Hover action hint */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-brand-indigo/5 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-xs text-brand-indigo/40 font-dm-sans">
            {isCompleted ? "Review guide" : "Continue learning"}
          </span>
          <div className="flex items-center gap-1 text-brand-green text-xs font-medium font-dm-sans">
            <span>Open</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
}
