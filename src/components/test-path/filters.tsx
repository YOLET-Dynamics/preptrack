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
          "h-8 px-3 rounded-full text-xs font-dm-sans",
          filters.showCompleted
            ? "bg-brand-green/10 text-brand-green border border-brand-green/30 hover:bg-brand-green/20"
            : "text-white/50 border border-transparent hover:bg-brand-indigo/30 hover:text-white"
        )}
      >
        {filters.showCompleted ? "Showing" : "Show"} Completed
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleToggle("showHidden")}
        className={cn(
          "h-8 px-3 rounded-full text-xs font-dm-sans",
          filters.showHidden
            ? "bg-brand-green/10 text-brand-green border border-brand-green/30 hover:bg-brand-green/20"
            : "text-white/50 border border-transparent hover:bg-brand-indigo/30 hover:text-white"
        )}
      >
         {filters.showHidden ? "Showing" : "Show"} Hidden
      </Button>
    </div>
  );
}
