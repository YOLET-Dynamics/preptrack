"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { ArrowRight, Eye, EyeOff, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import { useForm, type AnyFieldApi } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authApi } from "@/api/auth";
import { formatError } from "@/common/utils";
import type { InferType } from "yup";
import { ResetPasswordSchema } from "@/api/schema/auth";

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

type ForgotPasswordStep = "email" | "reset";

export default function ForgotPasswordPage() {
  const [currentStep, setCurrentStep] = useState<ForgotPasswordStep>("email");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isFocused, setIsFocused] = useState<Record<string, boolean>>({});

  const router = useRouter();

  const sendVerificationMutation = useMutation({
    mutationFn: authApi.sendVerification,
    onSuccess: (data, variables) => {
      setEmail(variables.email!);
      setCurrentStep("reset");
      toast.success("OTP sent successfully! Please check your email.");
    },
    onError: (error: any) => {
      toast.error(formatError(error));
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: authApi.resetPassword,
    onSuccess: () => {
      toast.success("Password reset successfully!");
      router.push("/login");
    },
    onError: (error: any) => {
      toast.error(formatError(error));
    },
  });

  const emailForm = useForm({
    defaultValues: { email: "" },
    onSubmit: async ({ value }) => {
      sendVerificationMutation.mutate(value);
    },
  });

  const resetForm = useForm({
    defaultValues: {
      otp: "",
      new_password: "",
      confirm_password: "",
    },
    onSubmit: async ({ value }) => {
      if (!email) {
        toast.error("Email is missing. Please start over.");
        setCurrentStep("email");
        return;
      }
      const { confirm_password, ...restValue } = value;
      const payload: InferType<typeof ResetPasswordSchema> = {
        ...restValue,
        email,
      };
      resetPasswordMutation.mutate(payload);
    },
  });

  const handleFocus = (name: string, focused: boolean) => {
    setIsFocused((prev) => ({ ...prev, [name]: focused }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const renderStep = () => {
    switch (currentStep) {
      case "email":
        return (
          <>
            <div className="space-y-2 text-center">
              <h2 className="text-2xl sm:text-3xl font-semibold text-brand-indigo font-inter">
                Forgot Your Password?
              </h2>
              <p className="text-brand-indigo/50 font-dm-sans">
                Enter your email to receive a reset code
              </p>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                emailForm.handleSubmit();
              }}
              className="space-y-4"
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
                      !canSubmit ||
                      isSubmitting ||
                      sendVerificationMutation.isPending
                    }
                    className="w-full h-12 bg-brand-indigo text-white hover:bg-brand-indigo/90 group disabled:opacity-50 mt-4 font-dm-sans font-medium rounded-xl"
                  >
                    {isSubmitting || sendVerificationMutation.isPending
                      ? "Sending Code..."
                      : "Send Reset Code"}
                    {!(isSubmitting || sendVerificationMutation.isPending) && (
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    )}
                  </Button>
                )}
              />
            </form>
          </>
        );

      case "reset":
        return (
          <>
            <div className="space-y-2 text-center">
              <h2 className="text-2xl sm:text-3xl font-semibold text-brand-indigo font-inter">
                Reset Your Password
              </h2>
              <p className="text-brand-indigo/50 font-dm-sans">
                Enter the code sent to {email} and set a new password.
              </p>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                resetForm.handleSubmit();
              }}
              className="space-y-4"
            >
              <resetForm.Field
                name="otp"
                validators={{
                  onChange: ({ value }) =>
                    !value
                      ? "OTP is required"
                      : value.length !== 6
                      ? "OTP must be 6 digits"
                      : !/^\d+$/.test(value)
                      ? "OTP must contain only digits"
                      : undefined,
                  onBlur: ({ value }) =>
                    !value
                      ? "OTP is required"
                      : value.length !== 6
                      ? "OTP must be 6 digits"
                      : !/^\d+$/.test(value)
                      ? "OTP must contain only digits"
                      : undefined,
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
                      className={cn(
                        field.state.meta.errors.length > 0 && "text-red-500"
                      )}
                    >
                      <InputOTPGroup
                        className={cn(
                          field.state.meta.errors.length > 0 && "border-red-500"
                        )}
                      >
                        <InputOTPSlot index={0} className="text-brand-indigo border-brand-indigo/20" />
                        <InputOTPSlot index={1} className="text-brand-indigo border-brand-indigo/20" />
                        <InputOTPSlot index={2} className="text-brand-indigo border-brand-indigo/20" />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup
                        className={cn(
                          field.state.meta.errors.length > 0 && "border-red-500"
                        )}
                      >
                        <InputOTPSlot index={3} className="text-brand-indigo border-brand-indigo/20" />
                        <InputOTPSlot index={4} className="text-brand-indigo border-brand-indigo/20" />
                        <InputOTPSlot index={5} className="text-brand-indigo border-brand-indigo/20" />
                      </InputOTPGroup>
                    </InputOTP>
                    <FieldInfo field={field} />
                  </div>
                )}
              />

              <resetForm.Field
                name="new_password"
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
                        placeholder="New Password"
                        value={field.state.value}
                        onBlur={() => {
                          field.handleBlur();
                          handleFocus("new_password", false);
                        }}
                        onFocus={() => handleFocus("new_password", true)}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className={cn(
                          "h-12 bg-brand-indigo/5 border-brand-indigo/20 text-brand-indigo placeholder:text-brand-indigo/40 focus:border-brand-green transition-all pr-10 rounded-xl font-dm-sans",
                          field.state.meta.errors.length > 0 &&
                            "border-red-500 focus:border-red-500",
                          isFocused["new_password"] &&
                            !field.state.meta.errors.length &&
                            "border-brand-green"
                        )}
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-brand-indigo/40 hover:text-brand-indigo/60"
                        aria-label={
                          showPassword
                            ? "Hide new password"
                            : "Show new password"
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

              <resetForm.Field
                name="confirm_password"
                validators={{
                  onChange: ({ value, fieldApi }) =>
                    !value
                      ? "Confirm Password is required"
                      : value !== fieldApi.form.getFieldValue("new_password")
                      ? "Passwords must match"
                      : undefined,
                  onBlur: ({ value, fieldApi }) =>
                    !value
                      ? "Confirm Password is required"
                      : value !== fieldApi.form.getFieldValue("new_password")
                      ? "Passwords must match"
                      : undefined,
                }}
                children={(field) => (
                  <div>
                    <div className="relative">
                      <Input
                        id={field.name}
                        name={field.name}
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm New Password"
                        value={field.state.value}
                        onBlur={() => {
                          field.handleBlur();
                          handleFocus("confirm_password", false);
                        }}
                        onFocus={() => handleFocus("confirm_password", true)}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className={cn(
                          "h-12 bg-brand-indigo/5 border-brand-indigo/20 text-brand-indigo placeholder:text-brand-indigo/40 focus:border-brand-green transition-all pr-10 rounded-xl font-dm-sans",
                          field.state.meta.errors.length > 0 &&
                            "border-red-500 focus:border-red-500",
                          isFocused["confirm_password"] &&
                            !field.state.meta.errors.length &&
                            "border-brand-green"
                        )}
                      />
                      <button
                        type="button"
                        onClick={toggleConfirmPasswordVisibility}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-brand-indigo/40 hover:text-brand-indigo/60"
                        aria-label={
                          showConfirmPassword
                            ? "Hide confirm password"
                            : "Show confirm password"
                        }
                      >
                        {showConfirmPassword ? (
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

              <resetForm.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                  <Button
                    type="submit"
                    disabled={
                      !canSubmit ||
                      isSubmitting ||
                      resetPasswordMutation.isPending
                    }
                    className="w-full h-12 bg-brand-indigo text-white hover:bg-brand-indigo/90 group disabled:opacity-50 mt-4 font-dm-sans font-medium rounded-xl"
                  >
                    {isSubmitting || resetPasswordMutation.isPending
                      ? "Resetting Password..."
                      : "Reset Password"}
                    {!(isSubmitting || resetPasswordMutation.isPending) && (
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    )}
                  </Button>
                )}
              />
            </form>
            <Button
              variant="link"
              onClick={() => sendVerificationMutation.mutate({ email })}
              disabled={sendVerificationMutation.isPending}
              className="text-brand-green hover:underline mt-2 text-xs w-full text-center"
            >
              {sendVerificationMutation.isPending
                ? "Sending..."
                : "Didn't receive code? Send again."}
            </Button>
            <Button
              variant="link"
              onClick={() => setCurrentStep("email")}
              className="text-brand-indigo/40 hover:underline mt-0 text-xs w-full text-center"
            >
              Entered wrong email? Start over.
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

        <div className="bg-white border border-brand-indigo/10 rounded-2xl p-8 sm:p-10 shadow-xl shadow-brand-indigo/5 min-h-[350px] flex flex-col justify-center">
          <div className="space-y-6">{renderStep()}</div>
        </div>

        <div className="text-center mt-8">
          <p className="text-brand-indigo/50 text-sm font-dm-sans">
            Remembered your password?{" "}
            <Link href="/login" passHref>
              <span className="text-brand-green hover:underline cursor-pointer">
                Sign in
              </span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
