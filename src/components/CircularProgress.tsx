import { cn } from "@/lib/utils";
import React from "react";

interface CircularProgressProps {
    progress: number;
    size?: number;
    strokeWidth?: number;
    className?: string;
  }
  
  export const CircularProgress = React.memo(
    ({
      progress,
      size = 100,
      strokeWidth = 8,
      className,
    }: CircularProgressProps) => {
      const radius = (size - strokeWidth) / 2;
      const circumference = 2 * Math.PI * radius;
      const strokeDashoffset = circumference - progress * circumference;
      const center = size / 2;
  
      // Use CSS variables for theme-aware colors defined in globals.css or theme setup
      const progressColorClass = "text-cyan-500"; // Example: replace with your primary color variable if needed
      const backgroundColorClass = "text-gray-700"; // Example: background circle color
  
      return (
        <div
          className={cn(
            "relative inline-flex items-center justify-center",
            className
          )}
        >
          <svg width={size} height={size} className="-rotate-90">
            <circle
              cx={center}
              cy={center}
              r={radius}
              stroke="currentColor"
              className={backgroundColorClass}
              strokeWidth={strokeWidth}
              fill="none"
            />
            <circle
              cx={center}
              cy={center}
              r={radius}
              stroke="currentColor"
              className={progressColorClass}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="none"
              style={{
                transition: "stroke-dashoffset 0.3s ease-in-out",
              }}
            />
          </svg>
          <div className="absolute flex items-center justify-center text-gray-100">
            <span className="text-lg font-semibold">
              {(progress * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      );
    }
  );
  
  CircularProgress.displayName = "CircularProgress";