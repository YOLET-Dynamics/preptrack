"use client";

import React from "react";
import { UserTopic } from "@/models/profile/userTopic";
import { List, Check, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUserTopicStore } from "@/store/userTopicStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CircularProgress } from "@/components/CircularProgress";
interface StatItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  value: string;
}

const StatItem = ({ icon, title, subtitle, value }: StatItemProps) => (
  <div className="flex flex-col items-center text-center">
    <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-gray-800">
      {icon}
    </div>
    <span className="text-xs font-medium text-gray-200">{title}</span>
    {subtitle && <span className="text-[11px] text-gray-400">{subtitle}</span>}
    <span className="mt-0.5 text-xs font-semibold text-gray-300">{value}</span>
  </div>
);

interface UserTopicCardProps {
  topicData: UserTopic;
}

export const UserTopicCard = ({ topicData }: UserTopicCardProps) => {
  const router = useRouter();
  const { setUserTopic } = useUserTopicStore();
  const percentageComplete = Number(topicData.recent_eval) || 0;

  const handleNavigate = () => {
    if (topicData.topic.id) {
      setUserTopic(topicData);
      router.push(`/dashboard/track/topic`);
    }
  };

  return (
    <Card className="bg-gray-800/60 border border-gray-700/80 hover:border-gray-600/90 transition-colors duration-200">
      <CardHeader className="pb-3 pt-4 px-4">
        <CardTitle className="text-sm font-medium text-gray-200 line-clamp-1">
          {topicData.topic.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-shrink-0">
              <CircularProgress
                progress={percentageComplete / 100}
                size={80}
                strokeWidth={6}
              />
            </div>

            <div className="flex flex-grow justify-around gap-2">
              <StatItem
                icon={<List className="h-5 w-5 text-cyan-400" />}
                title="Concepts"
                subtitle="Attempted"
                value={`${topicData.concepts_attempted}/${topicData.total_concepts}`}
              />
              <StatItem
                icon={<Check className="h-5 w-5 text-teal-400" />}
                title="Questions"
                subtitle="Attempted"
                value={`${topicData.questions_attempted}`}
              />
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNavigate}
              className="h-8 px-2 py-1 text-xs text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300"
              disabled={!topicData.topic.id}
            >
              Details
              <ArrowRight className="ml-1.5 h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserTopicCard;
