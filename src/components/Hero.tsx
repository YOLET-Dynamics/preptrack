"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  ArrowRight,
  TrendingUp,
  UserCheck,
  BookOpen,
  Route,
  FileText,
  Sparkles,
  BarChart,
  ClipboardCheck,
} from "lucide-react";
import ScrollingConcepts from "./ScrollingConcepts";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="min-h-screen pt-18 px-6 md:px-18 mx-auto flex flex-col justify-center">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="font-funnel-sans inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500/10 to-teal-500/10 border border-cyan-500/20 text-sm text-cyan-400">
            <span>Trusted by 1000+ students</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight font-funnel-sans">
            Precision Learning <br />
            <span className="bg-gradient-to-r from-cyan-400 to-teal-500 bg-clip-text text-transparent">
              for Radiation Therapy
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-300 max-w-xl font-funnel-sans">
            PrepTrack helps you learn and ace your radiation therapy exams like
            never before.
          </p>

          <div className="pt-4">
            <Link href="/signup">
              <Button className="hidden md:flex bg-gradient-to-r from-cyan-400 to-teal-400 text-black hover:opacity-90 transition-all duration-300 hover:scale-105 font-funnel-sans md:px-8 md:py-3 md:text-lg">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="relative h-[500px] md:h-[600px]">
          <FloatingCards />
        </div>
      </div>
      <ScrollingConcepts />
    </section>
  );
}

function FloatingCards() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const cards = [
    {
      title: "Adaptive Learning Paths",
      description: "Personalized routes based on your performance.",
      icon: Route,
      position: "top-0 left-8",
      rotation: "rotate-3",
    },
    {
      title: "Bite-Sized Study Guides",
      description: "Master complex topics with focused lessons.",
      icon: FileText,
      position: "top-12 right-8",
      rotation: "-rotate-6",
    },
    {
      title: "Instant Quizzes",
      description: "Reinforce learning with immediate feedback.",
      icon: Sparkles,
      position: "top-32 left-16",
      rotation: "rotate-6",
    },
    {
      title: "Progress Analytics",
      description: "Track your strengths and weaknesses.",
      icon: BarChart,
      position: "top-48 right-12",
      rotation: "-rotate-3",
    },
    {
      title: "Exam Simulation",
      description: "Practice with timed, realistic mock exams.",
      icon: ClipboardCheck,
      position: "top-64 left-8",
      rotation: "rotate-2",
    },
  ];

  return (
    <div className="relative w-full h-full">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={index}
            className={`absolute ${card.position} ${card.rotation} w-64 md:w-72 min-w-[250px] p-6 rounded-xl
                       bg-gray-900/80 border border-gray-700 hover:border-gray-600
                       shadow-md transition-all duration-300 cursor-pointer z-10`}
            style={{
              zIndex: hoveredCard === index ? 20 : 10,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: hoveredCard === index ? 1.03 : 1,
              boxShadow:
                hoveredCard === index
                  ? "0 10px 15px -3px rgba(0, 0, 0, 0.15), 0 4px 6px -4px rgba(0, 0, 0, 0.1)"
                  : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.06)",
            }}
            transition={{ delay: index * 0.15, duration: 0.3 }}
            onMouseEnter={() => setHoveredCard(index)}
            onMouseLeave={() => setHoveredCard(null)}
            whileHover={{ y: -3 }}
          >
            <div className="flex items-center mb-3">
              <Icon className="w-5 h-5 mr-3 text-cyan-400 flex-shrink-0" />
              <h3 className="text-lg font-bold text-white font-funnel-sans">
                {card.title}
              </h3>
            </div>
            <p className="text-gray-300 text-sm font-funnel-sans pl-8">
              {card.description}
            </p>
          </motion.div>
        );
      })}

      <div className="absolute top-1/4 left-1/3 w-32 h-32 rounded-full bg-cyan-500/10 blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/3 w-40 h-40 rounded-full bg-teal-500/10 blur-3xl"></div>
    </div>
  );
}
