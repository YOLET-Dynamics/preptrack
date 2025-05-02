"use client";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { useAuth } from "./AuthProvider";
import React from "react";
import { Loader2 } from "lucide-react";

const DEFAULT_EXCLUDED_ROUTES = ["/signup", "/login", "/", "/forgot-password"];

interface AuthGuardProps {
  children: ReactNode;
  excludedRoutes?: string[];
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  excludedRoutes = DEFAULT_EXCLUDED_ROUTES,
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated && !excludedRoutes.includes(pathname)) {
      router.replace("/login");
      return;
    }

    if (isAuthenticated && excludedRoutes.includes(pathname)) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isLoading, pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
};
