import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import authService, { LoginPayload, RegisterPayload } from "@/services/authService";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("skillswap_token");
    const savedUser = localStorage.getItem("skillswap_user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    const { data } = await authService.login(payload);
    localStorage.setItem("skillswap_token", data.token);
    localStorage.setItem("skillswap_user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    toast.success("Welcome back!");
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    const { data } = await authService.register(payload);
    localStorage.setItem("skillswap_token", data.token);
    localStorage.setItem("skillswap_user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    toast.success("Account created successfully!");
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("skillswap_token");
    localStorage.removeItem("skillswap_user");
    setToken(null);
    setUser(null);
    toast.success("Logged out successfully");
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated: !!token, isLoading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
