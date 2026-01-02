import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Eye, EyeOff, GraduationCap, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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

  return (
    <TooltipProvider delayDuration={300}>
      <Card
        className={cn(
          "group relative flex flex-col transition-all duration-200 ease-in-out",
          "bg-brand-indigo/10 rounded-2xl shadow-sm",
          "cursor-pointer",
          !testPath.hidden && [
            "hover:shadow-xl hover:scale-[1.015]",
            "hover:border-brand-green/50", 
          ],
          testPath.hidden
            ? "border border-brand-indigo/40 opacity-70 hover:opacity-100"
            : testPath.upgraded
              ? "border border-brand-indigo/40 border-l-4 border-l-yellow-500"
              : testPath.completed
                ? "border border-brand-indigo/40 border-l-4 border-l-brand-green"
                : "border border-brand-green/50" 
        )}
        onClick={onPress}
        data-completed={testPath.completed}
      >
        <CardContent className="p-4 space-y-3">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-semibold text-base text-white flex-1 pr-10 break-words hyphens-auto font-inter">
              {testPath.title}
            </h3>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8 text-white/50 hover:text-brand-green hover:bg-brand-green/10 rounded-full z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleHidden();
                  }}
                  aria-label={
                    testPath.hidden ? "Show test path" : "Hide test path"
                  }
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
                className="bg-brand-indigo border-brand-indigo/60 text-white"
              >
                <p>{testPath.hidden ? "Show" : "Hide"}</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge
              variant="secondary"
              className="bg-brand-indigo/30 border-brand-indigo/40 text-white/70 text-xs font-dm-sans"
            >
              <BookOpen className="h-3 w-3 mr-1.5" />
              {testPath.sections.length}{" "}
              {testPath.sections.length === 1 ? "Section" : "Sections"}
            </Badge>
            <Badge
              variant="secondary"
              className="bg-brand-indigo/30 border-brand-indigo/40 text-white/70 text-xs font-dm-sans"
            >
              <GraduationCap className="h-3 w-3 mr-1.5" />
              {examCount} {examCount === 1 ? "Exam" : "Exams"}
            </Badge>
            {testPath.completed && !testPath.upgraded && (
              <Badge
                variant="outline"
                className="border-brand-green/50 text-brand-green bg-brand-green/10 text-xs font-dm-sans"
              >
                Completed
              </Badge>
            )}
            {testPath.upgraded && (
              <Badge
                variant="outline"
                className="border-yellow-500/50 text-yellow-400 bg-yellow-500/10 text-xs font-dm-sans"
              >
                Upgraded
              </Badge>
            )}
          </div>

          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between text-xs font-medium text-white/50 font-dm-sans">
              <span>Progress</span>
              <span>{completionPercentage.toFixed(0)}%</span>
            </div>
            <Progress
              value={completionPercentage}
              className="h-1.5 bg-brand-indigo/30 [&>div]:bg-brand-green"
            />
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
