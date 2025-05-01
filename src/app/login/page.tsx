"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Eye, EyeOff, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setIsEmailValid(validateEmail(value));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isEmailCurrentlyValid = validateEmail(email);
    setIsEmailValid(isEmailCurrentlyValid);

    if (email && password && isEmailCurrentlyValid) {
      toast("Login action coming soon!");
      console.log("Login attempt with:", { email });
    } else if (!isEmailCurrentlyValid) {
      toast.error("Please enter a valid email address.");
    } else if (!password) {
      toast.error("Please enter your password.");
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
          <Link href="/" passHref>
            <h1 className="text-3xl md:text-5xl md:leading-loose md:tracking-wide font-funnel-sans tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400 cursor-pointer">
              preptrack.app
            </h1>
          </Link>
        </div>

        <div className="bg-black/30 backdrop-blur-sm border border-gray-800 rounded-xl p-6 sm:p-8 shadow-2xl">
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h2 className="text-xl sm:text-2xl font-bold text-white font-funnel-sans">
                Sign in to your account
              </h2>
              <p className="text-gray-400 font-funnel-sans">
                Enter your email and password below
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={handleEmailChange}
                    onFocus={() => setIsEmailFocused(true)}
                    onBlur={() => {
                      setIsEmailFocused(false);
                      if (email) setIsEmailValid(validateEmail(email));
                    }}
                    className={cn(
                      "h-12 bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-cyan-500 transition-all pr-10",
                      !isEmailValid &&
                        email &&
                        "border-red-500 focus:border-red-500",
                      isEmailFocused && isEmailValid && "border-cyan-500"
                    )}
                    required
                  />
                  {!isEmailValid && email && (
                    <p className="text-red-500 text-xs mt-1 absolute -bottom-5 left-0">
                      Please enter a valid email address.
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2 relative pt-4">
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={handlePasswordChange}
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)}
                    className={cn(
                      "h-12 bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-cyan-500 transition-all pr-10",
                      isPasswordFocused && "border-cyan-500"
                    )}
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-300"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <div className="flex justify-end text-xs pt-1">
                  <Link href="/forgot-password" passHref>
                    <span className="text-cyan-400 hover:underline cursor-pointer">
                      Forgot password?
                    </span>
                  </Link>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white group mt-6"
              >
                Sign In
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </form>

            <div className="text-center mt-6">
              <p className="text-gray-400 text-sm">
                Don't have an account?{" "}
                <Link href="/signup" passHref>
                  <span className="text-cyan-400 hover:underline cursor-pointer">
                    Sign up
                  </span>
                </Link>
              </p>
            </div>
          </div>
        </div>
        <div className="fixed top-1/4 left-1/4 w-64 h-64 rounded-full bg-cyan-500/10 blur-3xl -z-10"></div>
        <div className="fixed bottom-1/3 right-1/3 w-80 h-80 rounded-full bg-teal-500/10 blur-3xl -z-10"></div>
      </div>
    </div>
  );
}
