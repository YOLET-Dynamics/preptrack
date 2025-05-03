"use client";

import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { profileApi } from "@/api/profile";
import {
  Loader2,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  LineChart as LineChartIcon, // Renamed to avoid conflict
  Pencil, // Example icons, replace if needed
  Clock,
  Trophy,
  AlertCircle,
  CalendarDays,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
  Filler,
} from "chart.js";
import { useUserConceptStore } from "@/store/userConceptStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { formatError } from "@/common/utils";
import { cn } from "@/lib/utils";
import { ConceptAudit } from "@/models/profile/audits";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

type TimeRangeOption = "week" | "month" | "year";

const TIME_RANGE_OPTIONS: { label: string; value: TimeRangeOption }[] = [
  { label: "Last Week", value: "week" },
  { label: "Last Month", value: "month" },
  { label: "Last Year", value: "year" },
];

interface StatInfo {
  label: string;
  value: string | number;
  icon: React.ElementType;
  iconColorClass: string;
  bgColorClass: string;
  textColorClass: string;
}

// --- Skeleton Component ---
/** Renders placeholder skeletons for the main content card */
const ConceptDetailSkeleton = () => (
  <Card className="bg-gray-800/60 border border-gray-700/80 w-full overflow-hidden">
    <CardHeader className="border-b border-gray-700/80 p-5 md:p-6">
      <Skeleton className="h-6 w-3/4 mb-3 bg-gray-700/50" /> {/* Title */}
      <Skeleton className="h-10 w-1/3 bg-gray-700/50" /> {/* Score */}
    </CardHeader>
    <CardContent className="p-5 md:p-6 space-y-6">
      {/* Evaluation Progress Skeleton */}
      <Card className="bg-gray-900/40 border-gray-700/60">
        <CardHeader className="pb-3 pt-4 px-4">
          <Skeleton className="h-4 w-1/3 bg-gray-700/50" /> {/* Title */}
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="grid grid-cols-3 gap-2">
            <Skeleton className="h-16 w-full bg-gray-800/50" />
            <Skeleton className="h-16 w-full bg-gray-800/50" />
            <Skeleton className="h-16 w-full bg-gray-800/50" />
          </div>
        </CardContent>
      </Card>
      {/* Stats Skeleton */}
      <div>
        <Skeleton className="h-5 w-1/4 mb-3 bg-gray-700/50" /> {/* Title */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <Skeleton className="h-24 w-full bg-gray-700/50" />
          <Skeleton className="h-24 w-full bg-gray-700/50" />
          <Skeleton className="h-24 w-full bg-gray-700/50" />
          <Skeleton className="h-24 w-full bg-gray-700/50" />
        </div>
      </div>
      {/* Performance History Skeleton (Placeholder for Chart Section Title/Dropdown) */}
      <div>
         <div className="flex justify-between items-center mb-4">
            <Skeleton className="h-5 w-1/3 bg-gray-700/50" /> {/* Title */}
            <Skeleton className="h-9 w-[130px] bg-gray-700/50" /> {/* Dropdown */}
         </div>
         {/* Chart Area Skeleton */}
         <Skeleton className="h-[300px] w-full bg-gray-900/40 rounded-lg border border-gray-700/60" />
      </div>
    </CardContent>
  </Card>
);

// --- Main Component ---

export default function ConceptDetailPage() {
  const router = useRouter();
  const { userConcept } = useUserConceptStore();
  const [timeRange, setTimeRange] = useState<TimeRangeOption>("week");

  // --- Data Fetching ---
  const conceptId = userConcept?.concept?.id;
  const {
    data: conceptAuditsData, // Rename raw data
    isLoading: isLoadingAudits,
    error: auditsError,
    refetch: refetchAudits,
  } = useQuery({
    queryKey: ["conceptAudits", conceptId, timeRange],
    // Explicitly type the return data if needed, though inference is usually sufficient
    queryFn: (): Promise<ConceptAudit[]> => profileApi.getConceptAudits(conceptId!, timeRange),
    enabled: !!conceptId,
    staleTime: 5 * 60 * 1000,
  });

  const conceptAudits: ConceptAudit[] | undefined = conceptAuditsData;

  const { evaluationData, statsData, chartData, chartOptions } = useMemo(() => {
    const initialEval = Number(userConcept?.initial_eval) || 0;
    const prevEval = Number(userConcept?.prev_eval) || 0;
    const currentEval = Number(userConcept?.recent_eval) || 0;
    const evaluationData = [
      { label: "Initial", value: initialEval },
      { label: "Previous", value: prevEval },
      { label: "Current", value: currentEval },
    ];

    const questionsAttempted = userConcept?.questions_attempted || 0;
    const avgTime = (Number(userConcept?.avg_time) || 0).toFixed(1);
    const highestScore = Number(userConcept?.highest_question_score) || 0;
    const lowestScore = Number(userConcept?.lowest_question_score) || 0;

    const statsData: StatInfo[] = [
       {
        label: "Questions Done",
        value: questionsAttempted,
        icon: Pencil,
        iconColorClass: "text-blue-400",
        bgColorClass: "bg-blue-950/60",
        textColorClass: "text-blue-300",
      },
      {
        label: "Average Time",
        value: `${avgTime}s`,
        icon: Clock,
        iconColorClass: "text-amber-400",
        bgColorClass: "bg-amber-950/60",
        textColorClass: "text-amber-300",
      },
      {
        label: "Highest Score",
        value: `${highestScore.toFixed(0)}%`,
        icon: Trophy,
        iconColorClass: "text-emerald-400",
        bgColorClass: "bg-emerald-950/60",
        textColorClass: "text-emerald-300",
      },
      {
        label: "Lowest Score",
        value: `${lowestScore.toFixed(0)}%`,
        icon: AlertCircle,
        iconColorClass: "text-red-400",
        bgColorClass: "bg-red-950/50",
        textColorClass: "text-red-300",
      },
    ];

    // Chart Data and Options
    const formatLabel = (dateStr: string): string => {
      try {
        const date = new Date(dateStr.replace(" ", "T") + "Z");
        if (isNaN(date.getTime())) return "?";

        switch (timeRange) {
          case "week": return date.toLocaleDateString("en-US", { weekday: "short" });
          case "month": return date.toLocaleDateString("en-US", { day: "numeric" });
          case "year": return date.toLocaleDateString("en-US", { month: "short" });
          default: return "";
        }
      } catch (e) {
        console.error("Error formatting date label:", e);
        return "?";
      }
    };

    // Ensure conceptAudits is treated as ConceptAudit[] or empty array
    const auditsToProcess: ConceptAudit[] = conceptAudits || [];
    const sortedAudits = [...auditsToProcess].sort(
      (a, b) =>
        new Date(a.created_at.replace(" ", "T") + "Z").getTime() -
        new Date(b.created_at.replace(" ", "T") + "Z").getTime()
    );

    const labels = sortedAudits.map((audit) => formatLabel(audit.created_at));
    const dataPoints = sortedAudits.map(
      (audit) => parseFloat(audit.record) || 0
    );

    const chartData: ChartData<"line"> = {
      labels: labels,
      datasets: [
        {
          label: "Performance",
          data: dataPoints,
          borderColor: "hsl(var(--primary))",
          backgroundColor: "hsla(var(--primary), 0.1)",
          tension: 0.3,
          pointBackgroundColor: "hsl(var(--primary))",
          pointBorderColor: "hsl(var(--background))",
          pointHoverBackgroundColor: "hsl(var(--primary))",
          pointHoverBorderColor: "hsl(var(--primary))",
          fill: true,
        },
      ],
    };

    const chartOptions: ChartOptions<"line"> = {
       responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "hsl(var(--secondary))",
          titleColor: "hsl(var(--secondary-foreground))",
          bodyColor: "hsl(var(--secondary-foreground))",
          borderColor: "hsl(var(--border))",
          borderWidth: 1,
          padding: 10,
          callbacks: {
            label: (context) =>
              `${context.dataset.label}: ${context.formattedValue}%`,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true, max: 100,
          grid: { color: "hsl(var(--border) / 0.5)" },
          ticks: {
            color: "hsl(var(--muted-foreground))",
            stepSize: 20,
            callback: (value) => `${value}%`,
          },
          border: { color: "hsl(var(--border))" },
        },
        x: {
          grid: { display: false },
          ticks: {
            color: "hsl(var(--muted-foreground))",
            maxRotation: 0, autoSkip: true,
            maxTicksLimit: timeRange === "month" ? 15 : timeRange === "year" ? 12 : 7,
          },
          border: { color: "hsl(var(--border))" },
        },
      },
      interaction: { intersect: false, mode: "index" },
    };

    return { evaluationData, statsData, chartData, chartOptions };
    // Ensure userConcept is a dependency so memo updates when it loads
  }, [userConcept, conceptAudits, timeRange]);

  // --- Render Logic ---

  // Decide whether to show skeleton or error based on userConcept presence
  // Skeleton is shown if userConcept is initially null/undefined
  const showSkeleton = !userConcept;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 space-y-6">
      {/* Back Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => router.back()}
        className="bg-transparent dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700/50 shrink-0"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      {/* Render Skeleton or Main Content */}
      {showSkeleton ? (
        <ConceptDetailSkeleton />
      ) : !userConcept.concept ? (
        // This case handles if userConcept exists but concept sub-object doesn't (data integrity issue)
         <Alert variant="destructive">
           <AlertTriangle className="h-4 w-4" />
           <AlertTitle>Error</AlertTitle>
           <AlertDescription>
             Incomplete concept data found. Please navigate back and select a concept again.
           </AlertDescription>
         </Alert>
      ) : (
        // Render actual content if userConcept and userConcept.concept exist
        <Card className="bg-gray-800/60 border border-gray-700/80 w-full overflow-hidden">
          {/* Card Header: Concept Name & Current Score */}
          <CardHeader className="border-b border-gray-700/80 p-5 md:p-6">
            <CardTitle className="text-xl font-semibold text-gray-100 mb-2">
              {userConcept.concept.name}
            </CardTitle>
            <div className="flex items-baseline">
              <span className="text-4xl font-bold text-cyan-400">
                {(Number(userConcept.recent_eval) || 0).toFixed(0)}
              </span>
              <span className="text-2xl font-semibold text-cyan-400 ml-1">%</span>
              <span className="ml-2 text-sm text-gray-400">Current Score</span>
            </div>
          </CardHeader>

          {/* Card Content */}
          <CardContent className="p-5 md:p-6 space-y-6">
            {/* Evaluation Progress Section */}
            <Card className="bg-gray-900/40 border-gray-700/60">
              <CardHeader className="pb-3 pt-4 px-4">
                <CardTitle className="text-sm font-medium text-gray-400">
                  Evaluation Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="grid grid-cols-3 gap-2">
                  {evaluationData.map((item, index) => (
                    <div
                      key={item.label}
                      className={cn(
                        "text-center p-3 rounded-md bg-gray-800/50",
                        index !== evaluationData.length - 1
                          ? "relative after:content-[''] after:absolute after:right-0 after:top-1/4 after:h-1/2 after:w-px after:bg-gray-700" // Vertical separator
                          : ""
                      )}
                    >
                      <div className="text-xs text-gray-400 mb-1">
                        {item.label}
                      </div>
                      <div className="text-lg font-semibold text-cyan-300">
                        {item.value.toFixed(0)}%
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Statistics Section */}
            <div>
              <h3 className="text-base font-medium text-gray-300 mb-3">
                Key Stats
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                {statsData.map((stat) => (
                  <div
                    key={stat.label}
                    className={cn(
                      "rounded-lg p-4 transition-colors duration-200 flex flex-col",
                      stat.bgColorClass
                    )}
                  >
                    <stat.icon
                      className={cn("h-5 w-5 mb-2", stat.iconColorClass)}
                    />
                    <span
                      className={cn(
                        "text-xl font-semibold mt-auto",
                        stat.textColorClass
                      )}
                    >
                      {stat.value}
                    </span>
                    <span
                      className={cn("text-xs font-medium", stat.textColorClass)}
                    >
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance History Section */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-medium text-gray-300">
                  Performance History
                </h3>
                {/* Time Range Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-[130px] justify-between bg-gray-700/50 border-gray-600 hover:bg-gray-700"
                      disabled={isLoadingAudits && !conceptAudits} // Disable if loading initial audits
                    >
                      <CalendarDays className="h-4 w-4 mr-2 text-gray-400" />
                      {
                        TIME_RANGE_OPTIONS.find((opt) => opt.value === timeRange)
                          ?.label
                      }
                      {isLoadingAudits ? (
                        <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                      ) : (
                        <ChevronDown className="h-4 w-4 ml-2 opacity-50" />
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[130px]">
                    {TIME_RANGE_OPTIONS.map((option) => (
                      <DropdownMenuItem
                        key={option.value}
                        onClick={() => {
                            if (timeRange !== option.value) {
                                setTimeRange(option.value);
                                // Optional: Could trigger refetch manually here if needed,
                                // but changing timeRange dependency in useQuery usually suffices.
                                // refetchAudits();
                            }
                        }}
                        disabled={isLoadingAudits}
                      >
                        {option.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Chart Area */}
              <div className="h-[300px] p-4 bg-gray-900/40 rounded-lg border border-gray-700/60 relative">
                 {/* Loading Overlay */}
                {isLoadingAudits && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 z-10 rounded-lg">
                    <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
                  </div>
                )}
                 {/* Error Overlay */}
                {!isLoadingAudits && auditsError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 z-10 rounded-lg p-4">
                    <Alert variant="destructive" className="w-full max-w-md">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Error Loading Chart</AlertTitle>
                      <AlertDescription>
                        {formatError(
                          auditsError instanceof Error
                            ? auditsError.message
                            : String(auditsError)
                        )}
                        <Button
                          variant="link"
                          size="sm"
                          onClick={() => refetchAudits()}
                          className="p-0 h-auto ml-1 text-cyan-400"
                        >
                          Retry
                        </Button>
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
                 {/* Empty State Overlay */}
                {!isLoadingAudits &&
                  !auditsError &&
                  (!conceptAudits || conceptAudits.length === 0) && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-0 rounded-lg">
                      <LineChartIcon className="h-12 w-12 text-gray-600 mb-2" />
                      <p className="text-sm text-gray-500">
                        No performance data available
                      </p>
                      <p className="text-xs text-gray-600">
                        for the selected time range.
                      </p>
                    </div>
                  )}
                  {/* Chart Rendering (only if not loading, no error, and data exists) */}
                 {!isLoadingAudits &&
                   !auditsError &&
                   conceptAudits &&
                   conceptAudits.length > 0 && (
                     <Line data={chartData} options={chartOptions} />
                   )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
