import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { handleApiError } from "../lib/handleApiError";
import toast from "react-hot-toast";
import type { AuthState, LoginData, SignupData } from "../types";

import { io } from "socket.io-client";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:3000" : "";
export const useAuthStore = create<AuthState>((set, get) => ({
  authUser: null,

  isAuthenticated: false,
  isCheckingAuth: false,
  isSigningUp: false,
  isLoggingIn: false,
  isLoggingOut: false,
  isUpdatingProfile: false,
  socket: null,
  onlineUsers: [],

  checkAuth: async () => {
    try {
      set({ isCheckingAuth: true });
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data.data.user, isAuthenticated: true });
      get().connectSocket();
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
      set({ authUser: res.data.data.user, isAuthenticated: true });
      get().connectSocket();
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

      set({ authUser: res.data.data.user, isAuthenticated: true });
      get().connectSocket();
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
      get().disconnectSocket();
      toast.success("Logged out successfully.");
    } catch (error) {
      handleApiError(error, "Logout failed. Please try again.");
    } finally {
      set({ isLoggingOut: false });
    }
  },

  updateProfilePic: async (data: FormData) => {
    try {
      set({ isUpdatingProfile: true });
      const res = await axiosInstance.patch(
        "/auth/update-profile-picture",
        data,
      );
      set({ authUser: res.data.data.user });
      toast.success("Profile updated successfully.");
    } catch (error) {
      handleApiError(error, "Profile update failed. Please try again.");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;
    const socket = io(BASE_URL, { withCredentials: true });
    socket.connect();
    set({ socket });

    // listen for connection events
    socket.on("getOnlineUsers", (userIds: string[]) => {
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null, onlineUsers: [] });
    }
  },
}));
