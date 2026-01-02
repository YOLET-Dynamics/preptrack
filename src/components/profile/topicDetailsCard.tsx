"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircularProgress } from "@/components/CircularProgress";
import { Clock, HelpCircle, CheckCircle, XCircle } from "lucide-react";
import { UserTopic } from "@/models/profile/userTopic";
import { cn } from "@/lib/utils";

interface TopicDetailsCardProps {
  topicData: UserTopic | null | undefined;
}

interface StatDisplayProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  bgColorClass: string;
  textColorClass: string;
  iconColorClass: string;
}

const StatDisplay = ({
  title,
  value,
  icon,
  bgColorClass,
  textColorClass,
  iconColorClass,
}: StatDisplayProps) => (
  <div
    className={cn(
      "rounded-xl p-4 transition-colors duration-200 border border-brand-indigo/5",
      bgColorClass
    )}
  >
    <div className="flex items-start justify-between mb-1">
      <span className={cn("text-xl font-semibold font-inter", textColorClass)}>
        {value}
      </span>
      <div className={cn("p-1.5 rounded-lg", bgColorClass)}>
        {React.isValidElement(icon) &&
          React.cloneElement(icon as React.ReactElement<any>, {
            className: cn("h-5 w-5", iconColorClass),
          })}
      </div>
    </div>
    <span className={cn("text-sm font-medium font-dm-sans", textColorClass)}>{title}</span>
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

  const stats: Omit<StatDisplayProps, "value">[] = [
    {
      title: "Initial Score",
      bgColorClass: "bg-blue-50",
      icon: <Clock />,
      textColorClass: "text-blue-700",
      iconColorClass: "text-blue-500",
    },
    {
      title: "Questions Done",
      bgColorClass: "bg-amber-50",
      icon: <HelpCircle />,
      textColorClass: "text-amber-700",
      iconColorClass: "text-amber-500",
    },
    {
      title: "Highest Score",
      bgColorClass: "bg-green-50",
      icon: <CheckCircle />,
      textColorClass: "text-green-700",
      iconColorClass: "text-green-500",
    },
    {
      title: "Lowest Score",
      bgColorClass: "bg-red-50",
      icon: <XCircle />,
      textColorClass: "text-red-700",
      iconColorClass: "text-red-500",
    },
  ];

  const statValues = [
    `${initialEval.toFixed(1)}%`,
    topicData.questions_attempted || 0,
    `${highestScore.toFixed(1)}%`,
    `${lowestScore.toFixed(1)}%`,
  ];

  return (
    <Card className="bg-white border border-brand-indigo/10 shadow-sm rounded-2xl w-full">
      <CardHeader className="pb-4 pt-5 px-5">
        <div className="flex justify-between items-start gap-4">
          <CardTitle className="text-lg font-semibold text-brand-indigo font-inter flex-1 leading-tight">
            {topicData.topic.name}
          </CardTitle>
          <div className="flex-shrink-0">
            <CircularProgress
              progress={recentEvalPercentage / 100}
              size={80}
              strokeWidth={6}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {stats.map((stat, index) => (
            <StatDisplay key={stat.title} {...stat} value={statValues[index]} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TopicDetailsCard;
