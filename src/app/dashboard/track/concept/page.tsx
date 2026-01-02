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
  TrendingUp,
  Sparkles,
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
  gradient: string;
  iconBg: string;
  iconColor: string;
}

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
        gradient: "bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-100",
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
      },
      {
        label: "Average Time",
        value: `${avgTime}s`,
        icon: Clock,
        gradient: "bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-100",
        iconBg: "bg-amber-100",
        iconColor: "text-amber-600",
      },
      {
        label: "Highest Score",
        value: `${highestScore.toFixed(0)}%`,
        icon: Trophy,
        gradient: "bg-gradient-to-br from-green-50 to-green-100/50 border border-green-100",
        iconBg: "bg-green-100",
        iconColor: "text-green-600",
      },
      {
        label: "Lowest Score",
        value: `${lowestScore.toFixed(0)}%`,
        icon: AlertCircle,
        gradient: "bg-gradient-to-br from-red-50 to-red-100/50 border border-red-100",
        iconBg: "bg-red-100",
        iconColor: "text-red-600",
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
          borderColor: "#3B82F6",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          tension: 0.4,
          pointBackgroundColor: "#3B82F6",
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: "#3B82F6",
          pointHoverBorderColor: "#ffffff",
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
          borderColor: "rgba(255,255,255,0.1)",
          borderWidth: 1,
          padding: 12,
          cornerRadius: 8,
          callbacks: {
            label: (context) =>
              `Score: ${context.formattedValue}%`,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          grid: { color: "rgba(34, 56, 67, 0.06)" },
          ticks: {
            color: "rgba(34, 56, 67, 0.4)",
            stepSize: 25,
            callback: (value) => `${value}%`,
            font: { size: 11 },
          },
          border: { display: false },
        },
        x: {
          grid: { display: false },
          ticks: {
            color: "rgba(34, 56, 67, 0.4)",
            maxRotation: 0,
            autoSkip: true,
            maxTicksLimit: timeRange === "month" ? 15 : timeRange === "year" ? 12 : 7,
            font: { size: 11 },
          },
          border: { display: false },
        },
      },
      interaction: { intersect: false, mode: "index" },
    };

    return { evaluationData, statsData, chartData, chartOptions };
  }, [userConcept, conceptAudits, timeRange]);

  const showSkeleton = !userConcept;
  const currentScore = Number(userConcept?.recent_eval) || 0;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 space-y-6">
      {/* Back button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.back()}
        className="text-brand-indigo/60 hover:text-brand-indigo hover:bg-brand-indigo/5 rounded-xl font-dm-sans -ml-2"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Topic
      </Button>

      {showSkeleton ? (
        <ConceptDetailSkeleton />
      ) : !userConcept.concept ? (
        <Alert variant="destructive" className="bg-red-50 border-red-200/50 rounded-2xl">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="text-red-700 font-inter">Error</AlertTitle>
          <AlertDescription className="text-red-600 font-dm-sans">
            Incomplete concept data found. Please navigate back and select a concept again.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-6">
          {/* Header Card */}
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 rounded-2xl p-6 sm:p-8">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-green/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4" />

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-white/70 text-sm font-dm-sans mb-2">
                  <Sparkles className="h-4 w-4" />
                  <span>Concept Analysis</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white font-inter mb-3">
                  {userConcept.concept.name}
                </h1>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-lg">
                    <TrendingUp className="h-4 w-4 text-brand-green" />
                    <span className="text-white/90 text-sm font-medium font-dm-sans">
                      {currentScore >= 70 ? "On Track" : currentScore >= 40 ? "Improving" : "Keep Practicing"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Score display */}
              <div className="flex-shrink-0">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
                  <div className="text-center">
                    <div className="flex items-baseline justify-center">
                      <span className="text-5xl font-bold text-white font-inter">
                        {currentScore.toFixed(0)}
                      </span>
                      <span className="text-2xl text-white/70 ml-1">%</span>
                    </div>
                    <p className="text-white/60 text-sm font-dm-sans mt-1">Current Score</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Evaluation Progress */}
          <div className="bg-white border border-brand-indigo/10 rounded-2xl p-5 sm:p-6">
            <h3 className="text-xs font-semibold text-brand-indigo/50 uppercase tracking-wider font-inter mb-4">
              Score Progression
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {evaluationData.map((item, index) => (
                <div
                  key={item.label}
                  className={cn(
                    "text-center p-4 rounded-xl bg-gradient-to-br from-brand-indigo/5 to-transparent border border-brand-indigo/5",
                    index === 2 && "from-blue-50 to-transparent border-blue-100"
                  )}
                >
                  <div className="text-xs text-brand-indigo/50 mb-1 font-dm-sans uppercase tracking-wide">
                    {item.label}
                  </div>
                  <div className={cn(
                    "text-2xl font-bold font-inter",
                    index === 2 ? "text-blue-600" : "text-brand-indigo"
                  )}>
                    {item.value.toFixed(0)}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="bg-white border border-brand-indigo/10 rounded-2xl p-5 sm:p-6">
            <h3 className="text-xs font-semibold text-brand-indigo/50 uppercase tracking-wider font-inter mb-4">
              Key Statistics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {statsData.map((stat) => (
                <div
                  key={stat.label}
                  className={cn(
                    "rounded-xl p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
                    stat.gradient
                  )}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-2xl font-bold text-brand-indigo font-inter">
                      {stat.value}
                    </span>
                    <div className={cn("p-2 rounded-lg", stat.iconBg)}>
                      <stat.icon className={cn("h-4 w-4", stat.iconColor)} />
                    </div>
                  </div>
                  <span className="text-sm text-brand-indigo/60 font-dm-sans">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Chart */}
          <div className="bg-white border border-brand-indigo/10 rounded-2xl p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-xl">
                  <LineChartIcon className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-brand-indigo font-inter">
                    Performance History
                  </h3>
                  <p className="text-xs text-brand-indigo/50 font-dm-sans">
                    Track your progress over time
                  </p>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-[140px] justify-between bg-white border-brand-indigo/20 hover:bg-brand-indigo/5 text-brand-indigo rounded-xl"
                    disabled={isLoadingAudits && !conceptAudits}
                  >
                    <CalendarDays className="h-4 w-4 mr-2 text-blue-500" />
                    <span className="font-dm-sans">
                      {TIME_RANGE_OPTIONS.find((opt) => opt.value === timeRange)?.label}
                    </span>
                    {isLoadingAudits ? (
                      <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                    ) : (
                      <ChevronDown className="h-4 w-4 ml-2 opacity-50" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[140px] bg-white border-brand-indigo/10 rounded-xl">
                  {TIME_RANGE_OPTIONS.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => {
                        if (timeRange !== option.value) {
                          setTimeRange(option.value);
                        }
                      }}
                      disabled={isLoadingAudits}
                      className="text-brand-indigo hover:bg-brand-indigo/5 font-dm-sans rounded-lg"
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="h-[300px] p-4 bg-gradient-to-br from-blue-50/50 to-transparent rounded-xl border border-blue-100/50 relative">
              {isLoadingAudits && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10 rounded-xl backdrop-blur-sm">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    <span className="text-sm text-brand-indigo/50 font-dm-sans">Loading data...</span>
                  </div>
                </div>
              )}
              {!isLoadingAudits && auditsError && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10 rounded-xl p-4">
                  <Alert variant="destructive" className="w-full max-w-md bg-red-50 border-red-200/50 rounded-xl">
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
                    <div className="p-4 bg-blue-50 rounded-2xl mb-4">
                      <LineChartIcon className="h-10 w-10 text-blue-400" />
                    </div>
                    <p className="text-base font-medium text-brand-indigo font-inter mb-1">
                      No data yet
                    </p>
                    <p className="text-sm text-brand-indigo/50 font-dm-sans">
                      for the selected time range
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
        </div>
      )}
    </div>
  );
}

const ConceptDetailSkeleton = () => (
  <div className="space-y-6">
    {/* Header skeleton */}
    <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl p-6 sm:p-8">
      <Skeleton className="h-4 w-24 bg-white/20 rounded-lg mb-3" />
      <Skeleton className="h-8 w-2/3 bg-white/20 rounded-lg mb-4" />
      <Skeleton className="h-6 w-32 bg-white/20 rounded-lg" />
    </div>

    {/* Stats skeleton */}
    <div className="bg-white border border-brand-indigo/10 rounded-2xl p-5">
      <Skeleton className="h-4 w-32 bg-brand-indigo/5 rounded mb-4" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl bg-brand-indigo/5" />
        ))}
      </div>
    </div>

    {/* Chart skeleton */}
    <div className="bg-white border border-brand-indigo/10 rounded-2xl p-5">
      <Skeleton className="h-4 w-40 bg-brand-indigo/5 rounded mb-4" />
      <Skeleton className="h-[300px] rounded-xl bg-brand-indigo/5" />
    </div>
  </div>
);
