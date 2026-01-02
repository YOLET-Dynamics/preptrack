"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { 
  Target, 
  Brain, 
  BarChart3, 
  Zap,
  CheckCircle,
  Atom
} from "lucide-react";

const features = [
  {
    icon: <Target className="h-5 w-5 sm:h-6 sm:w-6 text-brand-green" />,
    title: "Precision Targeting",
    description: "Focus on exactly what you need to learn, when you need to learn it.",
    cardTitle: "Smart Focus",
    cardDescription: "AI identifies your weak spots and creates targeted practice sessions",
  },
  {
    icon: <Brain className="h-5 w-5 sm:h-6 sm:w-6 text-brand-green" />,
    title: "Adaptive Intelligence",
    description: "Our AI learns how you learn and adjusts in real-time.",
    cardTitle: "Personal Learning",
    cardDescription: "Questions adapt to your skill level for optimal challenge",
  },
  {
    icon: <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-brand-green" />,
    title: "Visual Progress",
    description: "Track your growth with intuitive dashboards and insights.",
    cardTitle: "Clear Analytics",
    cardDescription: "See exactly where you stand and what to focus on next",
  },
  {
    icon: <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-brand-green" />,
    title: "Instant Mastery",
    description: "Get immediate feedback and explanations for every question.",
    cardTitle: "Learn Fast",
    cardDescription: "Understand mistakes instantly with detailed explanations",
  },
];

export default function Differentiator() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [activeFeature, setActiveFeature] = useState(0);

  return (
    <section
      id="why-preptrack"
      className="relative py-16 sm:py-20 md:py-28 lg:py-32 overflow-hidden"
      ref={ref}
    >
      <div className="px-5 sm:px-6 md:px-12 lg:px-18 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 md:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-brand-green/10 border border-brand-green/20 mb-4 sm:mb-6">
            <Atom className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-green" />
            <span className="text-xs sm:text-sm font-medium text-brand-indigo font-dm-sans">
              Precision-Guided Learning
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-inter text-brand-indigo mb-4 sm:mb-6 leading-tight">
            Like Radiation Therapy,
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>
            <span className="text-brand-green">Our Approach is Precise</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-brand-indigo/60 font-dm-sans px-2">
            We target your learning needs with the same precision you'll bring to patient care.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-16 items-center">
          {/* Interactive Preview Card - Hidden on small mobile, shown on sm+ */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative order-2 lg:order-1 hidden sm:block"
          >
            <div className="relative aspect-square max-w-sm md:max-w-md mx-auto">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand-green/20 to-brand-indigo/10 rounded-2xl sm:rounded-3xl blur-2xl" />
              
              {/* Main card */}
              <div className="relative h-full bg-white rounded-2xl sm:rounded-3xl border border-brand-indigo/10 shadow-2xl shadow-brand-indigo/5 p-6 sm:p-8 flex flex-col justify-center items-center">
                <motion.div
                  key={activeFeature}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-xl sm:rounded-2xl bg-brand-green/10 flex items-center justify-center">
                    {features[activeFeature].icon}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold font-inter text-brand-indigo mb-2 sm:mb-3">
                    {features[activeFeature].cardTitle}
                  </h3>
                  <p className="text-sm sm:text-base text-brand-indigo/60 font-dm-sans max-w-xs">
                    {features[activeFeature].cardDescription}
                  </p>
                </motion.div>

                {/* Decorative elements */}
                <div className="absolute top-4 sm:top-6 right-4 sm:right-6 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-brand-green" />
                <div className="absolute top-4 sm:top-6 right-9 sm:right-12 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-brand-indigo/20" />
                <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 flex gap-1">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`w-6 sm:w-8 h-1 rounded-full transition-colors ${
                        i === activeFeature ? "bg-brand-green" : "bg-brand-indigo/10"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Feature List */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-3 sm:space-y-4 order-1 lg:order-2"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                onMouseEnter={() => setActiveFeature(index)}
                onClick={() => setActiveFeature(index)}
                className={`group flex gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl sm:rounded-2xl cursor-pointer transition-all duration-300 ${
                  activeFeature === index
                    ? "bg-brand-green/10 border border-brand-green/20"
                    : "hover:bg-brand-indigo/5 border border-transparent"
                }`}
              >
                <div className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center transition-colors ${
                  activeFeature === index ? "bg-white shadow-sm" : "bg-brand-indigo/5"
                }`}>
                  {feature.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 sm:mb-1">
                    <h3 className="font-semibold font-inter text-brand-indigo text-sm sm:text-base">
                      {feature.title}
                    </h3>
                    {activeFeature === index && (
                      <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-green flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-brand-indigo/60 font-dm-sans text-xs sm:text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
