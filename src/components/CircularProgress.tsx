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

    const progressColorClass = "text-brand-green";
    const backgroundColorClass = "text-brand-indigo/10";

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
        <div className="absolute flex items-center justify-center text-brand-indigo">
          <span className="text-lg font-semibold font-inter">
            {(progress * 100).toFixed(1)}%
          </span>
        </div>
      </div>
    );
  }
);

CircularProgress.displayName = "CircularProgress";
