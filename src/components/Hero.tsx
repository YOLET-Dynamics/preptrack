"use client";

import { Button } from "@/components/ui/button";
import { useFormspark } from "@formspark/use-formspark";
import { BookOpen, Activity, LineChart } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";

const FORMSPARK_FORM_ID = "7MQx5JvdO";
const RATE_LIMIT_DURATION = 30000; // 30 seconds

const isValidEmail = (email: string) => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return emailRegex.test(email);
};

export default function Hero() {
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
        source: "hero",
        timestamp: new Date().toISOString(),
      });
      toast.success("Successfully joined the waitlist!");
      setEmail("");
    } catch (error) {
      toast.error("Failed to join waitlist. Please try again.");
    }
  };

  return (
    <section className="w-full py-8 md:py-12 lg:py-16 overflow-hidden">
      <div className="px-8 md:px-24 h-full">
        <div className="grid gap-6 lg:grid-cols-[1fr_600px] lg:gap-12 xl:grid-cols-[1fr_700px] h-full">
          <div
            className="flex flex-col justify-center space-y-4 animate-fade-in-up ease-in"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="space-y-6">
              <h1 className="text-4xl font-funnel-sans tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                Precision Learning for Radiation Therapy
              </h1>
              <p className="max-w-[600px] text-gray-400 md:text-xl font-funnel-sans">
                Personalized test preparation paths and study guides.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <div className="flex h-10 w-48 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-400 items-center justify-center">
                    Waitlist is Full
                  </div>
                  <Button
                    disabled={true}
                    className="bg-gradient-to-r from-cyan-400 to-teal-400 text-black hover:opacity-90 transition-all duration-300 hover:scale-105 font-funnel-sans"
                  >
                    Join Waitlist
                  </Button>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <p className="text-sm text-gray-400">Coming Soon</p>
            </div>
          </div>
          <div
            className="relative flex items-center justify-center lg:justify-end animate-fade-in"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="relative h-[400px] w-full md:h-[500px] lg:h-[600px]">
              {/* iPhone Mockup */}
              <div className="absolute -left-4 top-1/4 z-10 h-[420px] w-[210px] rotate-6 overflow-hidden rounded-[40px] border border-white/10 shadow-2xl md:h-[450px] md:w-[220px] transition-transform duration-700 hover:rotate-0 hover:scale-105">
                <div className="h-full w-full bg-black p-2 rounded-[36px]">
                  {/* iPhone Notch */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[80px] h-6 bg-black rounded-b-xl z-20 flex justify-center items-end pb-1">
                    <div className="w-12 h-2 bg-black rounded-full relative">
                      <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white/20"></div>
                    </div>
                  </div>

                  <div className="h-full w-full rounded-[32px] bg-black overflow-hidden border border-white/5">
                    {/* Status Bar */}
                    <div className="h-6 w-full bg-black flex justify-between items-center px-6 pt-1">
                      <div className="text-[10px] text-white">9:41</div>
                      <div className="flex gap-1 items-center">
                        <div className="h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse-slow"></div>
                        <div className="h-2.5 w-2.5 rounded-full bg-white/50"></div>
                        <div className="h-2.5 w-2.5 rounded-full bg-white/50"></div>
                      </div>
                    </div>

                    {/* App Header */}
                    <div className="px-4 py-3">
                      <div className="flex justify-between items-center">
                        <div className="text-[14px] font-medium text-white">
                          preptrack.app
                        </div>
                        <div className="h-5 w-5 rounded-full bg-gradient-to-r from-cyan-400/20 to-teal-400/20 flex items-center justify-center">
                          <span className="text-[8px] text-cyan-400">RT</span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="px-4 py-2">
                      <div className="h-1 w-full bg-white/10 rounded-full">
                        <div className="h-1 w-3/4 bg-gradient-to-r from-cyan-400 to-teal-400 rounded-full animate-progress"></div>
                      </div>
                      <div className="flex justify-between mt-1">
                        <div className="text-[8px] text-white/50">Progress</div>
                        <div className="text-[8px] text-white/50">75%</div>
                      </div>
                    </div>

                    {/* Question Card */}
                    <div className="px-4 py-3">
                      <div className="bg-white/5 rounded-xl p-3 border border-white/5 shadow-sm">
                        <div className="text-[10px] text-white/70 mb-2">
                          Question 14 of 20
                        </div>
                        <div className="text-[12px] text-white leading-tight">
                          Which of the following best describes the principle of
                          ALARA in radiation safety?
                        </div>
                      </div>
                    </div>

                    {/* Answer Options */}
                    <div className="px-4 py-3">
                      <div className="space-y-2.5">
                        <div className="bg-gradient-to-r from-cyan-400/10 to-teal-400/10 rounded-lg p-2.5 border border-cyan-400/20 transition-all duration-300 hover:border-cyan-400/40">
                          <div className="text-[11px] text-white">
                            A. As Low As Reasonably Achievable
                          </div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-2.5 border border-white/5 transition-all duration-300 hover:border-white/10 hover:bg-white/[0.07]">
                          <div className="text-[11px] text-white/70">
                            B. Always Limit Actual Radiation Amounts
                          </div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-2.5 border border-white/5 transition-all duration-300 hover:border-white/10 hover:bg-white/[0.07]">
                          <div className="text-[11px] text-white/70">
                            C. Acceptable Levels Are Regulated Accordingly
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Navigation */}
                    <div className="absolute bottom-0 left-0 right-0 h-14 bg-black/50 backdrop-blur-sm border-t border-white/5 flex justify-around items-center px-3">
                      <BookOpen className="h-5 w-5 text-white/50 transition-colors duration-300 hover:text-cyan-400" />
                      <Activity className="h-5 w-5 text-cyan-400 animate-pulse-subtle" />
                      <LineChart className="h-5 w-5 text-white/50 transition-colors duration-300 hover:text-cyan-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Desktop App Mockup */}
              <div className="absolute -right-4 top-1/3 z-0 h-[350px] w-[550px] -rotate-6 overflow-hidden rounded-xl border border-white/10 shadow-2xl transition-transform duration-700 hover:rotate-0 hover:scale-105">
                <div className="h-full w-full bg-black p-0.5">
                  <div className="h-full w-full rounded-lg bg-black overflow-hidden">
                    {/* Browser Bar */}
                    <div className="h-7 w-full bg-gray-900 flex items-center px-2">
                      <div className="flex gap-1.5 mr-2">
                        <div className="h-2.5 w-2.5 rounded-full bg-red-400"></div>
                        <div className="h-2.5 w-2.5 rounded-full bg-yellow-400"></div>
                        <div className="h-2.5 w-2.5 rounded-full bg-green-400"></div>
                      </div>
                      <div className="h-4 w-full max-w-[200px] bg-white/10 rounded-full mx-auto flex items-center justify-center">
                        <div className="text-[8px] text-white/50">
                          preptrack.app/dashboard
                        </div>
                      </div>
                    </div>

                    {/* App Header */}
                    <div className="p-3 border-b border-white/5 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-medium text-white">
                          preptrack.app
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-gradient-to-r from-cyan-400/20 to-teal-400/20 flex items-center justify-center">
                          <span className="text-[10px] text-cyan-400">JD</span>
                        </div>
                        <div className="text-xs text-white/70">John D.</div>
                      </div>
                    </div>

                    {/* Dashboard Content */}
                    <div className="p-4 grid grid-cols-3 gap-4">
                      {/* Stats Card */}
                      <div className="col-span-1 bg-white/[0.03] rounded-xl p-4 border border-white/5 transition-all duration-300 hover:border-white/10 hover:bg-white/[0.05]">
                        <div className="text-xs text-white/70 mb-1">
                          Study Progress
                        </div>
                        <div className="text-xl font-medium text-white">
                          78%
                        </div>
                        <div className="h-1 w-full bg-white/10 rounded-full mt-2">
                          <div className="h-1 w-[78%] bg-gradient-to-r from-cyan-400 to-teal-400 rounded-full animate-progress"></div>
                        </div>
                        <div className="mt-2 text-[10px] text-white/50">
                          12 of 15 modules completed
                        </div>
                      </div>

                      {/* Performance Card */}
                      <div className="col-span-2 bg-white/[0.03] rounded-xl p-4 border border-white/5 transition-all duration-300 hover:border-white/10 hover:bg-white/[0.05]">
                        <div className="text-xs text-white/70 mb-1">
                          Performance Analysis
                        </div>
                        <div className="flex justify-between items-end">
                          <div className="space-y-1">
                            <div className="text-sm font-medium text-white">
                              85% Accuracy
                            </div>
                            <div className="text-[10px] text-white/50">
                              +5% from last week
                            </div>
                          </div>
                          <div className="flex h-12 items-end gap-1">
                            <div className="w-3 h-4 bg-white/20 rounded-sm"></div>
                            <div className="w-3 h-6 bg-white/20 rounded-sm"></div>
                            <div className="w-3 h-8 bg-white/20 rounded-sm"></div>
                            <div className="w-3 h-5 bg-white/20 rounded-sm"></div>
                            <div className="w-3 h-10 bg-gradient-to-t from-cyan-400 to-teal-400 rounded-sm animate-bar-1"></div>
                            <div className="w-3 h-12 bg-gradient-to-t from-cyan-400 to-teal-400 rounded-sm animate-bar-2"></div>
                          </div>
                        </div>
                      </div>

                      {/* Recommended Modules */}
                      <div className="col-span-3 bg-white/[0.03] rounded-xl p-4 border border-white/5 transition-all duration-300 hover:border-white/10 hover:bg-white/[0.05]">
                        <div className="text-xs text-white/70 mb-2">
                          Recommended Study Modules
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <div className="bg-gradient-to-r from-cyan-400/5 to-teal-400/5 rounded-lg p-3 border border-cyan-400/20 transition-all duration-300 hover:border-cyan-400/40">
                            <div className="text-[11px] font-medium text-white">
                              Radiation Safety
                            </div>
                            <div className="text-[9px] text-white/50 mt-1">
                              Priority: High
                            </div>
                          </div>
                          <div className="bg-black/30 rounded-lg p-3 border border-white/5 transition-all duration-300 hover:border-white/10">
                            <div className="text-[11px] font-medium text-white">
                              Treatment Planning
                            </div>
                            <div className="text-[9px] text-white/50 mt-1">
                              Priority: Medium
                            </div>
                          </div>
                          <div className="bg-black/30 rounded-lg p-3 border border-white/5 transition-all duration-300 hover:border-white/10">
                            <div className="text-[11px] font-medium text-white">
                              Patient Positioning
                            </div>
                            <div className="text-[9px] text-white/50 mt-1">
                              Priority: Medium
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
