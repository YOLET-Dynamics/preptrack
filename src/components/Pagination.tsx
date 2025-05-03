import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}) => {
  if (totalPages <= 1) {
    return null;
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div
      className={`flex items-center justify-center space-x-3 mt-2 ${className}`}
    >
      <Button
        variant="outline"
        size="icon"
        onClick={handlePrevious}
        disabled={currentPage === 1}
        aria-label="Go to previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <span className="text-sm text-muted-foreground tabular-nums">
        Page {currentPage} of {totalPages}
      </span>

      <Button
        variant="outline"
        size="icon"
        onClick={handleNext}
        disabled={currentPage === totalPages}
        aria-label="Go to next page"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default Pagination;
