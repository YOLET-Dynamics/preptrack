"use client";
import { useInView } from "framer-motion";
import { useRef } from "react";

export default function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      id="testimonials"
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
              Testimonials
            </div>
            <h2 className="text-4xl font-funnel-sans tracking-tight sm:text-4xl md:text-5xl">
              Student Experiences
            </h2>
            <p className="max-w-[700px] text-gray-400 md:text-lg font-funnel-sans">
              Hear from students who have used PrepTrack to prepare for their
              certification exams.
            </p>
          </div>
        </div>
        <div
          className="mx-auto grid max-w-5xl space-x-12 md:grid-cols-3"
          style={{
            opacity: isInView ? 1 : 0,
            transform: isInView ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.5s ease-out 0.4s",
          }}
        >
          <TestimonialCard
            rating={5}
            quote="PrepTrack helped me identify my weak areas and focus my study time efficiently. I passed my certification exam on the first try."
            author="Sarah J."
            role="Certified RT"
            initials="SJ"
            delay={0.3}
            isInView={isInView}
          />
          <TestimonialCard
            rating={4}
            quote="The bite-sized content modules made studying manageable between clinical rotations. The practice exams were incredibly similar to the actual test."
            author="Michael C."
            role="RT Student"
            initials="MC"
            delay={0.4}
            isInView={isInView}
          />
          <TestimonialCard
            rating={5}
            quote="As an instructor, I recommend PrepTrack to all my students. The adaptive learning features have significantly improved our program's pass rates."
            author="Dr. Emily R."
            role="Program Director"
            initials="ER"
            delay={0.5}
            isInView={isInView}
          />
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({
  rating,
  quote,
  author,
  role,
  initials,
  delay,
  isInView,
}: {
  rating: number;
  quote: string;
  author: string;
  role: string;
  initials: string;
  delay: number;
  isInView: boolean;
}) {
  return (
    <div
      className="group relative flex flex-col justify-between space-y-4 rounded-xl border border-white/5 bg-white/[0.03] p-6 backdrop-blur-sm transition-all duration-300 hover:border-white/10 hover:bg-white/[0.05] hover:translate-y-[-5px] overflow-hidden"
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? "translateY(0)" : "translateY(20px)",
        transition: `all 0.5s ease-out ${delay}s`,
      }}
    >
      {/* Gradient Border Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-teal-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="space-y-3">
        <div className="text-cyan-400">
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className={i < rating ? "text-cyan-400" : "text-cyan-400/30"}
            >
              ★
            </span>
          ))}
        </div>
        <p className="text-sm text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
          {quote}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-cyan-400/20 to-teal-400/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <span className="text-xs text-cyan-400">{initials}</span>
        </div>
        <div>
          <h4 className="text-sm font-medium text-white">{author}</h4>
          <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
            {role}
          </p>
        </div>
      </div>
    </div>
  );
}
