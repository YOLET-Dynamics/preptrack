"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Eye, EyeOff, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 py-12 relative">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-brand-green/10 blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 rounded-full bg-brand-indigo/5 blur-3xl"></div>
      </div>

      <Link href="/" passHref>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 text-brand-indigo/40 hover:text-brand-green"
        >
          <Home className="h-6 w-6" />
        </Button>
      </Link>
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-10">
          <Link href="/" passHref>
            <Image
              src="/logo/PrepTrack_LogoDesign_01-01.png"
              alt="PrepTrack"
              width={200}
              height={60}
              className="h-14 w-auto mx-auto cursor-pointer"
              priority
            />
          </Link>
        </div>

        <div className="bg-white border border-brand-indigo/10 rounded-2xl p-8 sm:p-10 shadow-xl shadow-brand-indigo/5">
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h2 className="text-2xl sm:text-3xl font-semibold text-brand-indigo font-inter">
                Sign in to your account
              </h2>
              <p className="text-brand-indigo/50 font-dm-sans">
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
                          "h-12 bg-brand-indigo/5 border-brand-indigo/20 text-brand-indigo placeholder:text-brand-indigo/40 focus:border-brand-green transition-all pr-10 rounded-xl font-dm-sans",
                          field.state.meta.errors.length > 0 &&
                            "border-red-500 focus:border-red-500",
                          isEmailFocused &&
                            !field.state.meta.errors.length &&
                            "border-brand-green"
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
                          "h-12 bg-brand-indigo/5 border-brand-indigo/20 text-brand-indigo placeholder:text-brand-indigo/40 focus:border-brand-green transition-all pr-10 rounded-xl font-dm-sans",
                          field.state.meta.errors.length > 0 &&
                            "border-red-500 focus:border-red-500",
                          isPasswordFocused &&
                            !field.state.meta.errors.length &&
                            "border-brand-green"
                        )}
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-brand-indigo/40 hover:text-brand-indigo/60"
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
                        <span className="text-brand-green hover:underline cursor-pointer font-dm-sans">
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
                    className="w-full h-12 bg-brand-indigo text-white hover:bg-brand-indigo/90 group mt-6 disabled:opacity-50 font-dm-sans font-medium rounded-xl"
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
              <p className="text-brand-indigo/50 text-sm font-dm-sans">
                Don't have an account?{" "}
                <Link href="/signup" passHref>
                  <span className="text-brand-green hover:underline cursor-pointer">
                    Sign up
                  </span>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
