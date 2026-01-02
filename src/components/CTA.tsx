"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function CTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section className="relative py-16 sm:py-20 md:py-28 lg:py-32 overflow-hidden" ref={ref}>
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-brand-green/5 to-brand-indigo/5 -z-10" />
      
      <div className="px-5 sm:px-6 md:px-12 lg:px-18 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="relative"
        >
          {/* Main CTA Card */}
          <div className="relative max-w-4xl mx-auto">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-brand-green/30 to-brand-indigo/20 rounded-2xl sm:rounded-3xl blur-3xl opacity-50" />
            
            <div className="relative bg-brand-indigo rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-16 text-center overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-40 sm:w-64 h-40 sm:h-64 bg-brand-green/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-32 sm:w-48 h-32 sm:h-48 bg-white/5 rounded-full blur-2xl" />
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative"
              >
                <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/10 border border-white/20 mb-5 sm:mb-8">
                  <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-green" />
                  <span className="text-xs sm:text-sm font-medium text-white/90 font-dm-sans">
                    Start Your Journey Today
                  </span>
                </div>
                
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-inter text-white mb-4 sm:mb-6 leading-tight">
                  Ready to Ace Your
                  <br className="hidden sm:block" />
                  <span className="sm:hidden"> </span>
                  <span className="text-brand-green">Radiation Therapy Exams?</span>
                </h2>
                
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/70 font-dm-sans max-w-xl mx-auto mb-6 sm:mb-10 px-2">
                  Join thousands of students who have transformed their exam prep with PrepTrack's intelligent learning system.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                  <Link href="/signup" className="w-full sm:w-auto">
                    <Button className="w-full sm:w-auto group bg-brand-green text-brand-indigo hover:bg-brand-green/90 transition-all duration-300 hover:scale-105 font-dm-sans font-semibold px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg rounded-full shadow-lg shadow-brand-green/20">
                      Get Started Free
                      <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                  <Link href="/login" className="w-full sm:w-auto">
                    <Button variant="outline" className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 font-dm-sans font-medium px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg rounded-full">
                      Sign In
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
