"use client";

import axios from "axios";
import { useEffect, ReactNode } from "react";
import { useAuth } from "./AuthProvider";

export const identityClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_IDENTITY_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  validateStatus: (status) => {
    return [200, 201, 202, 204, 400, 401, 403, 404, 500].includes(status);
  },
});

export const coreClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_CONTENT_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  validateStatus: (status) => {
    return [200, 201, 202, 204, 400, 401, 403, 404, 500].includes(status);
  },
});

export const HttpInterceptor = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }
    const identityRequestInterceptor = identityClient.interceptors.request.use(
      (config) => config,
      (error) => Promise.reject(error)
    );

    const identityResponseInterceptor =
      identityClient.interceptors.response.use(
        (response) => response,
        (error) => {
          if (error.response?.status === 401) {
            logout();
          }
          return Promise.reject(error);
        }
      );

    const coreRequestInterceptor = coreClient.interceptors.request.use(
      (config) => config,
      (error) => Promise.reject(error)
    );

    const coreResponseInterceptor = coreClient.interceptors.response.use(
      (response) => response,
      (error) => Promise.reject(error)
    );

    return () => {
      identityClient.interceptors.request.eject(identityRequestInterceptor);
      identityClient.interceptors.response.eject(identityResponseInterceptor);
      coreClient.interceptors.request.eject(coreRequestInterceptor);
      coreClient.interceptors.response.eject(coreResponseInterceptor);
    };
  }, [logout, isAuthenticated]);

  return <>{children}</>;
};
