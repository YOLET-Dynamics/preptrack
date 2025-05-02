import { InferType } from "yup";
import {
  ChangeEmailSchema,
  ChangePasswordSchema,
  InitSchema,
  LoginSchema,
  ResetPasswordSchema,
  SendVerificationSchema,
  SignupSchema,
  UpdateNameSchema,
  VerifySchema,
} from "./schema/auth";
import { HttpResponse } from "@/common/response";
import { AuthUser, InitResponse, UserInfo } from "@/models/user";
import { identityClient } from "@/provider/HttpInterceptor";

export const authApi = {
  async login(body: InferType<typeof LoginSchema>) {
    try {
      const { data: result } = await identityClient.post<
        HttpResponse<AuthUser>
      >("/auth/login", body);

      if (!result.success) {
        return Promise.reject(result.data);
      }

      return result.data as AuthUser;
    } catch (error: any) {
      return Promise.reject("An unexpected error occurred");
    }
  },

  async init(body: InferType<typeof InitSchema>) {
    try {
      const { data: result } = await identityClient.post<
        HttpResponse<InitResponse>
      >("/auth/init", body);

      if (!result.success) {
        return Promise.reject(result.data);
      }

      return result.data as InitResponse;
    } catch (error: any) {
      return Promise.reject("An unexpected error occurred");
    }
  },

  async verify(body: InferType<typeof VerifySchema>) {
    try {
      const { data: result } = await identityClient.post<HttpResponse<null>>(
        "/auth/verify-otp",
        body
      );

      if (result.success && !result.success) {
        return Promise.reject(result.data);
      }

      return result.data;
    } catch (error: any) {
      return Promise.reject("An unexpected error occurred");
    }
  },

  async signup(body: InferType<typeof SignupSchema>) {
    try {
      const { data: result } = await identityClient.post<
        HttpResponse<AuthUser>
      >("auth/signup", body, {});

      if (!result.success) {
        return Promise.reject(result.data);
      }

      return result.data;
    } catch (error: any) {
      return Promise.reject("An unexpected error occurred");
    }
  },

  async sendVerification(body: InferType<typeof SendVerificationSchema>) {
    try {
      const { data: result } = await identityClient.post<HttpResponse<string>>(
        "auth/send-verification",
        body,
        {}
      );

      if (!result.success) {
        return Promise.reject(result.data);
      }

      return result.data as string;
    } catch (error: any) {
      return Promise.reject("An unexpected error occurred");
    }
  },

  async resetPassword(body: InferType<typeof ResetPasswordSchema>) {
    try {
      const { data: result } = await identityClient.post<HttpResponse<string>>(
        "auth/reset-password",
        body,
        {}
      );

      if (!result.success) {
        return Promise.reject(result.data);
      }

      return result.data as string;
    } catch (error: any) {
      return Promise.reject("An unexpected error occurred");
    }
  },

  async updateEmail(body: InferType<typeof ChangeEmailSchema>) {
    try {
      const { data: result } = await identityClient.put<HttpResponse<string>>(
        "auth/update-email",
        body,
        {}
      );

      if (!result.success) {
        return Promise.reject(result.data);
      }

      return result.data as string;
    } catch (error: any) {
      return Promise.reject("An unexpected error occurred");
    }
  },

  async updateName(body: InferType<typeof UpdateNameSchema>) {
    try {
      const { data: result } = await identityClient.put<HttpResponse<UserInfo>>(
        "auth/user",
        body,
        {}
      );

      if (!result.success) {
        return Promise.reject(result.data);
      }

      return result.data as UserInfo;
    } catch (error: any) {
      return Promise.reject("An unexpected error occurred");
    }
  },

  async updatePassword(body: InferType<typeof ChangePasswordSchema>) {
    try {
      const { data: result } = await identityClient.put<HttpResponse<string>>(
        "auth/password",
        body,
        {}
      );

      if (!result.success) {
        return Promise.reject(result.data);
      }

      return result.data as string;
    } catch (error: any) {
      return Promise.reject("An unexpected error occurred");
    }
  },
};
