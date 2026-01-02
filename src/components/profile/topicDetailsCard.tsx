"use client";

import React from "react";
import { Clock, HelpCircle, CheckCircle, XCircle, TrendingUp, Award } from "lucide-react";
import { UserTopic } from "@/models/profile/userTopic";
import { cn } from "@/lib/utils";

interface TopicDetailsCardProps {
  topicData: UserTopic | null | undefined;
}

interface StatDisplayProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  gradient: string;
  iconBg: string;
  iconColor: string;
}

const StatDisplay = ({
  title,
  value,
  icon: Icon,
  gradient,
  iconBg,
  iconColor,
}: StatDisplayProps) => (
  <div
    className={cn(
      "relative overflow-hidden rounded-xl p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
      gradient
    )}
  >
    <div className="flex items-start justify-between mb-2">
      <span className="text-2xl font-bold font-inter text-brand-indigo">
        {value}
      </span>
      <div className={cn("p-2 rounded-lg", iconBg)}>
        <Icon className={cn("h-4 w-4", iconColor)} />
      </div>
    </div>
    <span className="text-sm font-medium text-brand-indigo/60 font-dm-sans">{title}</span>
  </div>
);

export const TopicDetailsCard = ({ topicData }: TopicDetailsCardProps) => {
  if (!topicData) {
    return null;
  }

  const recentEvalPercentage = Number(topicData.recent_eval) || 0;
  const initialEval = Number(topicData.initial_eval) || 0;
  const highestScore = Number(topicData.highest_question_score) || 0;
  const lowestScore = Number(topicData.lowest_question_score) || 0;
  const questionsAttempted = topicData.questions_attempted || 0;

  // Determine performance level
  const getPerformanceLevel = () => {
    if (recentEvalPercentage >= 80) return { label: "Excellent", color: "text-brand-green" };
    if (recentEvalPercentage >= 60) return { label: "Good", color: "text-blue-500" };
    if (recentEvalPercentage >= 40) return { label: "Improving", color: "text-amber-500" };
    return { label: "Needs Work", color: "text-red-500" };
  };

  const performance = getPerformanceLevel();

  const stats: StatDisplayProps[] = [
    {
      title: "Initial Score",
      value: `${initialEval.toFixed(0)}%`,
      icon: Clock,
      gradient: "bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-100",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Questions Done",
      value: questionsAttempted,
      icon: HelpCircle,
      gradient: "bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-100",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
    },
    {
      title: "Highest Score",
      value: `${highestScore.toFixed(0)}%`,
      icon: CheckCircle,
      gradient: "bg-gradient-to-br from-green-50 to-green-100/50 border border-green-100",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Lowest Score",
      value: `${lowestScore.toFixed(0)}%`,
      icon: XCircle,
      gradient: "bg-gradient-to-br from-red-50 to-red-100/50 border border-red-100",
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
    },
  ];

  return (
    <div className="bg-white border border-brand-indigo/10 shadow-sm rounded-2xl w-full overflow-hidden">
      {/* Header with gradient */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 p-6">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-1/2 w-24 h-24 bg-brand-green/20 rounded-full blur-xl translate-y-1/2" />
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold text-white font-inter mb-2 leading-tight">
              {topicData.topic.name}
            </h2>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-white/70" />
              <span className="text-white/80 text-sm font-dm-sans">
                Performance: <span className={cn("font-semibold", performance.color.replace("text-", "text-white "))}>{performance.label}</span>
              </span>
            </div>
          </div>

          {/* Score circle */}
          <div className="flex-shrink-0">
            <div className="relative w-24 h-24 bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/20">
              <div className="w-full h-full flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-white font-inter">
                  {recentEvalPercentage.toFixed(0)}
                </span>
                <span className="text-white/70 text-xs font-dm-sans">percent</span>
              </div>
              <div className="absolute -top-1 -right-1 p-1.5 bg-white rounded-lg shadow-md">
                <Award className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="p-5">
        <h3 className="text-xs font-semibold text-brand-indigo/50 uppercase tracking-wider font-inter mb-4">
          Performance Breakdown
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map((stat) => (
            <StatDisplay key={stat.title} {...stat} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopicDetailsCard;
