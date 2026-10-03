import axios from "axios";

const TOKEN_KEY = "linkqr_token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t: string) => localStorage.setItem(TOKEN_KEY, t);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export const API_BASE = `${import.meta.env.VITE_API_URL ?? ""}/api`;

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Expired/invalid token on a protected call: clear it and tell the app to log out.
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const url: string = error.config?.url ?? "";
    const isLoginCall = url.includes("/auth/login") || url.includes("/auth/register");
    const status: number | undefined = error.response?.status;
    const deactivated = status === 403 && /deactivated/i.test(String(error.response?.data?.message ?? ""));
    if ((status === 401 || deactivated) && !isLoginCall && getToken()) {
      clearToken();
      window.dispatchEvent(new Event("auth:expired"));
    }
    return Promise.reject(error);
  }
);

export function getErrorMessage(err: unknown): string {
  if (axios.isAxiosError<{ message?: string }>(err)) {
    if (err.response?.data?.message) return err.response.data.message;
    if (!err.response) return "Cannot reach the server. Please try again.";
  }
  return "Something went wrong";
}
