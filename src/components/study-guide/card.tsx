import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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

  return (
    <Card
      className={cn(
        "relative flex flex-col p-5 transition-all hover:shadow-lg border border-border",
        guide.hidden ? "opacity-60 hover:opacity-100" : "",
        guide.completed && !guide.hidden
          ? "bg-green-100 dark:bg-green-900/30"
          : "bg-card"
      )}
    >
      {guide.hidden && (
        <Badge
          variant="outline"
          className="absolute top-3 left-3 text-xs px-1.5 py-0.5 border-yellow-600 text-yellow-600 bg-yellow-50 dark:bg-yellow-900/30"
        >
          Hidden
        </Badge>
      )}

      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-7 w-7 text-muted-foreground hover:text-foreground z-10"
              onClick={(e) => {
                e.stopPropagation();
                onToggleHidden();
              }}
              aria-label={
                guide.hidden ? "Show study guide" : "Hide study guide"
              }
            >
              {guide.hidden ? (
                <EyeOffIcon className="h-4 w-4" />
              ) : (
                <EyeIcon className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>{guide.hidden ? "Show study guide" : "Hide study guide"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Clickable Card Area */}
      <div
        className="flex flex-col flex-grow cursor-pointer space-y-4 pt-6" // Add padding-top to avoid overlap with hidden badge/button
        onClick={onPress}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onPress();
        }} // Accessibility
      >
        {/* Title and Badges */}
        <div className="space-y-3">
          {/* Make title area slightly larger to prevent overlap with button */}
          <h3 className="font-semibold text-base leading-snug flex-1 pr-8 group-hover:text-primary">
            {guide.title}
          </h3>
          {guide.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {guide.description}
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="text-xs font-normal">
              {sectionLength} {sectionLength === 1 ? "Section" : "Sections"}
            </Badge>
            <Badge variant="secondary" className="text-xs font-normal">
              {lessonCount} {lessonCount === 1 ? "Lesson" : "Lessons"}
            </Badge>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1 pt-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Progress</span>
            <span>{completionPercentage.toFixed(0)}%</span>
          </div>
          <Progress
            value={completionPercentage}
            className="h-1.5"
            aria-label={`Study guide progress ${completionPercentage.toFixed(
              0
            )}%`}
          />
        </div>
      </div>
    </Card>
  );
}
