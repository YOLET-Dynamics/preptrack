"use client";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Atom } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFormspark } from "@formspark/use-formspark";
import { toast } from "sonner";

const FORMSPARK_FORM_ID = "7MQx5JvdO";
const RATE_LIMIT_DURATION = 30000; // 30 seconds

const isValidEmail = (email: string) => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return emailRegex.test(email);
};

export default function CTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [submit, submitting] = useFormspark({
    formId: FORMSPARK_FORM_ID,
  });
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const lastSubmissionTime = useRef<number>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");

    const now = Date.now();
    const timeSinceLastSubmission = now - lastSubmissionTime.current;

    if (timeSinceLastSubmission < RATE_LIMIT_DURATION) {
      const remainingTime = Math.ceil((RATE_LIMIT_DURATION - timeSinceLastSubmission) / 1000);
      toast.error(`Please wait ${remainingTime} seconds before submitting again`);
      return;
    }

    if (!email.trim()) {
      setEmailError("Email is required");
      return;
    }

    if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    try {
      lastSubmissionTime.current = now;
      await submit({ 
        email,
        source: "cta",
        timestamp: new Date().toISOString(),
      });
      toast.success("Successfully joined the waitlist!");
      setEmail("");
    } catch (error) {
      toast.error("Failed to join waitlist. Please try again.");
    }
  };

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
                Waitlist is Full
              </h2>
              <p className="max-w-[600px] text-gray-400 md:text-lg font-funnel-sans">
                Thank you for your interest in PrepTrack! Our initial waitlist is now full. Stay tuned for updates on our official launch.
              </p>
            </div>
            <div className="w-full max-w-md space-y-3">
              <div className="flex items-center justify-center gap-4 pt-2">
                <div className="flex items-center gap-1">
                  <div className="h-1 w-1 rounded-full bg-cyan-400"></div>
                  <p className="text-xs text-gray-400">Early access</p>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-1 w-1 rounded-full bg-cyan-400"></div>
                  <p className="text-xs text-gray-400">Special pricing</p>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-1 w-1 rounded-full bg-cyan-400"></div>
                  <p className="text-xs text-gray-400">Priority support</p>
                </div>
              </div>
              <p className="text-xs text-center text-gray-400 pt-2">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
