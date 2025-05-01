"use client";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Atom, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      id="cta"
      className="w-full py-16 md:py-24 lg:py-32 border-t border-white/5 overflow-hidden"
    >
      <div className="px-8 md:px-24">
        <div
          className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-sm"
          style={{
            opacity: isInView ? 1 : 0,
            transform: isInView ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.5s ease-out 0.2s",
          }}
        >
          <div className="flex flex-col items-center justify-center space-y-6 text-center">
            <div className="space-y-2">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-r from-cyan-400/20 to-teal-400/20 mb-2 group-hover:scale-110 transition-transform duration-300">
                <Atom className="h-6 w-6 text-cyan-400" />
              </div>
              <h2 className="text-3xl font-funnel-sans tracking-tight sm:text-4xl">
                Ready to Boost Your Prep?
              </h2>
              <p className="max-w-[600px] text-gray-400 md:text-lg font-funnel-sans">
                Join PrepTrack today and start mastering radiation therapy
                concepts with precision learning.
              </p>
            </div>
            <div className="pt-4">
              <Link href="/signup">
                <Button className="bg-gradient-to-r from-cyan-400 to-teal-400 text-black hover:opacity-90 transition-all duration-300 hover:scale-105 font-funnel-sans px-8 py-3 text-lg group">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
