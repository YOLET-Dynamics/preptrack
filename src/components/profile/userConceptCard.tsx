"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserConcept } from "@/models/profile/userConcept";
import { useUserConceptStore } from "@/store/userConceptStore";
import { ArrowRight, CheckCircle, List, BarChart3, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface UserConceptCardProps {
  conceptData: UserConcept;
}

interface StatItemProps {
  icon: React.ReactNode;
  label: string[];
  value: string | number;
  iconColorClass: string;
}

const StatItem = ({ icon, label, value, iconColorClass }: StatItemProps) => (
  <div className="flex flex-col items-center text-center">
    {/* Icon */}
    <div
      className={cn(
        "mb-2 flex h-10 w-10 items-center justify-center rounded-full border border-gray-700 bg-gray-800/60",
        // Apply icon color to the icon itself
        React.isValidElement(icon) &&
          React.cloneElement(icon as React.ReactElement<any>, {
            className: cn("h-5 w-5", iconColorClass),
          })
      )}
    ></div>
    <span className="text-sm font-semibold text-gray-100">{value}</span>
    {label.map((text, i) => (
      <span key={i} className="text-[11px] leading-tight text-gray-400">
        {text}
      </span>
    ))}
  </div>
);

/**
 * Displays a card summarizing a user's performance on a specific concept.
 * Includes recent score, questions attempted, highest score, and average time.
 * Provides a button to navigate to more detailed concept analytics.
 */
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

  // --- Render Logic ---
  return (
    <Card className="bg-gray-800/60 border border-gray-700/80 hover:border-gray-600/90 transition-colors duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-3 px-4">
        <CardTitle className="text-sm font-medium text-gray-200 line-clamp-1 pr-2">
          {conceptData.concept?.name || "Unnamed Concept"}
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleNavigate}
          className="h-7 w-7 text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300 flex-shrink-0"
          aria-label="View concept details"
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardHeader>

      <CardContent className="px-4 pb-3">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          <StatItem
            icon={<CheckCircle />}
            label={["Recent"]}
            value={`${recentEval.toFixed(0)}%`}
            iconColorClass="text-emerald-400"
          />
          <StatItem
            icon={<List />}
            label={["Questions", "Attempted"]}
            value={questionsAttempted}
            iconColorClass="text-sky-400"
          />
          <StatItem
            icon={<BarChart3 />}
            label={["Highest", "Score"]}
            value={`${highestScore.toFixed(0)}%`}
            iconColorClass="text-blue-400"
          />
          <StatItem
            icon={<Clock />}
            label={["Avg Time"]}
            value={`${avgTime}s`}
            iconColorClass="text-amber-400"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default UserConceptCard;
