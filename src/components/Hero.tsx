"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Route,
  FileText,
  Sparkles,
  BarChart,
  ClipboardCheck,
  CheckCircle2,
  Zap,
  Target,
  Brain,
} from "lucide-react";
import ScrollingConcepts from "./ScrollingConcepts";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-screen pt-24 sm:pt-28 md:pt-32 pb-12 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        {/* Gradient mesh background - adjusted for mobile */}
        <div className="absolute top-0 left-0 sm:left-1/4 w-[300px] sm:w-[400px] md:w-[600px] h-[300px] sm:h-[400px] md:h-[600px] bg-brand-green/10 rounded-full blur-3xl animate-pulse-glow" />
        <div
          className="absolute bottom-1/4 right-0 sm:right-1/4 w-[250px] sm:w-[350px] md:w-[500px] h-[250px] sm:h-[350px] md:h-[500px] bg-brand-indigo/5 rounded-full blur-3xl animate-pulse-glow"
          style={{ animationDelay: "2s" }}
        />

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.015] md:opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(to right, #223843 1px, transparent 1px), linear-gradient(to bottom, #223843 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="px-5 sm:px-6 md:px-12 lg:px-18 mx-auto max-w-7xl">
        {/* Main Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center max-w-4xl mx-auto mb-5 sm:mb-8"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.15] sm:leading-[1.1] tracking-tight font-inter text-brand-indigo">
            Master Radiation Therapy
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>
            <span className="relative inline-block">
              <span className="text-brand-green">with Precision</span>
              <svg
                className="absolute -bottom-1 sm:-bottom-2 left-0 w-full"
                height="6"
                viewBox="0 0 200 8"
                fill="none"
                preserveAspectRatio="none"
              >
                <path
                  d="M2 6C50 2 150 2 198 6"
                  stroke="#83C88C"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>
        </motion.div>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl lg:text-2xl text-brand-indigo/60 max-w-xl md:max-w-2xl mx-auto text-center mb-8 sm:mb-12 font-dm-sans leading-relaxed px-2"
        >
          The intelligent learning platform that adapts to you. Ace your exams
          with personalized study paths and instant feedback.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-10 sm:mb-16 px-4 sm:px-0"
        >
          <Link href="/signup" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto group bg-brand-indigo text-white hover:bg-brand-indigo/90 transition-all duration-300 hover:scale-105 font-dm-sans font-medium px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg rounded-full shadow-lg shadow-brand-indigo/20">
              Start Learning Free
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="#features" className="w-full sm:w-auto">
            <Button
              variant="outline"
              className="w-full sm:w-auto border-brand-indigo/20 text-brand-indigo hover:bg-brand-indigo/5 font-dm-sans font-medium px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg rounded-full"
            >
              See How It Works
            </Button>
          </Link>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-10 lg:gap-12 mb-10 sm:mb-16 text-brand-indigo/50"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-brand-green" />
            <span className="text-xs sm:text-sm font-dm-sans">
              Expert-Created Content
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-brand-green" />
            <span className="text-xs sm:text-sm font-dm-sans">
              Adaptive Learning
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 sm:w-5 sm:h-5 text-brand-green" />
            <span className="text-xs sm:text-sm font-dm-sans">
              Exam-Focused
            </span>
          </div>
        </motion.div>

        {/* Feature Cards Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="relative"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 max-w-5xl mx-auto">
            <FeatureCard
              icon={Route}
              title="Adaptive Learning Paths"
              description="AI-powered routes that evolve with your progress"
              gradient="from-emerald-500/10 to-teal-500/10"
              delay={0}
            />
            <FeatureCard
              icon={Brain}
              title="Smart Question Bank"
              description="10,000+ questions targeting your weak areas"
              gradient="from-blue-500/10 to-indigo-500/10"
              delay={0.1}
            />
            <FeatureCard
              icon={BarChart}
              title="Progress Analytics"
              description="Real-time insights into your performance"
              gradient="from-purple-500/10 to-pink-500/10"
              delay={0.2}
            />
            <FeatureCard
              icon={FileText}
              title="Bite-Sized Lessons"
              description="Master complex topics in focused sessions"
              gradient="from-orange-500/10 to-amber-500/10"
              delay={0.3}
            />
            <FeatureCard
              icon={ClipboardCheck}
              title="Exam Simulation"
              description="Realistic mock exams with instant scoring"
              gradient="from-rose-500/10 to-red-500/10"
              delay={0.4}
            />
            <FeatureCard
              icon={Sparkles}
              title="Instant Feedback"
              description="Learn from mistakes immediately"
              gradient="from-cyan-500/10 to-sky-500/10"
              delay={0.5}
            />
          </div>
        </motion.div>

        {/* Scrolling Concepts */}
        <ScrollingConcepts />
      </div>
    </section>
  );
}

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  gradient: string;
  delay: number;
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  gradient,
  delay,
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 + delay }}
      whileHover={{ y: -5, scale: 1.02 }}
      className={`group relative p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-br ${gradient} border border-brand-indigo/5 hover:border-brand-green/30 backdrop-blur-sm transition-all duration-300 cursor-pointer`}
    >
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-white shadow-sm group-hover:shadow-md transition-shadow flex-shrink-0">
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-brand-indigo group-hover:text-brand-green transition-colors" />
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold text-brand-indigo font-inter mb-0.5 sm:mb-1 text-sm sm:text-base">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-brand-indigo/60 font-dm-sans leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
