import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { handleApiError } from "../lib/handleApiError";
import toast from "react-hot-toast";
import type { AuthState, LoginData, SignupData } from "../types";

export const useAuthStore = create<AuthState>((set) => ({
  authUser: null,

  isAuthenticated: false,
  isCheckingAuth: false,
  isSigningUp: false,
  isLoggingIn: false,
  isLoggingOut: false,

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

  signup: async (data: SignupData) => {
    try {
      set({ isSigningUp: true });
      const res = await axiosInstance.post("/auth/register", data);
      toast.success("Signup successful!");
      set({ authUser: res.data.user, isAuthenticated: true });
    } catch (error) {
      handleApiError(error, "Signup failed. Please try again.");
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data: LoginData) => {
    try {
      set({ isLoggingIn: true });
      const res = await axiosInstance.post("/auth/login", data);
      toast.success("Login successful!");
      set({ authUser: res.data.user, isAuthenticated: true });
    } catch (error) {
      handleApiError(error, "Login failed. Please try again.");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      set({ isLoggingOut: true });
      await axiosInstance.post("/auth/logout");
      set({ authUser: null, isAuthenticated: false });
      toast.success("Logged out successfully.");
    } catch (error) {
      handleApiError(error, "Logout failed. Please try again.");
    } finally {
      set({ isLoggingOut: false });
    }
  },
}));
