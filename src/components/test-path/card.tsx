import { Button } from "@/components/ui/button";
import {
  Eye,
  EyeOff,
  GraduationCap,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TestPath } from "@/models/testPath";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TestPathCardProps {
  testPath: TestPath;
  onPress: () => void;
  onToggleHidden: () => void;
}

export function TestPathCard({
  testPath,
  onPress,
  onToggleHidden,
}: TestPathCardProps) {
  const examCount = testPath.sections.reduce(
    (prev, curr) => prev + (curr.exams?.length || 0),
    0
  );

  const completionPercentage = parseFloat(testPath.completion || "0");
  const isCompleted = testPath.completed && !testPath.upgraded;
  const isUpgraded = testPath.upgraded;
  const isInProgress = completionPercentage > 0 && !testPath.completed;

  return (
    <TooltipProvider delayDuration={300}>
      <div
        className={cn(
          "group relative overflow-hidden rounded-2xl transition-all duration-300 cursor-pointer",
          "bg-white border",
          testPath.hidden
            ? "border-brand-indigo/10 opacity-70 hover:opacity-100"
            : isUpgraded
            ? "border-amber-400/30 hover:border-amber-400/50"
            : isCompleted
            ? "border-brand-green/30 hover:border-brand-green/50"
            : isInProgress
            ? "border-brand-indigo/15 hover:border-brand-green/40"
            : "border-brand-indigo/10 hover:border-brand-green/30",
          !testPath.hidden &&
            "hover:shadow-xl hover:shadow-brand-green/5 hover:-translate-y-1"
        )}
        onClick={onPress}
        data-completed={testPath.completed}
      >
        {/* Gradient background overlay */}
        <div
          className={cn(
            "absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none",
            !testPath.hidden && "group-hover:opacity-100"
          )}
          style={{
            background: isUpgraded
              ? "linear-gradient(135deg, rgba(251, 191, 36, 0.05) 0%, transparent 50%)"
              : "linear-gradient(135deg, rgba(131, 200, 140, 0.05) 0%, transparent 50%)",
          }}
        />

        {/* Status indicator stripe */}
        {(isCompleted || isUpgraded) && (
          <div
            className={cn(
              "absolute top-0 left-0 w-1 h-full",
              isUpgraded
                ? "bg-gradient-to-b from-amber-400 to-amber-400/60"
                : "bg-gradient-to-b from-brand-green to-brand-green/60"
            )}
          />
        )}

        {/* Toggle visibility button */}
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
              aria-label={testPath.hidden ? "Show test path" : "Hide test path"}
            >
              {testPath.hidden ? (
                <Eye className="h-4 w-4" />
              ) : (
                <EyeOff className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent
            side="top"
            className="bg-brand-indigo text-white border-0 font-dm-sans"
          >
            <p>{testPath.hidden ? "Show" : "Hide"}</p>
          </TooltipContent>
        </Tooltip>

        {/* Main content */}
        <div className="relative p-5">
          {/* Header with title */}
          <div className="mb-4 pr-10">
            <div className="flex items-start gap-3">
              {isCompleted && (
                <div className="flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="w-5 h-5 text-brand-green" />
                </div>
              )}
              {isUpgraded && (
                <div className="flex-shrink-0 mt-0.5">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base text-brand-indigo group-hover:text-brand-green transition-colors font-inter leading-snug break-words">
                  {testPath.title}
                </h3>
              </div>
            </div>
          </div>

          {/* Stats pills */}
          <div className="flex flex-wrap gap-2 mb-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-indigo/5 text-brand-indigo/60 text-xs font-medium font-dm-sans">
              <BookOpen className="h-3.5 w-3.5" />
              <span>
                {testPath.sections.length}{" "}
                {testPath.sections.length === 1 ? "Section" : "Sections"}
              </span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-indigo/5 text-brand-indigo/60 text-xs font-medium font-dm-sans">
              <GraduationCap className="h-3.5 w-3.5" />
              <span>
                {examCount} {examCount === 1 ? "Exam" : "Exams"}
              </span>
            </div>
            {isUpgraded && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200/50 text-xs font-medium font-dm-sans">
                Upgraded
              </div>
            )}
          </div>

          {/* Progress section */}
          <div className="space-y-3 pt-3 border-t border-brand-indigo/5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-brand-indigo/40 font-dm-sans">
                Progress
              </span>
              <span
                className={cn(
                  "text-sm font-semibold font-inter",
                  isCompleted
                    ? "text-brand-green"
                    : isUpgraded
                    ? "text-amber-600"
                    : "text-brand-indigo"
                )}
              >
                {completionPercentage.toFixed(0)}%
              </span>
            </div>
            <div className="relative h-2 bg-brand-indigo/5 rounded-full overflow-hidden">
              <div
                className={cn(
                  "absolute inset-y-0 left-0 rounded-full transition-all duration-500",
                  isUpgraded
                    ? "bg-gradient-to-r from-amber-400 to-amber-500"
                    : isCompleted
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
              {isCompleted
                ? "Review assessment"
                : isUpgraded
                ? "Continue with new content"
                : "Start practicing"}
            </span>
            <div className="flex items-center gap-1 text-brand-green text-xs font-medium font-dm-sans">
              <span>Open</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
