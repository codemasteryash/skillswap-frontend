import { createContext, useContext, useState, useEffect, useCallback } from "react";
import authService from "@/services/authService";
import { toast } from "sonner";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
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

  const login = useCallback(async (payload) => {
    const { data } = await authService.login(payload);
    localStorage.setItem("skillswap_token", data.token);
    localStorage.setItem("skillswap_user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    toast.success("Welcome back!");
  }, []);

  const register = useCallback(async (payload) => {
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
