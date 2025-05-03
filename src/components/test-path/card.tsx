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
          "relative bg-gray-900/50 border border-gray-700/80 rounded-lg",
          "hover:border-cyan-600/50 hover:bg-gray-900/80 transition-all duration-200 ease-in-out shadow-md",
          "cursor-pointer group",
          "border-l-4 border-l-transparent",
          testPath.completed && !testPath.upgraded
            ? "data-[completed=true]:border-l-cyan-500"
            : "",
          testPath.hidden ? "opacity-60 hover:opacity-100" : ""
        )}
        onClick={onPress}
        data-completed={testPath.completed}
      >
        <CardContent className="p-4 space-y-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg text-gray-100 flex-1 pr-10 break-words hyphens-auto">
              {testPath.title}
            </h3>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8 text-gray-500 hover:text-cyan-400 hover:bg-gray-800/50 rounded-full z-10"
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
                className="bg-gray-800 text-gray-200 border-gray-700"
              >
                <p>{testPath.hidden ? "Show" : "Hide"}</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge
              variant="outline"
              className="border-cyan-800/60 bg-cyan-900/40 text-cyan-300 text-xs font-medium"
            >
              <BookOpen className="h-3 w-3 mr-1.5" />
              {testPath.sections.length}{" "}
              {testPath.sections.length === 1 ? "Section" : "Sections"}
            </Badge>
            <Badge
              variant="outline"
              className="border-teal-800/60 bg-teal-900/40 text-teal-300 text-xs font-medium"
            >
              <GraduationCap className="h-3 w-3 mr-1.5" />
              {examCount} {examCount === 1 ? "Exam" : "Exams"}
            </Badge>
            {testPath.completed && !testPath.upgraded && (
              <Badge
                variant="outline"
                className="border-green-800/60 bg-green-900/40 text-green-300 text-xs font-medium"
              >
                Completed
              </Badge>
            )}
            {testPath.upgraded && (
              <Badge
                variant="outline"
                className="border-yellow-800/60 bg-yellow-900/40 text-yellow-300 text-xs font-medium"
              >
                Upgraded
              </Badge>
            )}
          </div>

          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between text-xs font-medium text-gray-400">
              <span>Progress</span>
              <span>{completionPercentage.toFixed(0)}%</span>
            </div>
            <Progress
              value={completionPercentage}
              className="h-1.5 bg-gray-700/50"
              data-indicator-className="bg-gradient-to-r from-cyan-500 to-teal-500"
            />
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
