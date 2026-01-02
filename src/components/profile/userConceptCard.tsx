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
    <div
      className={cn(
        "mb-2 flex h-10 w-10 items-center justify-center rounded-xl border border-brand-indigo/10 bg-brand-indigo/5"
      )}
    >
      {React.isValidElement(icon) &&
        React.cloneElement(icon as React.ReactElement<any>, {
          className: cn("h-5 w-5", iconColorClass),
        })}
    </div>
    <span className="text-sm font-semibold text-brand-indigo font-dm-sans">{value}</span>
    {label.map((text, i) => (
      <span key={i} className="text-[11px] leading-tight text-brand-indigo/50 font-dm-sans">
        {text}
      </span>
    ))}
  </div>
);

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

  return (
    <Card className="bg-white border border-brand-indigo/10 hover:border-brand-green/30 transition-all duration-200 rounded-xl shadow-sm hover:shadow-md group">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-3 px-4">
        <CardTitle className="text-sm font-medium text-brand-indigo line-clamp-1 pr-2 font-inter group-hover:text-brand-green transition-colors">
          {conceptData.concept?.name || "Unnamed Concept"}
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleNavigate}
          className="h-7 w-7 text-brand-green hover:bg-brand-green/10 flex-shrink-0 rounded-lg"
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
            iconColorClass="text-brand-green"
          />
          <StatItem
            icon={<List />}
            label={["Questions", "Attempted"]}
            value={questionsAttempted}
            iconColorClass="text-brand-green"
          />
          <StatItem
            icon={<BarChart3 />}
            label={["Highest", "Score"]}
            value={`${highestScore.toFixed(0)}%`}
            iconColorClass="text-brand-green"
          />
          <StatItem
            icon={<Clock />}
            label={["Avg Time"]}
            value={`${avgTime}s`}
            iconColorClass="text-brand-green"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default UserConceptCard;
