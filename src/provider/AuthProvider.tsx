"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { AuthUser, UserInfo } from "@/models/user";
import { clearAccessToken } from "@/api/cookie-action";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AuthUser | null;
  login: (user: AuthUser) => void;
  signup: (user: AuthUser) => void;
  update: (user: UserInfo) => void;
  changePassword: (user: AuthUser) => void;
  logout: () => Promise<void>;
}

const saveUserToStorage = (user: UserInfo) => {
  try {
    localStorage.setItem("securePrepTrackUser", JSON.stringify(user));
  } catch (error) {
    return;
  }
};

const removeUserFromStorage = () => {
  try {
    localStorage.removeItem("securePrepTrackUser");
  } catch (error) {
    return;
  }
};

const getUserFromStorage = (): UserInfo | null => {
  try {
    const user = localStorage.getItem("securePrepTrackUser");
    return user ? JSON.parse(user) : null;
  } catch (error) {
    return null;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [authState, setAuthState] = useState<{
    user: AuthUser | null;
    isLoading: boolean;
    isAuthenticated: boolean;
  }>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  const router = useRouter();

  useEffect(() => {
    const initializeAuth = async () => {
      const storedUser = getUserFromStorage();
      if (storedUser) {
        setAuthState({
          user: { user_info: storedUser },
          isLoading: false,
          isAuthenticated: true,
        });
      } else {
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback(
    async (user: AuthUser) => {
      saveUserToStorage(user.user_info);
      await new Promise((resolve) => {
        setAuthState({
          user: { user_info: user.user_info },
          isLoading: false,
          isAuthenticated: true,
        });
        resolve(true);
      });
    },
    [router]
  );

  const signup = useCallback(
    (user: AuthUser) => {
      saveUserToStorage(user.user_info);
      setAuthState({
        user: { user_info: user.user_info },
        isLoading: false,
        isAuthenticated: true,
      });
    },
    [router]
  );

  const update = useCallback(
    async (user: UserInfo) => {
      saveUserToStorage(user);
      setAuthState({
        user: { user_info: user },
        isLoading: false,
        isAuthenticated: true,
      });
    },
    [router]
  );

  const changePassword = useCallback(
    async (user: AuthUser) => {
      saveUserToStorage(user.user_info);
      await new Promise((resolve) => {
        setAuthState({
          user: { user_info: user.user_info },
          isLoading: false,
          isAuthenticated: true,
        });
        resolve(true);
      });
    },
    [router]
  );

  const logout = useCallback(async () => {
    try {
      await clearAccessToken();

      removeUserFromStorage();

      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
      router.replace("/login", { scroll: false });
    } catch (error) {
      return;
    }
  }, [router]);

  const contextValue = useMemo(
    () => ({
      isAuthenticated: authState.isAuthenticated,
      user: authState.user,
      isLoading: authState.isLoading,
      login,
      signup,
      update,
      changePassword,
      logout,
    }),
    [authState, login, logout, signup]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {authState.isLoading ? (
        <div className="min-h-screen w-full flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
