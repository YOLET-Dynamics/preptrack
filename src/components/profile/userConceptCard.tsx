"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { UserConcept } from "@/models/profile/userConcept";
import { useUserConceptStore } from "@/store/userConceptStore";
import { ArrowRight, CheckCircle, List, BarChart3, Clock, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface UserConceptCardProps {
  conceptData: UserConcept;
}

export const UserConceptCard = ({ conceptData }: UserConceptCardProps) => {
  const router = useRouter();
  const { setUserConcept } = useUserConceptStore();

  const recentEval = Number(conceptData.recent_eval) || 0;
  const questionsAttempted = conceptData.questions_attempted || 0;
  const highestScore = Number(conceptData.highest_question_score) || 0;
  const avgTime = (Number(conceptData.avg_time) || 0).toFixed(1);

  const handleNavigate = () => {
    setUserConcept(conceptData);
    router.push(`/dashboard/track/concept`);
  };

  // Determine score color
  const getScoreColor = () => {
    if (recentEval >= 70) return "text-brand-green";
    if (recentEval >= 40) return "text-amber-500";
    return "text-blue-500";
  };

  const getScoreBg = () => {
    if (recentEval >= 70) return "bg-brand-green/10";
    if (recentEval >= 40) return "bg-amber-500/10";
    return "bg-blue-500/10";
  };

  return (
    <div
      onClick={handleNavigate}
      className={cn(
        "group relative overflow-hidden rounded-2xl bg-white border border-brand-indigo/10 p-4 cursor-pointer transition-all duration-300",
        "hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/5 hover:-translate-y-0.5"
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
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {/* Score badge */}
          <div className={cn("flex-shrink-0 px-3 py-1.5 rounded-lg", getScoreBg())}>
            <span className={cn("text-lg font-bold font-inter", getScoreColor())}>
              {recentEval.toFixed(0)}%
            </span>
          </div>
          <div className="flex-1 min-w-0 pt-0.5">
            <h3 className="text-sm font-semibold text-brand-indigo font-inter line-clamp-2 group-hover:text-blue-600 transition-colors">
              {conceptData.concept?.name || "Unnamed Concept"}
            </h3>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-brand-indigo/30 group-hover:text-blue-500 group-hover:bg-blue-50 flex-shrink-0 rounded-lg transition-colors"
          aria-label="View concept details"
        >
          <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
        </Button>
      </div>

      {/* Stats grid */}
      <div className="relative z-10 grid grid-cols-4 gap-2">
        {/* Recent Score */}
        <div className="flex flex-col items-center p-2 rounded-lg bg-brand-green/5 border border-brand-green/10">
          <CheckCircle className="h-4 w-4 text-brand-green mb-1" />
          <span className="text-xs font-semibold text-brand-indigo font-inter">{recentEval.toFixed(0)}%</span>
          <span className="text-[10px] text-brand-indigo/40 font-dm-sans">Recent</span>
        </div>

        {/* Questions */}
        <div className="flex flex-col items-center p-2 rounded-lg bg-blue-50 border border-blue-100">
          <List className="h-4 w-4 text-blue-500 mb-1" />
          <span className="text-xs font-semibold text-brand-indigo font-inter">{questionsAttempted}</span>
          <span className="text-[10px] text-brand-indigo/40 font-dm-sans">Done</span>
        </div>

        {/* Highest */}
        <div className="flex flex-col items-center p-2 rounded-lg bg-amber-50 border border-amber-100">
          <BarChart3 className="h-4 w-4 text-amber-500 mb-1" />
          <span className="text-xs font-semibold text-brand-indigo font-inter">{highestScore.toFixed(0)}%</span>
          <span className="text-[10px] text-brand-indigo/40 font-dm-sans">Best</span>
        </div>

        {/* Avg Time */}
        <div className="flex flex-col items-center p-2 rounded-lg bg-purple-50 border border-purple-100">
          <Clock className="h-4 w-4 text-purple-500 mb-1" />
          <span className="text-xs font-semibold text-brand-indigo font-inter">{avgTime}s</span>
          <span className="text-[10px] text-brand-indigo/40 font-dm-sans">Avg</span>
        </div>
      </div>

      {/* Trend indicator */}
      <div className="relative z-10 flex items-center justify-center gap-1 mt-3 pt-3 border-t border-brand-indigo/5">
        <TrendingUp className="h-3 w-3 text-brand-green" />
        <span className="text-[11px] text-brand-indigo/40 font-dm-sans">
          View detailed analytics
        </span>
      </div>
    </div>
  );
};

export default UserConceptCard;
