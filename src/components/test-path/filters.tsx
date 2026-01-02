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
          "h-8 px-3 rounded-full text-xs font-dm-sans transition-all",
          filters.showCompleted
            ? "bg-brand-green/10 text-brand-green border border-brand-green/30 hover:bg-brand-green/20"
            : "text-brand-indigo/50 border border-brand-indigo/10 hover:bg-brand-indigo/5 hover:text-brand-indigo"
        )}
      >
        {filters.showCompleted ? "Showing" : "Show"} Completed
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleToggle("showHidden")}
        className={cn(
          "h-8 px-3 rounded-full text-xs font-dm-sans transition-all",
          filters.showHidden
            ? "bg-brand-green/10 text-brand-green border border-brand-green/30 hover:bg-brand-green/20"
            : "text-brand-indigo/50 border border-brand-indigo/10 hover:bg-brand-indigo/5 hover:text-brand-indigo"
        )}
      >
        {filters.showHidden ? "Showing" : "Show"} Hidden
      </Button>
    </div>
  );
}
