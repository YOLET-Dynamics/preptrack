"use client";
import { Atom, Brain, LineChart, Activity, Target, GraduationCap, BrainCircuit, BookOpen } from "lucide-react";
import { useRef, useState } from "react";

export default function Differentiator() {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      title: "Specialized for Radiation Therapy",
      description: "Unlike generic test prep apps, PrepTrack is designed exclusively for radiation therapy certification.",
      icon: <Atom className="h-8 w-8 text-cyan-400 mx-auto group-hover:scale-110 transition-transform duration-300" />,
      listIcon: <Target className="h-5 w-5 flex-none text-cyan-400" />,
      cardTitle: "Radiation Therapy Focus",
      cardDescription: "Specialized content created specifically for radiation therapy certification exams"
    },
    {
      title: "Created by Medical Physicists",
      description: "Developed in collaboration with certified radiation therapists and medical physicists.",
      icon: <Brain className="h-8 w-8 text-cyan-400 mx-auto group-hover:scale-110 transition-transform duration-300" />,
      listIcon: <GraduationCap className="h-5 w-5 flex-none text-cyan-400" />,
      cardTitle: "Expert-Curated Content",
      cardDescription: "Content developed by experienced medical physicists and radiation therapists"
    },
    {
      title: "Adaptive Learning Algorithm",
      description: "Our AI-driven system creates a custom study plan based on your strengths and weaknesses.",
      icon: <LineChart className="h-8 w-8 text-cyan-400 mx-auto group-hover:scale-110 transition-transform duration-300" />,
      listIcon: <BrainCircuit className="h-5 w-5 flex-none text-cyan-400" />,
      cardTitle: "Smart Learning Path",
      cardDescription: "AI-powered system that adapts to your learning style and progress"
    },
    {
      title: "Evidence-Based Approach",
      description: "Content regularly updated to reflect the latest research, technologies, and industry standards.",
      icon: <Activity className="h-8 w-8 text-cyan-400 mx-auto group-hover:scale-110 transition-transform duration-300" />,
      listIcon: <BookOpen className="h-5 w-5 flex-none text-cyan-400" />,
      cardTitle: "Current & Relevant",
      cardDescription: "Always up-to-date with the latest research and industry standards"
    }
  ];

  return (
    <section
      id="why"
      className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-black to-black/95 border-t border-white/5"
    >
      <div className="px-8 md:px-24">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12 animate-fade-in-up">
          <div className="space-y-2">
            <div className="inline-block rounded-full bg-gradient-to-r from-cyan-400/20 to-teal-400/20 px-4 py-1 text-xs text-cyan-400 font-funnel-sans">
              Why PrepTrack
            </div>
            <h2 className="text-4xl font-funnel-sans tracking-tight sm:text-4xl md:text-5xl">
              Precision-Guided Learning
            </h2>
            <p className="max-w-[700px] text-gray-400 md:text-lg font-funnel-sans">
              Like radiation therapy itself, our approach is targeted, precise, and personalized.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-2 lg:gap-12 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <div className="relative aspect-video overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-black/50 to-gray-900/50 group transition-all duration-300 hover:border-white/20 hover:scale-[1.02] shadow-[0_0_20px_rgba(0,0,0,0.3)]">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 to-teal-400/10 group-hover:opacity-100 opacity-50 transition-opacity duration-300" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3/4 h-3/4 rounded-lg bg-black/60 backdrop-blur-sm border border-white/10 p-4 flex flex-col justify-center transition-all duration-300 group-hover:border-cyan-400/30 group-hover:bg-black/70 shadow-lg">
                <div className="space-y-2 text-center">
                  {features[activeFeature].icon}
                  <h3 className="text-lg font-funnel-sans tracking-tight">{features[activeFeature].cardTitle}</h3>
                  <p className="text-xs text-gray-400">
                    {features[activeFeature].cardDescription}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center space-y-12">
            <ul className="grid gap-4">
              {features.map((item, index) => (
                <li
                  key={index}
                  className="flex gap-3 p-3 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10 transition-all duration-300 hover:border-white/20 hover:bg-black/60 animate-fade-in-left cursor-pointer shadow-[0_0_10px_rgba(0,0,0,0.2)]"
                  style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                  onMouseEnter={() => setActiveFeature(index)}
                >
                  {index === 0 ? <Target className="h-5 w-5 flex-none text-cyan-400" /> :
                   index === 1 ? <GraduationCap className="h-5 w-5 flex-none text-cyan-400" /> :
                   index === 2 ? <BrainCircuit className="h-5 w-5 flex-none text-cyan-400" /> :
                   <BookOpen className="h-5 w-5 flex-none text-cyan-400" />}
                  <div>
                    <h3 className="text-base font-funnel-sans tracking-tight">{item.title}</h3>
                    <p className="text-sm text-gray-400">{item.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
