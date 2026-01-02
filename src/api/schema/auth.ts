import { object } from "yup";

import {
  digitConstraint,
  emailConstraint,
  nameConstraint,
  passwordConstraint,
} from "@/common/constraint";

export const LoginSchema = object({
  email: emailConstraint(false),
  password: passwordConstraint(false),
});

export const InitSchema = object({
  email: emailConstraint(false),
});

export const VerifySchema = object({
  email: emailConstraint(false),
  otp: digitConstraint(false, "OTP"),
});

export const SignupSchema = object({
  first_name: nameConstraint("First name", false),
  last_name: nameConstraint("Last name", false),
  email: emailConstraint(false),
  password: digitConstraint(false, "Password"),
});

export const ResetPasswordSchema = object({
  email: emailConstraint(false),
  otp: digitConstraint(false, "OTP"),
  new_password: passwordConstraint(false),
});

export const SendVerificationSchema = object({
  email: emailConstraint(false),
});

export const ChangeEmailSchema = object({
  email: emailConstraint(false),
  otp: digitConstraint(false, "OTP"),
});

export const ChangePasswordSchema = object({
  current_password: passwordConstraint(false),
  new_password: passwordConstraint(false),
  otp: digitConstraint(false, "OTP"),
});

export const UpdateNameSchema = object({
  first_name: nameConstraint("First name", true),
  last_name: nameConstraint("Last name", true),
}).test(
  "at-least-one-name",
  "At least one of first name or last name must be provided",
  (value) => {
    return !!(value.first_name || value.last_name);
  }
);
