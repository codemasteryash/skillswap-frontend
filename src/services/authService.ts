import api from "@/lib/api";

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  userId: number;
  email: string;
  username: string;
  role: string;
}

const authService = {
  register: (payload: RegisterPayload) =>
    api.post<AuthResponse>("/api/auth/register", payload),

  login: (payload: LoginPayload) =>
    api.post<AuthResponse>("/api/auth/login", payload),
};

export default authService;