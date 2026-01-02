"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Home, CheckCircle, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import { authApi } from "@/api/auth";
import { formatError } from "@/common/utils";
import { useAuth } from "@/provider/AuthProvider";
import { useForm, type AnyFieldApi } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { AuthUser } from "@/models/user";

function FieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <div className="min-h-[20px] mt-1">
      {field.state.meta.isTouched && field.state.meta.errors.length > 0 ? (
        <p className="text-red-500 text-xs font-dm-sans">
          {field.state.meta.errors.join(", ")}
        </p>
      ) : null}
    </div>
  );
}

type SignupStep = "email" | "otp" | "details";

export default function SignUpPage() {
  const [currentStep, setCurrentStep] = useState<SignupStep>("email");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState<Record<string, boolean>>({});
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  const router = useRouter();
  const { signup: authSignup } = useAuth();

  const initMutation = useMutation({
    mutationFn: authApi.init,
    onSuccess: (data, variables) => {
      setEmail(variables.email!);
      setCurrentStep("otp");
      toast.success("OTP sent successfully! Please check your email.");
    },
    onError: (error: any) => {
      toast.error(formatError(error));
    },
  });

  const verifyMutation = useMutation({
    mutationFn: authApi.verify,
    onSuccess: () => {
      setCurrentStep("details");
      toast.success("Email verified successfully!");
    },
    onError: (error: any) => {
      toast.error(formatError(error));
    },
  });

  const signupMutation = useMutation({
    mutationFn: authApi.signup,
    onSuccess: async (data) => {
      await authSignup(data as AuthUser);
      toast.success("Account created successfully!");
      setShowSuccessAnimation(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    },
    onError: (error: any) => {
      toast.error(formatError(error));
      setShowSuccessAnimation(false);
    },
  });

  const emailForm = useForm({
    defaultValues: { email: "" },
    onSubmit: async ({ value }) => {
      initMutation.mutate(value);
    },
  });

  const otpForm = useForm({
    defaultValues: { otp: "" },
    onSubmit: async ({ value }) => {
      if (!email) {
        toast.error("Email is missing. Please start over.");
        setCurrentStep("email");
        return;
      }
      verifyMutation.mutate({ email, otp: value.otp });
    },
  });

  const detailsForm = useForm({
    defaultValues: {
      first_name: "",
      last_name: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      if (!email) {
        toast.error("Email is missing. Please start over.");
        setCurrentStep("email");
        return;
      }
      signupMutation.mutate({ ...value, email });
    },
  });

  const handleFocus = (name: string, focused: boolean) => {
    setIsFocused((prev) => ({ ...prev, [name]: focused }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const renderStep = () => {
    if (showSuccessAnimation) {
      return (
        <div className="flex flex-col items-center justify-center space-y-4 text-center min-h-[200px]">
          <CheckCircle className="h-16 w-16 text-brand-green animate-pulse" />
          <h2 className="text-2xl sm:text-3xl font-semibold text-brand-indigo font-inter">
            Account Created!
          </h2>
          <p className="text-brand-indigo/50 font-dm-sans">
            Redirecting you to the dashboard...
          </p>
        </div>
      );
    }

    switch (currentStep) {
      case "email":
        return (
          <>
            <div className="space-y-2 text-center">
              <h2 className="text-2xl sm:text-3xl font-semibold text-brand-indigo font-inter">
                Create your account
              </h2>
              <p className="text-brand-indigo/50 font-dm-sans">
                Enter your email to get started
              </p>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                emailForm.handleSubmit();
              }}
              className="space-y-6"
            >
              <emailForm.Field
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
                  <div>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="email"
                      placeholder="Email"
                      value={field.state.value}
                      onBlur={() => {
                        field.handleBlur();
                        handleFocus("email", false);
                      }}
                      onFocus={() => handleFocus("email", true)}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className={cn(
                        "h-12 bg-brand-indigo/5 border-brand-indigo/20 text-brand-indigo placeholder:text-brand-indigo/40 focus:border-brand-green transition-all rounded-xl font-dm-sans",
                        field.state.meta.errors.length > 0 &&
                          "border-red-500 focus:border-red-500",
                        isFocused["email"] &&
                          !field.state.meta.errors.length &&
                          "border-brand-green"
                      )}
                    />
                    <FieldInfo field={field} />
                  </div>
                )}
              />
              <emailForm.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                  <Button
                    type="submit"
                    disabled={
                      !canSubmit || isSubmitting || initMutation.isPending
                    }
                    className="w-full h-12 bg-brand-indigo text-white hover:bg-brand-indigo/90 group disabled:opacity-50 font-dm-sans font-medium rounded-xl"
                  >
                    {isSubmitting || initMutation.isPending
                      ? "Sending OTP..."
                      : "Continue"}
                    {!(isSubmitting || initMutation.isPending) && (
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    )}
                  </Button>
                )}
              />
            </form>
          </>
        );

      case "otp":
        return (
          <>
            <div className="space-y-2 text-center">
              <h2 className="text-2xl sm:text-3xl font-semibold text-brand-indigo font-inter">
                Verify your email
              </h2>
              <p className="text-brand-indigo/50 font-dm-sans">
                Enter the 6-digit code sent to {email}
              </p>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                otpForm.handleSubmit();
              }}
              className="space-y-6 flex flex-col items-center"
            >
              <otpForm.Field
                name="otp"
                validators={{
                  onChange: ({ value }) =>
                    !value
                      ? "OTP is required"
                      : value.length !== 6
                      ? "OTP must be 6 digits"
                      : undefined,
                  onBlur: ({ value }) =>
                    !value ? "OTP is required" : undefined,
                }}
                children={(field) => (
                  <div className="flex flex-col items-center">
                    <InputOTP
                      id={field.name}
                      name={field.name}
                      maxLength={6}
                      value={field.state.value}
                      onChange={(value) => field.handleChange(value)}
                      onBlur={field.handleBlur}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} className="text-brand-indigo border-brand-indigo/20" />
                        <InputOTPSlot index={1} className="text-brand-indigo border-brand-indigo/20" />
                        <InputOTPSlot index={2} className="text-brand-indigo border-brand-indigo/20" />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={3} className="text-brand-indigo border-brand-indigo/20" />
                        <InputOTPSlot index={4} className="text-brand-indigo border-brand-indigo/20" />
                        <InputOTPSlot index={5} className="text-brand-indigo border-brand-indigo/20" />
                      </InputOTPGroup>
                    </InputOTP>
                    <FieldInfo field={field} />
                  </div>
                )}
              />
              <otpForm.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                  <Button
                    type="submit"
                    disabled={
                      !canSubmit || isSubmitting || verifyMutation.isPending
                    }
                    className="w-full h-12 bg-brand-indigo text-white hover:bg-brand-indigo/90 group mt-4 disabled:opacity-50 font-dm-sans font-medium rounded-xl"
                  >
                    {isSubmitting || verifyMutation.isPending
                      ? "Verifying..."
                      : "Verify Email"}
                    {!(isSubmitting || verifyMutation.isPending) && (
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    )}
                  </Button>
                )}
              />
            </form>
            <Button
              variant="link"
              onClick={() => setCurrentStep("email")}
              className="text-brand-green hover:underline mt-2"
            >
              Change email
            </Button>
          </>
        );

      case "details":
        return (
          <>
            <div className="space-y-2 text-center">
              <h2 className="text-2xl sm:text-3xl font-semibold text-brand-indigo font-inter">
                Complete your profile
              </h2>
              <p className="text-brand-indigo/50 font-dm-sans">
                Enter your details to finish signing up
              </p>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                detailsForm.handleSubmit();
              }}
              className="space-y-4"
            >
              <detailsForm.Field
                name="first_name"
                validators={{
                  onChange: ({ value }) =>
                    !value ? "First name is required" : undefined,
                  onBlur: ({ value }) =>
                    !value ? "First name is required" : undefined,
                }}
                children={(field) => (
                  <div>
                    <Input
                      id={field.name}
                      name={field.name}
                      placeholder="First Name"
                      value={field.state.value}
                      onBlur={() => {
                        field.handleBlur();
                        handleFocus("first_name", false);
                      }}
                      onFocus={() => handleFocus("first_name", true)}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className={cn(
                        "h-12 bg-brand-indigo/5 border-brand-indigo/20 text-brand-indigo placeholder:text-brand-indigo/40 focus:border-brand-green transition-all rounded-xl font-dm-sans",
                        field.state.meta.errors.length > 0 &&
                          "border-red-500 focus:border-red-500",
                        isFocused["first_name"] &&
                          !field.state.meta.errors.length &&
                          "border-brand-green"
                      )}
                    />
                    <FieldInfo field={field} />
                  </div>
                )}
              />
              <detailsForm.Field
                name="last_name"
                validators={{
                  onChange: ({ value }) =>
                    !value ? "Last name is required" : undefined,
                  onBlur: ({ value }) =>
                    !value ? "Last name is required" : undefined,
                }}
                children={(field) => (
                  <div>
                    <Input
                      id={field.name}
                      name={field.name}
                      placeholder="Last Name"
                      value={field.state.value}
                      onBlur={() => {
                        field.handleBlur();
                        handleFocus("last_name", false);
                      }}
                      onFocus={() => handleFocus("last_name", true)}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className={cn(
                        "h-12 bg-brand-indigo/5 border-brand-indigo/20 text-brand-indigo placeholder:text-brand-indigo/40 focus:border-brand-green transition-all rounded-xl font-dm-sans",
                        field.state.meta.errors.length > 0 &&
                          "border-red-500 focus:border-red-500",
                        isFocused["last_name"] &&
                          !field.state.meta.errors.length &&
                          "border-brand-green"
                      )}
                    />
                    <FieldInfo field={field} />
                  </div>
                )}
              />
              <detailsForm.Field
                name="password"
                validators={{
                  onChange: ({ value }) =>
                    !value
                      ? "Password is required"
                      : value.length < 8
                      ? "Password must be at least 8 characters"
                      : undefined,
                  onBlur: ({ value }) =>
                    !value
                      ? "Password is required"
                      : value.length < 8
                      ? "Password must be at least 8 characters"
                      : undefined,
                }}
                children={(field) => (
                  <div>
                    <div className="relative">
                      <Input
                        id={field.name}
                        name={field.name}
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={field.state.value}
                        onBlur={() => {
                          field.handleBlur();
                          handleFocus("password", false);
                        }}
                        onFocus={() => handleFocus("password", true)}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className={cn(
                          "h-12 bg-brand-indigo/5 border-brand-indigo/20 text-brand-indigo placeholder:text-brand-indigo/40 focus:border-brand-green transition-all pr-10 rounded-xl font-dm-sans",
                          field.state.meta.errors.length > 0 &&
                            "border-red-500 focus:border-red-500",
                          isFocused["password"] &&
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
                    </div>
                    <FieldInfo field={field} />
                  </div>
                )}
              />
              <detailsForm.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                  <Button
                    type="submit"
                    disabled={
                      !canSubmit || isSubmitting || signupMutation.isPending
                    }
                    className="w-full h-12 bg-brand-indigo text-white hover:bg-brand-indigo/90 group mt-6 disabled:opacity-50 font-dm-sans font-medium rounded-xl"
                  >
                    {isSubmitting || signupMutation.isPending
                      ? "Creating Account..."
                      : "Sign Up"}
                    {!(isSubmitting || signupMutation.isPending) && (
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    )}
                  </Button>
                )}
              />
            </form>
            <Button
              variant="link"
              onClick={() => setCurrentStep("otp")}
              className="text-brand-green hover:underline mt-2"
            >
              Entered wrong OTP?
            </Button>
          </>
        );
      default:
        return null;
    }
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
            {renderStep()}

            {currentStep === "email" && !showSuccessAnimation && (
              <p className="text-xs text-brand-indigo/40 text-center font-dm-sans">
                By signing up, you agree to our{" "}
                <a
                  href="/coming-soon"
                  className="text-brand-green hover:underline"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="/coming-soon"
                  className="text-brand-green hover:underline"
                >
                  Privacy Policy
                </a>
              </p>
            )}
          </div>
        </div>

        {!showSuccessAnimation && (
          <div className="text-center mt-8">
            <p className="text-brand-indigo/50 font-dm-sans">
              Already have an account?{" "}
              <Link href="/login" className="text-brand-green hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
