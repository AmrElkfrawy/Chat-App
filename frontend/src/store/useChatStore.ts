import { create } from "zustand";
import type { ChatState } from "../types";
import { axiosInstance } from "../lib/axios";
import { handleApiError } from "../lib/handleApiError";
import { useAuthStore } from "./useAuthStore";
const audio = new Audio("/sounds/notification.mp3");
export const useChatStore = create<ChatState>((set, get) => ({
  allContacts: [],
  chats: [],
  messages: [],
  selectedUser: null,
  activeTab: "chats",
  isUsersLoading: false,
  isMessagesLoading: false,
  isSoundEnabled: localStorage.getItem("soundEnabled") === "true",
  isMessageSending: false,

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

  getMessagesWithUserId: async (userId: string) => {
    try {
      set({ isMessagesLoading: true });
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data.data });
    } catch (error) {
      handleApiError(error, "Couldn't fetch messages, Please try again!");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (data: FormData) => {
    try {
      set({ isMessageSending: true });
      const { selectedUser } = get();
      if (!selectedUser) {
        throw new Error("No recipient selected.");
      }
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        data,
      );
      set({ messages: [...get().messages, res.data.data] });
    } catch (error) {
      handleApiError(error, "Couldn't send message, Please try again!");
      throw error;
    } finally {
      set({ isMessageSending: false });
    }
  },

  subscribeToNewMessages: () => {
    const { selectedUser, isSoundEnabled } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.off("newMessage");

    socket.on("newMessage", (newMessage: any) => {
      const isMessageFromSelectedUser = newMessage.sender === selectedUser._id;

      if (isMessageFromSelectedUser) {
        set({
          messages: [...get().messages, newMessage],
        });
      }

      if (isSoundEnabled) {
        const sound = audio.cloneNode() as HTMLAudioElement;
        sound.play().catch((e) => console.log("Audio blocked"));
      }
    });
  },

  unsubscribeFromNewMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket?.off("newMessage");
  },
}));
