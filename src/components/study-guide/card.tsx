import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { EyeIcon, EyeOffIcon, BookText, Layers } from "lucide-react";
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
        "group relative flex flex-col p-5 transition-all duration-200 ease-in-out",
        "bg-white rounded-xl shadow-sm",
        !guide.hidden && [
          "hover:shadow-lg hover:scale-[1.01]",
          "hover:border-brand-green/50",
        ],
        guide.hidden
          ? "border border-brand-indigo/10 opacity-60 hover:opacity-100"
          : guide.completed
            ? "border border-brand-indigo/10 border-l-4 border-l-brand-green"
            : "border border-brand-green/30"
      )}
    >
      {guide.hidden && (
        <Badge
          variant="outline"
          className="absolute top-3 left-3 text-xs px-2 py-0.5 border-amber-400/30 text-amber-600 bg-amber-50 z-10 font-dm-sans"
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
              className="absolute top-3 right-3 h-8 w-8 text-brand-indigo/40 hover:text-brand-green hover:bg-brand-green/10 rounded-lg z-10"
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
            className="bg-brand-indigo border-brand-indigo/20 text-white"
          >
            <p>{guide.hidden ? "Show study guide" : "Hide study guide"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div
        className="flex flex-col flex-grow cursor-pointer space-y-4 pt-5"
        onClick={onPress}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onPress();
        }}
      >
        <div className="space-y-2">
          <h3 className="font-semibold text-base leading-snug flex-1 pr-8 text-brand-indigo group-hover:text-brand-green transition-colors font-inter">
            {guide.title}
          </h3>
          {guide.description && (
            <p className="text-sm text-brand-indigo/50 line-clamp-2 font-dm-sans">
              {guide.description}
            </p>
          )}
          <div className="flex flex-wrap gap-2 pt-1">
            <Badge
              variant="secondary"
              className="text-xs font-normal bg-brand-indigo/5 border-brand-indigo/10 text-brand-indigo/70 font-dm-sans"
            >
              <Layers className="h-3 w-3 mr-1.5" />
              {sectionLength} {sectionLength === 1 ? "Section" : "Sections"}
            </Badge>
            <Badge
              variant="secondary"
              className="text-xs font-normal bg-brand-indigo/5 border-brand-indigo/10 text-brand-indigo/70 font-dm-sans"
            >
              <BookText className="h-3 w-3 mr-1.5" />
              {lessonCount} {lessonCount === 1 ? "Lesson" : "Lessons"}
            </Badge>
            {guide.completed && !guide.hidden && (
              <Badge
                variant="outline"
                className="border-brand-green/30 text-brand-green bg-brand-green/10 text-xs font-dm-sans"
              >
                Completed
              </Badge>
            )}
          </div>
        </div>

        <div className="space-y-2 pt-1">
          <div className="flex justify-between text-xs text-brand-indigo/50 font-dm-sans">
            <span>Progress</span>
            <span className="font-medium text-brand-indigo">{completionPercentage.toFixed(0)}%</span>
          </div>
          <Progress
            value={completionPercentage}
            className="h-2 bg-brand-indigo/10 [&>div]:bg-brand-green [&>div]:rounded-full"
            aria-label={`Study guide progress ${completionPercentage.toFixed(0)}%`}
          />
        </div>
      </div>
    </Card>
  );
}
