import api from "@/lib/api";

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

const authService = {
  register: (payload: RegisterPayload) =>
    api.post<AuthResponse>("/api/auth/register", payload),

  login: (payload: LoginPayload) =>
    api.post<AuthResponse>("/api/auth/login", payload),
};

export default authService;
