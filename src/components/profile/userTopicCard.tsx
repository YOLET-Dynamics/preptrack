"use client";

import React from "react";
import { UserTopic } from "@/models/profile/userTopic";
import { Layers, HelpCircle, ArrowRight } from "lucide-react";
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
    <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-indigo/5">
      {icon}
    </div>
    <span className="text-xs font-medium text-brand-indigo font-dm-sans">{title}</span>
    {subtitle && <span className="text-[11px] text-brand-indigo/50 font-dm-sans">{subtitle}</span>}
    <span className="mt-0.5 text-xs font-semibold text-brand-indigo/80 font-dm-sans">{value}</span>
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
    <Card className="bg-white border border-brand-indigo/10 hover:border-brand-green/30 transition-all duration-200 rounded-xl shadow-sm hover:shadow-md group">
      <CardHeader className="pb-3 pt-4 px-4">
        <CardTitle className="text-sm font-medium text-brand-indigo line-clamp-1 font-inter group-hover:text-brand-green transition-colors">
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
                icon={<Layers className="h-5 w-5 text-brand-green" />}
                title="Concepts"
                subtitle="Attempted"
                value={`${topicData.concepts_attempted}/${topicData.total_concepts}`}
              />
              <StatItem
                icon={<HelpCircle className="h-5 w-5 text-brand-green" />}
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
              className="h-8 px-3 py-1 text-xs text-brand-green hover:bg-brand-green/10 rounded-lg font-dm-sans"
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
