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
          "bg-white rounded-xl shadow-sm",
          "cursor-pointer",
          !testPath.hidden && [
            "hover:shadow-lg hover:scale-[1.01]",
            "hover:border-brand-green/50",
          ],
          testPath.hidden
            ? "border border-brand-indigo/10 opacity-70 hover:opacity-100"
            : testPath.upgraded
              ? "border border-brand-indigo/10 border-l-4 border-l-amber-400"
              : testPath.completed
                ? "border border-brand-indigo/10 border-l-4 border-l-brand-green"
                : "border border-brand-green/30"
        )}
        onClick={onPress}
        data-completed={testPath.completed}
      >
        <CardContent className="p-5 space-y-4">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-base text-brand-indigo flex-1 pr-10 break-words hyphens-auto font-inter group-hover:text-brand-green transition-colors">
              {testPath.title}
            </h3>
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
                className="bg-brand-indigo border-brand-indigo/20 text-white"
              >
                <p>{testPath.hidden ? "Show" : "Hide"}</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge
              variant="secondary"
              className="bg-brand-indigo/5 border-brand-indigo/10 text-brand-indigo/70 text-xs font-dm-sans"
            >
              <BookOpen className="h-3 w-3 mr-1.5" />
              {testPath.sections.length}{" "}
              {testPath.sections.length === 1 ? "Section" : "Sections"}
            </Badge>
            <Badge
              variant="secondary"
              className="bg-brand-indigo/5 border-brand-indigo/10 text-brand-indigo/70 text-xs font-dm-sans"
            >
              <GraduationCap className="h-3 w-3 mr-1.5" />
              {examCount} {examCount === 1 ? "Exam" : "Exams"}
            </Badge>
            {testPath.completed && !testPath.upgraded && (
              <Badge
                variant="outline"
                className="border-brand-green/30 text-brand-green bg-brand-green/10 text-xs font-dm-sans"
              >
                Completed
              </Badge>
            )}
            {testPath.upgraded && (
              <Badge
                variant="outline"
                className="border-amber-400/30 text-amber-600 bg-amber-50 text-xs font-dm-sans"
              >
                Upgraded
              </Badge>
            )}
          </div>

          <div className="space-y-2 pt-1">
            <div className="flex justify-between text-xs font-medium text-brand-indigo/50 font-dm-sans">
              <span>Progress</span>
              <span className="text-brand-indigo">{completionPercentage.toFixed(0)}%</span>
            </div>
            <Progress
              value={completionPercentage}
              className="h-2 bg-brand-indigo/10 [&>div]:bg-brand-green [&>div]:rounded-full"
            />
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
