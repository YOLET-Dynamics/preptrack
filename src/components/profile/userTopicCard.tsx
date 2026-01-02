"use client";

import React from "react";
import { UserTopic } from "@/models/profile/userTopic";
import { Layers, HelpCircle, ArrowRight, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUserTopicStore } from "@/store/userTopicStore";
import { cn } from "@/lib/utils";

interface UserTopicCardProps {
  topicData: UserTopic;
}

export const UserTopicCard = ({ topicData }: UserTopicCardProps) => {
  const router = useRouter();
  const { setUserTopic } = useUserTopicStore();
  const percentageComplete = Number(topicData.recent_eval) || 0;
  const conceptsAttempted = topicData.concepts_attempted || 0;
  const totalConcepts = topicData.total_concepts || 0;
  const questionsAttempted = topicData.questions_attempted || 0;

  const handleNavigate = () => {
    if (topicData.topic.id) {
      setUserTopic(topicData);
      router.push(`/dashboard/track/topic`);
    }
  };

  // Determine performance color
  const getPerformanceColor = () => {
    if (percentageComplete >= 70) return "text-brand-green";
    if (percentageComplete >= 40) return "text-amber-500";
    return "text-blue-500";
  };

  const getPerformanceGradient = () => {
    if (percentageComplete >= 70) return "from-brand-green to-emerald-500";
    if (percentageComplete >= 40) return "from-amber-400 to-amber-500";
    return "from-blue-500 to-indigo-500";
  };

  return (
    <div
      onClick={handleNavigate}
      className={cn(
        "group relative overflow-hidden rounded-2xl bg-white border border-brand-indigo/10 p-5 cursor-pointer transition-all duration-300",
        "hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1"
      )}
    >
      {/* Gradient overlay on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: "linear-gradient(135deg, rgba(59, 130, 246, 0.03) 0%, transparent 50%)",
        }}
      />

      {/* Header */}
      <div className="relative z-10 flex items-start justify-between gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-brand-indigo font-inter line-clamp-2 group-hover:text-blue-600 transition-colors">
            {topicData.topic.name}
          </h3>
        </div>
        <div className="flex-shrink-0 flex items-center gap-1 text-brand-indigo/40 group-hover:text-blue-500 transition-colors">
          <span className="text-xs font-medium font-dm-sans">Details</span>
          <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>

      {/* Score Display */}
      <div className="relative z-10 flex items-center gap-4 mb-5">
        <div className="relative w-20 h-20 flex-shrink-0">
          {/* Background circle */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="40"
              cy="40"
              r="34"
              stroke="currentColor"
              strokeWidth="6"
              fill="none"
              className="text-brand-indigo/10"
            />
            <circle
              cx="40"
              cy="40"
              r="34"
              stroke="url(#progressGradient)"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${percentageComplete * 2.136} 213.6`}
              className="transition-all duration-500"
            />
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#6366F1" />
              </linearGradient>
            </defs>
          </svg>
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={cn("text-xl font-bold font-inter", getPerformanceColor())}>
              {percentageComplete.toFixed(0)}%
            </span>
          </div>
        </div>

        <div className="flex-1 space-y-3">
          {/* Concepts stat */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-50">
              <Layers className="h-4 w-4 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-brand-indigo font-inter">
                {conceptsAttempted}/{totalConcepts}
              </p>
              <p className="text-xs text-brand-indigo/50 font-dm-sans">Concepts</p>
            </div>
          </div>

          {/* Questions stat */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-brand-green/10">
              <HelpCircle className="h-4 w-4 text-brand-green" />
            </div>
            <div>
              <p className="text-sm font-semibold text-brand-indigo font-inter">
                {questionsAttempted}
              </p>
              <p className="text-xs text-brand-indigo/50 font-dm-sans">Questions Done</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-brand-indigo/40 font-dm-sans">Progress</span>
          <div className="flex items-center gap-1 text-xs text-brand-indigo/50 font-dm-sans">
            <TrendingUp className="h-3 w-3" />
            <span>Keep going!</span>
          </div>
        </div>
        <div className="h-2 bg-brand-indigo/5 rounded-full overflow-hidden">
          <div
            className={cn("h-full rounded-full bg-gradient-to-r transition-all duration-500", getPerformanceGradient())}
            style={{ width: `${percentageComplete}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default UserTopicCard;
