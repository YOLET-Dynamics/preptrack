"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Eye, EyeOff, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";
import { useForm } from "@tanstack/react-form";
import type { AnyFieldApi } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuth } from "@/provider/AuthProvider";
import { authApi } from "@/api/auth";
import { formatError } from "@/common/utils";

function FieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <>
      {field.state.meta.isTouched && field.state.meta.errors.length > 0 ? (
        <p className="text-red-500 text-xs mt-1 absolute -bottom-5 left-0">
          {field.state.meta.errors.join(", ")}
        </p>
      ) : null}
    </>
  );
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const router = useRouter();
  const { login } = useAuth();

  const mutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: async (data) => {
      await login(data);
      toast.success("Login successful!");
      router.push("/dashboard");
    },
    onError: (error: any) => {
      const errorMessage =
        typeof error === "string"
          ? formatError(error)
          : error.message || "Login failed. Please try again.";
      toast.error(errorMessage);
    },
  });

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      mutation.mutate(value);
    },
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black px-4 py-12 relative">
      <Link href="/" passHref>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 text-gray-400 hover:text-cyan-400"
        >
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

            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
              className="space-y-4"
            >
              <form.Field
                name="email"
                validators={{
                  onChange: ({ value }) =>
                    !value
                      ? "Email is required"
                      : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                      ? undefined
                      : "Please enter a valid email address.",
                  onBlur: ({ value }) =>
                    !value
                      ? "Email is required"
                      : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                      ? undefined
                      : "Please enter a valid email address.",
                }}
                children={(field) => (
                  <div className="space-y-2">
                    <div className="relative">
                      <Input
                        id={field.name}
                        name={field.name}
                        type="email"
                        placeholder="Email"
                        value={field.state.value}
                        onBlur={() => {
                          field.handleBlur();
                          setIsEmailFocused(false);
                        }}
                        onFocus={() => setIsEmailFocused(true)}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className={cn(
                          "h-12 bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-cyan-500 transition-all pr-10",
                          field.state.meta.errors.length > 0 &&
                            "border-red-500 focus:border-red-500",
                          isEmailFocused &&
                            !field.state.meta.errors.length &&
                            "border-cyan-500"
                        )}
                      />
                      <FieldInfo field={field} />
                    </div>
                  </div>
                )}
              />

              <form.Field
                name="password"
                validators={{
                  onChange: ({ value }) =>
                    !value ? "Password is required" : undefined,
                  onBlur: ({ value }) =>
                    !value ? "Password is required" : undefined,
                }}
                children={(field) => (
                  <div className="space-y-2 relative pt-4">
                    <div className="relative">
                      <Input
                        id={field.name}
                        name={field.name}
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={field.state.value}
                        onBlur={() => {
                          field.handleBlur();
                          setIsPasswordFocused(false);
                        }}
                        onFocus={() => setIsPasswordFocused(true)}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className={cn(
                          "h-12 bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-cyan-500 transition-all pr-10",
                          field.state.meta.errors.length > 0 &&
                            "border-red-500 focus:border-red-500",
                          isPasswordFocused &&
                            !field.state.meta.errors.length &&
                            "border-cyan-500"
                        )}
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
                      <FieldInfo field={field} />
                    </div>
                    <div className="flex justify-end text-xs pt-1">
                      <Link href="/forgot-password" passHref>
                        <span className="text-cyan-400 hover:underline cursor-pointer">
                          Forgot password?
                        </span>
                      </Link>
                    </div>
                  </div>
                )}
              />

              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                  <Button
                    type="submit"
                    disabled={!canSubmit || isSubmitting || mutation.isPending}
                    className="w-full h-12 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white group mt-6 disabled:opacity-50"
                  >
                    {isSubmitting || mutation.isPending
                      ? "Signing In..."
                      : "Sign In"}
                    {!(isSubmitting || mutation.isPending) && (
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    )}
                  </Button>
                )}
              />
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
