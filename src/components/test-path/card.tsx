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
          "bg-transparent rounded-lg shadow-sm",
          "cursor-pointer",
          !testPath.hidden && [
            "hover:shadow-xl hover:scale-[1.015]",
            "hover:border-primary", 
          ],
          testPath.hidden
            ? "border border-neutral-600 opacity-70 hover:opacity-100"
            : testPath.upgraded
              ? "border border-neutral-600 border-l-4 border-l-yellow-500 dark:border-l-yellow-600"
              : testPath.completed
                ? "border border-neutral-600 border-l-4 border-l-green-500 dark:border-l-green-600"
                : "border border-cyan-500" 
        )}
        onClick={onPress}
        data-completed={testPath.completed}
      >
        <CardContent className="p-4 space-y-3">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-semibold text-base text-foreground flex-1 pr-10 break-words hyphens-auto">
              {testPath.title}
            </h3>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full z-10"
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
                className="bg-popover text-popover-foreground border-border"
              >
                <p>{testPath.hidden ? "Show" : "Hide"}</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge
              variant="secondary"
              className="border-border/50 text-xs"
            >
              <BookOpen className="h-3 w-3 mr-1.5" />
              {testPath.sections.length}{" "}
              {testPath.sections.length === 1 ? "Section" : "Sections"}
            </Badge>
            <Badge
              variant="secondary"
              className="border-border/50 text-xs"
            >
              <GraduationCap className="h-3 w-3 mr-1.5" />
              {examCount} {examCount === 1 ? "Exam" : "Exams"}
            </Badge>
            {testPath.completed && !testPath.upgraded && (
              <Badge
                variant="outline"
                className="border-green-300 text-green-700 bg-green-50 dark:border-green-700 dark:text-green-300 dark:bg-green-900/30 text-xs"
              >
                Completed
              </Badge>
            )}
            {testPath.upgraded && (
              <Badge
                variant="outline"
                className="border-yellow-300 text-yellow-700 bg-yellow-50 dark:border-yellow-700 dark:text-yellow-300 dark:bg-yellow-900/30 text-xs"
              >
                Upgraded
              </Badge>
            )}
          </div>

          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between text-xs font-medium text-muted-foreground">
              <span>Progress</span>
              <span>{completionPercentage.toFixed(0)}%</span>
            </div>
            <Progress
              value={completionPercentage}
              className="h-1.5 bg-neutral-200 dark:bg-neutral-700 [&>div]:bg-gradient-to-r [&>div]:from-cyan-500 [&>div]:to-blue-500"
            />
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
