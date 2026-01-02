"use client";

import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { profileApi } from "@/api/profile";
import {
  Loader2,
  ArrowLeft,
  ChevronDown,
  AlertTriangle,
  LineChart as LineChartIcon,
  Pencil,
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

const ConceptDetailSkeleton = () => (
  <Card className="bg-white border border-brand-indigo/10 shadow-sm rounded-2xl w-full overflow-hidden">
    <CardHeader className="border-b border-brand-indigo/5 p-5 md:p-6">
      <Skeleton className="h-6 w-3/4 mb-3 bg-brand-indigo/5" />
      <Skeleton className="h-10 w-1/3 bg-brand-indigo/5" />
    </CardHeader>
    <CardContent className="p-5 md:p-6 space-y-6">
      <Card className="bg-brand-indigo/5 border-brand-indigo/10">
        <CardHeader className="pb-3 pt-4 px-4">
          <Skeleton className="h-4 w-1/3 bg-brand-indigo/10" />
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="grid grid-cols-3 gap-2">
            <Skeleton className="h-16 w-full bg-white" />
            <Skeleton className="h-16 w-full bg-white" />
            <Skeleton className="h-16 w-full bg-white" />
          </div>
        </CardContent>
      </Card>
      <div>
        <Skeleton className="h-5 w-1/4 mb-3 bg-brand-indigo/5" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <Skeleton className="h-24 w-full bg-brand-indigo/5" />
          <Skeleton className="h-24 w-full bg-brand-indigo/5" />
          <Skeleton className="h-24 w-full bg-brand-indigo/5" />
          <Skeleton className="h-24 w-full bg-brand-indigo/5" />
        </div>
      </div>
      <div>
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="h-5 w-1/3 bg-brand-indigo/5" />
          <Skeleton className="h-9 w-[130px] bg-brand-indigo/5" />
        </div>
        <Skeleton className="h-[300px] w-full bg-brand-indigo/5 rounded-xl" />
      </div>
    </CardContent>
  </Card>
);

export default function ConceptDetailPage() {
  const router = useRouter();
  const { userConcept } = useUserConceptStore();
  const [timeRange, setTimeRange] = useState<TimeRangeOption>("week");

  const conceptId = userConcept?.concept?.id;
  const {
    data: conceptAuditsData,
    isLoading: isLoadingAudits,
    error: auditsError,
    refetch: refetchAudits,
  } = useQuery({
    queryKey: ["conceptAudits", conceptId, timeRange],
    queryFn: (): Promise<ConceptAudit[]> =>
      profileApi.getConceptAudits(conceptId!, timeRange),
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
        iconColorClass: "text-blue-500",
        bgColorClass: "bg-blue-50",
        textColorClass: "text-blue-700",
      },
      {
        label: "Average Time",
        value: `${avgTime}s`,
        icon: Clock,
        iconColorClass: "text-amber-500",
        bgColorClass: "bg-amber-50",
        textColorClass: "text-amber-700",
      },
      {
        label: "Highest Score",
        value: `${highestScore.toFixed(0)}%`,
        icon: Trophy,
        iconColorClass: "text-green-500",
        bgColorClass: "bg-green-50",
        textColorClass: "text-green-700",
      },
      {
        label: "Lowest Score",
        value: `${lowestScore.toFixed(0)}%`,
        icon: AlertCircle,
        iconColorClass: "text-red-500",
        bgColorClass: "bg-red-50",
        textColorClass: "text-red-700",
      },
    ];

    const formatLabel = (dateStr: string): string => {
      try {
        const date = new Date(dateStr.replace(" ", "T") + "Z");
        if (isNaN(date.getTime())) return "?";

        switch (timeRange) {
          case "week":
            return date.toLocaleDateString("en-US", { weekday: "short" });
          case "month":
            return date.toLocaleDateString("en-US", { day: "numeric" });
          case "year":
            return date.toLocaleDateString("en-US", { month: "short" });
          default:
            return "";
        }
      } catch (e) {
        console.error("Error formatting date label:", e);
        return "?";
      }
    };

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
          borderColor: "#83C88C",
          backgroundColor: "rgba(131, 200, 140, 0.1)",
          tension: 0.3,
          pointBackgroundColor: "#83C88C",
          pointBorderColor: "#ffffff",
          pointHoverBackgroundColor: "#83C88C",
          pointHoverBorderColor: "#83C88C",
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
          backgroundColor: "#223843",
          titleColor: "#ffffff",
          bodyColor: "#ffffff",
          borderColor: "#223843",
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
          beginAtZero: true,
          max: 100,
          grid: { color: "rgba(34, 56, 67, 0.1)" },
          ticks: {
            color: "rgba(34, 56, 67, 0.5)",
            stepSize: 20,
            callback: (value) => `${value}%`,
          },
          border: { color: "rgba(34, 56, 67, 0.2)" },
        },
        x: {
          grid: { display: false },
          ticks: {
            color: "rgba(34, 56, 67, 0.5)",
            maxRotation: 0,
            autoSkip: true,
            maxTicksLimit: timeRange === "month" ? 15 : timeRange === "year" ? 12 : 7,
          },
          border: { color: "rgba(34, 56, 67, 0.2)" },
        },
      },
      interaction: { intersect: false, mode: "index" },
    };

    return { evaluationData, statsData, chartData, chartOptions };
  }, [userConcept, conceptAudits, timeRange]);

  const showSkeleton = !userConcept;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <Button
        variant="outline"
        size="sm"
        onClick={() => router.back()}
        className="border-brand-indigo/20 text-brand-indigo hover:bg-brand-indigo/5 rounded-lg font-dm-sans"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      {showSkeleton ? (
        <ConceptDetailSkeleton />
      ) : !userConcept.concept ? (
        <Alert variant="destructive" className="bg-red-50 border-red-200 rounded-xl">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="text-red-700 font-inter">Error</AlertTitle>
          <AlertDescription className="text-red-600 font-dm-sans">
            Incomplete concept data found. Please navigate back and select a
            concept again.
          </AlertDescription>
        </Alert>
      ) : (
        <Card className="bg-white border border-brand-indigo/10 shadow-sm rounded-2xl w-full overflow-hidden">
          <CardHeader className="border-b border-brand-indigo/5 p-5 md:p-6">
            <CardTitle className="text-xl font-semibold text-brand-indigo font-inter mb-2">
              {userConcept.concept.name}
            </CardTitle>
            <div className="flex items-baseline">
              <span className="text-4xl font-bold text-brand-green">
                {(Number(userConcept.recent_eval) || 0).toFixed(0)}
              </span>
              <span className="text-2xl font-semibold text-brand-green ml-1">
                %
              </span>
              <span className="ml-2 text-sm text-brand-indigo/50 font-dm-sans">
                Current Score
              </span>
            </div>
          </CardHeader>

          <CardContent className="p-5 md:p-6 space-y-6">
            <Card className="bg-brand-indigo/5 border-brand-indigo/10 rounded-xl">
              <CardHeader className="pb-3 pt-4 px-4">
                <CardTitle className="text-sm font-medium text-brand-indigo/60 font-dm-sans">
                  Evaluation Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="grid grid-cols-3 gap-2">
                  {evaluationData.map((item, index) => (
                    <div
                      key={item.label}
                      className={cn(
                        "text-center p-3 rounded-lg bg-white",
                        index !== evaluationData.length - 1
                          ? "relative after:content-[''] after:absolute after:right-0 after:top-1/4 after:h-1/2 after:w-px after:bg-brand-indigo/10"
                          : ""
                      )}
                    >
                      <div className="text-xs text-brand-indigo/50 mb-1 font-dm-sans">
                        {item.label}
                      </div>
                      <div className="text-lg font-semibold text-brand-green font-inter">
                        {item.value.toFixed(0)}%
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div>
              <h3 className="text-sm font-medium text-brand-indigo/60 mb-3 font-dm-sans uppercase tracking-wide">
                Key Stats
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                {statsData.map((stat) => (
                  <div
                    key={stat.label}
                    className={cn(
                      "rounded-xl p-4 transition-colors duration-200 flex flex-col border border-brand-indigo/5",
                      stat.bgColorClass
                    )}
                  >
                    <stat.icon
                      className={cn("h-5 w-5 mb-2", stat.iconColorClass)}
                    />
                    <span
                      className={cn(
                        "text-xl font-semibold mt-auto font-inter",
                        stat.textColorClass
                      )}
                    >
                      {stat.value}
                    </span>
                    <span
                      className={cn("text-xs font-medium font-dm-sans", stat.textColorClass)}
                    >
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-medium text-brand-indigo/60 font-dm-sans uppercase tracking-wide">
                  Performance History
                </h3>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-[130px] justify-between bg-white border-brand-indigo/20 hover:bg-brand-indigo/5 text-brand-indigo rounded-lg"
                      disabled={isLoadingAudits && !conceptAudits}
                    >
                      <CalendarDays className="h-4 w-4 mr-2 text-brand-indigo/50" />
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
                  <DropdownMenuContent align="end" className="w-[130px] bg-white border-brand-indigo/10">
                    {TIME_RANGE_OPTIONS.map((option) => (
                      <DropdownMenuItem
                        key={option.value}
                        onClick={() => {
                          if (timeRange !== option.value) {
                            setTimeRange(option.value);
                          }
                        }}
                        disabled={isLoadingAudits}
                        className="text-brand-indigo hover:bg-brand-indigo/5"
                      >
                        {option.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="h-[300px] p-4 bg-brand-indigo/5 rounded-xl border border-brand-indigo/10 relative">
                {isLoadingAudits && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10 rounded-xl">
                    <Loader2 className="h-8 w-8 animate-spin text-brand-green" />
                  </div>
                )}
                {!isLoadingAudits && auditsError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10 rounded-xl p-4">
                    <Alert variant="destructive" className="w-full max-w-md bg-red-50 border-red-200 rounded-xl">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      <AlertTitle className="text-red-700 font-inter">Error Loading Chart</AlertTitle>
                      <AlertDescription className="text-red-600 font-dm-sans">
                        {formatError(
                          auditsError instanceof Error
                            ? auditsError.message
                            : String(auditsError)
                        )}
                        <Button
                          variant="link"
                          size="sm"
                          onClick={() => refetchAudits()}
                          className="p-0 h-auto ml-1 text-brand-green"
                        >
                          Retry
                        </Button>
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
                {!isLoadingAudits &&
                  !auditsError &&
                  (!conceptAudits || conceptAudits.length === 0) && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-0 rounded-xl">
                      <LineChartIcon className="h-12 w-12 text-brand-indigo/20 mb-2" />
                      <p className="text-sm text-brand-indigo/50 font-dm-sans">
                        No performance data available
                      </p>
                      <p className="text-xs text-brand-indigo/30 font-dm-sans">
                        for the selected time range.
                      </p>
                    </div>
                  )}
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
