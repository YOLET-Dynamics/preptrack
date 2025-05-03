import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TestPathFiltersProps {
  filters: {
    showCompleted: boolean;
    showHidden: boolean;
  };
  onChange: (filters: { showCompleted: boolean; showHidden: boolean }) => void;
}

export function TestPathFilters({ filters, onChange }: TestPathFiltersProps) {
  const handleToggle = (key: keyof TestPathFiltersProps["filters"]) => {
    onChange({ ...filters, [key]: !filters[key] });
  };

  return (
    <div className="flex flex-wrap items-center justify-start gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleToggle("showCompleted")}
        className={cn(
          "h-8 px-3 rounded-full text-xs",
          filters.showCompleted
            ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20"
            : "text-muted-foreground border border-transparent hover:bg-muted/50 hover:text-foreground"
        )}
      >
        {filters.showCompleted ? "Showing" : "Show"} Completed
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleToggle("showHidden")}
        className={cn(
          "h-8 px-3 rounded-full text-xs",
          filters.showHidden
            ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20"
            : "text-muted-foreground border border-transparent hover:bg-muted/50 hover:text-foreground"
        )}
      >
         {filters.showHidden ? "Showing" : "Show"} Hidden
      </Button>
    </div>
  );
}
