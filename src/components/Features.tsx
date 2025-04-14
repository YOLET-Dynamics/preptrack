"use client";
import {
  Brain,
  LineChart,
  Activity,
  Stethoscope,
  BookOpen,
  Atom,
} from "lucide-react";
import { useInView } from "framer-motion";
import { useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Features() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      id="features"
      className="w-full py-16 md:py-24 lg:py-32 border-t border-white/5 overflow-hidden"
    >
      <div className="px-8 md:px-24">
        <div
          className="flex flex-col items-center justify-center space-y-4 text-center mb-16"
          style={{
            opacity: isInView ? 1 : 0,
            transform: isInView ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.5s ease-out 0.2s",
          }}
        >
          <div className="space-y-2">
            <div className="inline-block rounded-full bg-gradient-to-r from-cyan-400/20 to-teal-400/20 px-4 py-1 text-xs text-cyan-400 font-funnel-sans">
              Features
            </div>
            <h2 className="text-4xl font-funnel-sans tracking-tight sm:text-4xl md:text-5xl">
              Personalized Learning Journey
            </h2>
            <p className="max-w-[700px] text-gray-400 md:text-lg font-funnel-sans">
              PrepTrack adapts to your learning style, focusing on what you need
              most.
            </p>
          </div>
        </div>
        <div
          className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2 lg:grid-cols-3"
          style={{
            opacity: isInView ? 1 : 0,
            transform: isInView ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.5s ease-out 0.4s",
          }}
        >
          <FeatureCard
            icon={<Brain className="h-5 w-5 text-cyan-400" />}
            title="Adaptive Question Bank"
            description="Questions that evolve with your progress, focusing on areas where you need improvement."
            delay={0.3}
            isInView={isInView}
          />
          <FeatureCard
            icon={<LineChart className="h-5 w-5 text-cyan-400" />}
            title="Performance Analytics"
            description="Detailed insights into your progress with visual analytics to track improvement over time."
            delay={0.4}
            isInView={isInView}
          />
          <FeatureCard
            icon={<Activity className="h-5 w-5 text-cyan-400" />}
            title="Bite-sized Learning"
            description="Concise, focused content modules designed for efficient learning and better retention."
            delay={0.5}
            isInView={isInView}
          />
          <FeatureCard
            icon={<Stethoscope className="h-5 w-5 text-cyan-400" />}
            title="Clinical Relevance"
            description="Content aligned with real-world clinical scenarios you'll encounter in radiation therapy practice."
            delay={0.6}
            isInView={isInView}
          />
          <FeatureCard
            icon={<BookOpen className="h-5 w-5 text-cyan-400" />}
            title="Personalized Study Path"
            description="AI-driven recommendations that create a custom learning journey based on your performance."
            delay={0.7}
            isInView={isInView}
          />
          <FeatureCard
            icon={<Atom className="h-5 w-5 text-cyan-400" />}
            title="Radiation Physics Mastery"
            description="Simplified explanations of complex radiation physics concepts with interactive visualizations."
            delay={0.8}
            isInView={isInView}
          />
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  delay,
  isInView,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
  isInView: boolean;
}) {
  return (
    <Card
      className="group relative bg-white/[0.03] border-white/5 backdrop-blur-sm transition-all duration-300 hover:border-white/10 hover:bg-white/[0.05] hover:translate-y-[-5px] overflow-hidden"
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? "translateY(0)" : "translateY(20px)",
        transition: `all 0.5s ease-out ${delay}s`,
      }}
    >
      {/* Gradient Border Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-teal-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Content */}
      <div className="relative">
        <CardHeader className="pb-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-cyan-400/10 to-teal-400/10 mb-4 group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
          <CardTitle className="text-lg font-funnel-sans tracking-tight text-white">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-sm text-gray-400 font-funnel-sans group-hover:text-gray-300 transition-colors duration-300">
            {description}
          </CardDescription>
        </CardContent>
      </div>
    </Card>
  );
}
