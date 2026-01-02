"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  Brain, 
  Target, 
  Lightbulb, 
  TrendingUp,
  Layers,
  Award
} from "lucide-react";

export default function Features() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section
      id="features"
      className="relative py-16 sm:py-20 md:py-28 lg:py-32 overflow-hidden"
      ref={ref}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-brand-green/5 to-white -z-10" />
      
      <div className="px-5 sm:px-6 md:px-12 lg:px-18 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 md:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-brand-indigo/5 border border-brand-indigo/10 mb-4 sm:mb-6">
            <span className="text-xs sm:text-sm font-medium text-brand-indigo font-dm-sans">
              Why Students Love Us
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-inter text-brand-indigo mb-4 sm:mb-6 leading-tight">
            Everything You Need to
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>
            <span className="text-brand-green">Pass Your Exams</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-brand-indigo/60 font-dm-sans px-2">
            Our platform combines cutting-edge AI with expert-crafted content
            to give you the most effective learning experience possible.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          <FeatureCard
            icon={<Brain className="h-5 w-5 sm:h-6 sm:w-6 text-brand-green" />}
            title="Adaptive Question Bank"
            description="Questions that evolve with your progress, focusing on areas where you need improvement."
            delay={0.1}
            isInView={isInView}
          />
          <FeatureCard
            icon={<Target className="h-5 w-5 sm:h-6 sm:w-6 text-brand-green" />}
            title="Targeted Learning"
            description="Focus your study time on the concepts that matter most for your specific exam goals."
            delay={0.2}
            isInView={isInView}
          />
          <FeatureCard
            icon={<TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-brand-green" />}
            title="Progress Tracking"
            description="Real-time insights into your performance with detailed analytics and improvement tips."
            delay={0.3}
            isInView={isInView}
          />
          <FeatureCard
            icon={<Lightbulb className="h-5 w-5 sm:h-6 sm:w-6 text-brand-green" />}
            title="Expert Content"
            description="Curated by radiation therapy professionals with years of teaching experience."
            delay={0.4}
            isInView={isInView}
          />
          <FeatureCard
            icon={<Layers className="h-5 w-5 sm:h-6 sm:w-6 text-brand-green" />}
            title="Structured Study Guides"
            description="Comprehensive guides that break down complex topics into digestible lessons."
            delay={0.5}
            isInView={isInView}
          />
          <FeatureCard
            icon={<Award className="h-5 w-5 sm:h-6 sm:w-6 text-brand-green" />}
            title="Exam Simulations"
            description="Practice with realistic mock exams that mirror the actual test experience."
            delay={0.6}
            isInView={isInView}
          />
        </div>
      </div>
    </section>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
  isInView: boolean;
}

function FeatureCard({ icon, title, description, delay, isInView }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5 }}
    >
      <Card className="group h-full bg-white border border-brand-indigo/10 hover:border-brand-green/30 transition-all duration-300 hover:shadow-xl hover:shadow-brand-green/5">
        <CardHeader className="pb-3 sm:pb-4 p-4 sm:p-6">
          <div className="flex h-11 w-11 sm:h-14 sm:w-14 items-center justify-center rounded-xl sm:rounded-2xl bg-brand-green/10 mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
          <CardTitle className="text-base sm:text-lg md:text-xl font-inter text-brand-indigo group-hover:text-brand-green transition-colors">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <CardDescription className="text-sm sm:text-base text-brand-indigo/60 font-dm-sans leading-relaxed">
            {description}
          </CardDescription>
        </CardContent>
      </Card>
    </motion.div>
  );
}
