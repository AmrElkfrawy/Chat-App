import { create } from "zustand";
import type { ChatState } from "../types";
import { axiosInstance } from "../lib/axios";
import { handleApiError } from "../lib/handleApiError";

export const useChatStore = create<ChatState>((set, get) => ({
  allContacts: [],
  chats: [],
  messages: [],
  selectedUser: null,
  activeTab: "chats",
  isUsersLoading: false,
  isMessagesLoading: false,
  isSoundEnabled: localStorage.getItem("soundEnabled") === "true",

  toggleSound: () => {
    localStorage.setItem("soundEnabled", !get().isSoundEnabled + "");
    set({ isSoundEnabled: !get().isSoundEnabled });
  },
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedUser: (user) => set({ selectedUser: user }),
  getAllContacts: async () => {
    try {
      set({ isUsersLoading: true });
      const res = await axiosInstance.get("/messages/contacts");
      set({ allContacts: res.data.data });
    } catch (error) {
      handleApiError(error, "Couldn't fetch contacts, Please try again!");
    } finally {
      set({ isUsersLoading: false });
    }
  },
  getMyChatPartners: async () => {
    try {
      set({ isUsersLoading: true });
      const res = await axiosInstance.get("/messages/chats");
      set({ chats: res.data.data });
    } catch (error) {
      handleApiError(error, "Couldn't fetch chats, Please try again!");
    } finally {
      set({ isUsersLoading: false });
    }
  },
}));
