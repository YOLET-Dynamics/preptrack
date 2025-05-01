"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [isFocused, setIsFocused] = useState(false);

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    if (value && !validateEmail(value)) {
      setIsValid(false);
    } else {
      setIsValid(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && validateEmail(email)) {
      toast("Coming soon!");
    } else {
      setIsValid(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black px-4 py-12 relative">
      <Link href="/" passHref>
        <Button variant="ghost" size="icon" className="absolute top-4 right-4 text-gray-400 hover:text-cyan-400">
          <Home className="h-6 w-6" />
        </Button>
      </Link>
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-5xl md:leading-loose md:tracking-wide font-funnel-sans tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">
            preptrack.app
          </h1>
        </div>

        <div className="bg-black/30 backdrop-blur-sm border border-gray-800 rounded-xl p-6 sm:p-8 shadow-2xl">
          <div className="space-y-6">
            {/* Header */}
            <div className="space-y-2 text-center">
              <h2 className="text-xl sm:text-2xl font-bold text-white font-funnel-sans">
                Create your account
              </h2>
              <p className="text-gray-400 font-funnel-sans">
                Enter your email to get started with PrepTrack
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <div className="relative">
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={handleEmailChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className={cn(
                      "h-12 bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-cyan-500 transition-all",
                      !isValid && "border-red-500 focus:border-red-500",
                      isFocused && isValid && "border-cyan-500"
                    )}
                  />
                  {!isValid && (
                    <p className="text-red-500 text-sm mt-1">
                      Please enter a valid email address
                    </p>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white group"
              >
                Continue
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </form>

            <p className="text-xs text-gray-500 text-center">
              By signing up, you agree to our{" "}
              <a href="/coming-soon" className="text-cyan-400 hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/coming-soon" className="text-cyan-400 hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-gray-400">
            Already have an account?{" "}
            <a href="/login" className="text-cyan-400 hover:underline">
              Sign in
            </a>
          </p>
        </div>
      </div>

      <div className="fixed top-1/4 left-1/4 w-64 h-64 rounded-full bg-cyan-500/10 blur-3xl -z-10"></div>
      <div className="fixed bottom-1/3 right-1/3 w-80 h-80 rounded-full bg-teal-500/10 blur-3xl -z-10"></div>
    </div>
  );
}
