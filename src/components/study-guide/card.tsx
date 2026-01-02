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
        "bg-brand-indigo/10 rounded-2xl shadow-sm",
        !guide.hidden && [
          "hover:shadow-xl hover:scale-[1.015]",
          "hover:border-brand-green/50",
        ],
        guide.hidden
          ? "border border-brand-indigo/40 opacity-60 hover:opacity-100"
          : guide.completed
            ? "border border-brand-indigo/40 border-l-4 border-l-brand-green"
            : "border border-brand-green/50"
      )}
    >
      {guide.hidden && (
        <Badge
          variant="outline"
          className="absolute top-3 left-3 text-xs px-1.5 py-0.5 border-yellow-500/50 text-yellow-400 bg-yellow-500/10 z-10 font-dm-sans"
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
              className="absolute top-2 right-2 h-7 w-7 text-white/50 hover:text-brand-green hover:bg-brand-green/10 rounded-full z-10"
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
            className="bg-brand-indigo border-brand-indigo/60 text-white"
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
          <h3 className="font-semibold text-base leading-snug flex-1 pr-8 text-white group-hover:text-brand-green font-inter">
            {guide.title}
          </h3>
          {guide.description && (
            <p className="text-xs text-white/50 line-clamp-2 font-dm-sans">
              {guide.description}
            </p>
          )}
          <div className="flex flex-wrap gap-2 pt-1">
            <Badge
              variant="secondary"
              className="text-xs font-normal bg-brand-indigo/30 border-brand-indigo/40 text-white/70 font-dm-sans"
            >
              {sectionLength} {sectionLength === 1 ? "Section" : "Sections"}
            </Badge>
            <Badge
              variant="secondary"
              className="text-xs font-normal bg-brand-indigo/30 border-brand-indigo/40 text-white/70 font-dm-sans"
            >
              {lessonCount} {lessonCount === 1 ? "Lesson" : "Lessons"}
            </Badge>
            {guide.completed && !guide.hidden && (
              <Badge
                variant="outline"
                className="border-brand-green/50 text-brand-green bg-brand-green/10 text-xs font-dm-sans"
              >
                Completed
              </Badge>
            )}
          </div>
        </div>

        <div className="space-y-1.5 pt-2">
          <div className="flex justify-between text-xs text-white/50 font-dm-sans">
            <span>Progress</span>
            <span>{completionPercentage.toFixed(0)}%</span>
          </div>
          <Progress
            value={completionPercentage}
            className="h-1.5 bg-brand-indigo/30 [&>div]:bg-brand-green"
            aria-label={`Study guide progress ${completionPercentage.toFixed(
              0
            )}%`}
          />
        </div>
      </div>
    </Card>
  );
}
