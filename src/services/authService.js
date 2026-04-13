import api from "@/lib/api";

const authService = {
  register: (payload) => api.post("/api/auth/register", payload),
  login: (payload) => api.post("/api/auth/login", payload),
};

export default authService;
