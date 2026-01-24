import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import axios from "axios";

interface AuthState {
  authUser: object | null;
  isCheckingAuth: boolean;
  isAuthenticated: boolean;
  isSigningUp: boolean;
  isLoggingIn?: boolean;

  checkAuth?: () => Promise<void>;
  signup?: (data: {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => Promise<void>;

  login?: (data: { email: string; password: string }) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  authUser: null,

  isAuthenticated: false,
  isCheckingAuth: false,
  isSigningUp: false,

  checkAuth: async () => {
    try {
      set({ isCheckingAuth: true });
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data.user, isAuthenticated: true });
    } catch (error) {
      console.error("Auth check failed:", error);
      set({ authUser: null, isAuthenticated: false });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data: {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    try {
      set({ isSigningUp: true });
      const res = await axiosInstance.post("/auth/register", data);
      toast.success("Signup successful!");
      set({ authUser: res.data.user, isAuthenticated: true });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message || "Signup failed. Please try again.";

        toast.error(message);
      } else {
        toast.error("An unexpected error occurred, please try again.");
      }
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data: { email: string; password: string }) => {
    try {
      set({ isLoggingIn: true });
      const res = await axiosInstance.post("/auth/login", data);
      toast.success("Login successful!");
      set({ authUser: res.data.user, isAuthenticated: true });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message || "Login failed. Please try again.";
        toast.error(message);
      } else {
        toast.error("An unexpected error occurred, please try again.");
      }
    } finally {
      set({ isLoggingIn: false });
    }
  },
}));
