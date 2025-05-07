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
        "group relative flex flex-col p-4 transition-all duration-200 ease-in-out",
        "bg-transparent rounded-md shadow-sm",
        !guide.hidden && [
          "hover:shadow-xl hover:scale-[1.015]",
          "hover:border-primary",
        ],
        guide.hidden
          ? "border border-neutral-600 opacity-60 hover:opacity-100"
          : guide.completed
            ? "border border-neutral-600 border-l-4 border-l-green-500 dark:border-l-green-400"
            : "border border-cyan-500"
      )}
    >
      {guide.hidden && (
        <Badge
          variant="outline"
          className="absolute top-3 left-3 text-xs px-1.5 py-0.5 border-yellow-300 text-yellow-700 bg-yellow-50 dark:border-yellow-700 dark:text-yellow-300 dark:bg-yellow-900/30 z-10"
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
              className="absolute top-2 right-2 h-7 w-7 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full z-10"
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
          <TooltipContent
            side="top"
            className="bg-popover text-popover-foreground border-border"
          >
            <p>{guide.hidden ? "Show study guide" : "Hide study guide"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div
        className="flex flex-col flex-grow cursor-pointer space-y-3 pt-5"
        onClick={onPress}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onPress();
        }}
      >
        <div className="space-y-2">
          <h3 className="font-semibold text-base leading-snug flex-1 pr-8 text-foreground group-hover:text-primary">
            {guide.title}
          </h3>
          {guide.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {guide.description}
            </p>
          )}
          <div className="flex flex-wrap gap-2 pt-1">
            <Badge
              variant="secondary"
              className="text-xs font-normal border-border/50"
            >
              {sectionLength} {sectionLength === 1 ? "Section" : "Sections"}
            </Badge>
            <Badge
              variant="secondary"
              className="text-xs font-normal border-border/50"
            >
              {lessonCount} {lessonCount === 1 ? "Lesson" : "Lessons"}
            </Badge>
            {guide.completed && !guide.hidden && (
              <Badge
                variant="outline"
                className="border-green-300 text-green-700 bg-green-50 dark:border-green-700 dark:text-green-300 dark:bg-green-900/30 text-xs"
              >
                Completed
              </Badge>
            )}
          </div>
        </div>

        <div className="space-y-1.5 pt-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Progress</span>
            <span>{completionPercentage.toFixed(0)}%</span>
          </div>
          <Progress
            value={completionPercentage}
            className="h-1.5 bg-neutral-200 dark:bg-neutral-700 [&>div]:bg-gradient-to-r [&>div]:from-cyan-500 [&>div]:to-blue-500"
            aria-label={`Study guide progress ${completionPercentage.toFixed(
              0
            )}%`}
          />
        </div>
      </div>
    </Card>
  );
}
