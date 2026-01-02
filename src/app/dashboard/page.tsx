"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ClipboardList,
  BookOpen,
  BarChart2,
  ArrowRight,
  Flame,
  Target,
  TrendingUp,
  Sparkles,
  Play,
  ChevronRight,
  Zap,
  Award,
} from "lucide-react";
import { useAuth } from "@/provider/AuthProvider";

const quickActions = [
  {
    href: "/dashboard/test-paths",
    label: "Practice",
    description: "Take personalized assessments",
    icon: ClipboardList,
    gradient: "from-blue-500 to-indigo-600",
    bgGradient: "from-blue-500/10 via-indigo-500/5 to-transparent",
  },
  {
    href: "/dashboard/study-guides",
    label: "Learn",
    description: "Bite-sized study guides",
    icon: BookOpen,
    gradient: "from-emerald-500 to-teal-600",
    bgGradient: "from-emerald-500/10 via-teal-500/5 to-transparent",
  },
  {
    href: "/dashboard/track",
    label: "Progress",
    description: "View your analytics",
    icon: BarChart2,
    gradient: "from-purple-500 to-pink-600",
    bgGradient: "from-purple-500/10 via-pink-500/5 to-transparent",
  },
];

const stats = [
  {
    label: "Study Streak",
    value: "0",
    unit: "days",
    icon: Flame,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    label: "Accuracy",
    value: "--",
    unit: "%",
    icon: Target,
    color: "text-brand-green",
    bgColor: "bg-brand-green/10",
  },
  {
    label: "Questions Done",
    value: "0",
    unit: "",
    icon: Zap,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    label: "Topics Mastered",
    value: "0",
    unit: "",
    icon: Award,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export default function DashboardPage() {
  const { user } = useAuth();
  const firstName = user?.user_info?.first_name || "there";

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 max-w-6xl mx-auto"
    >
      {/* Hero Welcome Section */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-indigo via-brand-indigo/95 to-brand-indigo/90 p-6 sm:p-8 md:p-10"
      >
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-green/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4" />
        
        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)`,
            backgroundSize: '30px 30px',
          }}
        />

        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-white/60 font-dm-sans text-sm sm:text-base mb-1">
                {getGreeting()},
              </p>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white font-inter">
                {firstName}! <span className="inline-block animate-wave">👋</span>
              </h1>
              <p className="text-white/70 font-dm-sans mt-2 max-w-md">
                Ready to continue your journey? Let's make today count.
              </p>
            </div>

            <Link
              href="/dashboard/study-guides"
              className="group flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-2xl px-5 py-3 transition-all duration-300 hover:scale-105"
            >
              <div className="p-2 bg-brand-green rounded-xl">
                <Play className="h-4 w-4 text-white fill-white" />
              </div>
              <div>
                <p className="text-white font-medium font-dm-sans text-sm">Continue Learning</p>
                <p className="text-white/60 text-xs font-dm-sans">Pick up where you left off</p>
              </div>
              <ChevronRight className="h-5 w-5 text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-brand-indigo/10 hover:border-brand-green/30 hover:shadow-lg hover:shadow-brand-green/5 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2.5 rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <TrendingUp className="h-4 w-4 text-brand-indigo/20 group-hover:text-brand-green/50 transition-colors" />
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-brand-indigo font-inter">
                  {stat.value}
                  <span className="text-lg text-brand-indigo/40 ml-0.5">{stat.unit}</span>
                </p>
                <p className="text-xs sm:text-sm text-brand-indigo/50 font-dm-sans mt-1">
                  {stat.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg sm:text-xl font-semibold text-brand-indigo font-inter">
            Quick Actions
          </h2>
          <Sparkles className="h-5 w-5 text-brand-green/50" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <Link key={action.href} href={action.href} className="block group">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${action.bgGradient} border border-brand-indigo/5 group-hover:border-brand-green/30 p-5 sm:p-6 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl`}
              >
                {/* Gradient orb */}
                <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${action.gradient} rounded-full opacity-10 blur-2xl group-hover:opacity-20 transition-opacity`} />

                <div className="relative z-10">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${action.gradient} mb-4 shadow-lg`}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  
                  <h3 className="font-semibold text-brand-indigo font-inter text-lg mb-1 group-hover:text-brand-green transition-colors">
                    {action.label}
                  </h3>
                  <p className="text-sm text-brand-indigo/60 font-dm-sans mb-4">
                    {action.description}
                  </p>

                  <div className="flex items-center text-brand-indigo/40 group-hover:text-brand-green text-sm font-medium font-dm-sans transition-colors">
                    Get started
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Daily Goal & Motivation */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Daily Goal Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-brand-green/10 via-brand-green/5 to-transparent rounded-2xl p-6 border border-brand-green/20">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-green/20 rounded-full blur-3xl" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-brand-green/20 rounded-xl">
                <Target className="h-5 w-5 text-brand-green" />
              </div>
              <h3 className="font-semibold text-brand-indigo font-inter">Today's Goal</h3>
            </div>

            <div className="mb-4">
              <div className="flex items-end gap-2 mb-2">
                <span className="text-4xl font-bold text-brand-indigo font-inter">0</span>
                <span className="text-brand-indigo/50 font-dm-sans mb-1">/ 5 questions</span>
              </div>
              <div className="h-3 bg-brand-indigo/10 rounded-full overflow-hidden">
                <div className="h-full w-0 bg-gradient-to-r from-brand-green to-brand-green/80 rounded-full transition-all duration-500" />
              </div>
            </div>

            <p className="text-sm text-brand-indigo/60 font-dm-sans">
              Complete 5 questions today to build your streak! 🔥
            </p>
          </div>
        </div>

        {/* Motivation Card */}
        <div className="relative overflow-hidden bg-white rounded-2xl p-6 border border-brand-indigo/10 shadow-sm">
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-2xl" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-purple-500/10 rounded-xl">
                <Sparkles className="h-5 w-5 text-purple-500" />
              </div>
              <h3 className="font-semibold text-brand-indigo font-inter">Daily Inspiration</h3>
            </div>

            <blockquote className="text-lg text-brand-indigo font-inter leading-relaxed mb-3">
              "The expert in anything was once a beginner."
            </blockquote>
            <p className="text-sm text-brand-indigo/50 font-dm-sans">
              — Helen Hayes
            </p>
          </div>
        </div>
      </motion.div>

      {/* CSS for wave animation */}
      <style jsx global>{`
        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(20deg); }
          75% { transform: rotate(-15deg); }
        }
        .animate-wave {
          animation: wave 1.5s ease-in-out infinite;
          transform-origin: 70% 70%;
          display: inline-block;
        }
      `}</style>
    </motion.div>
  );
}
