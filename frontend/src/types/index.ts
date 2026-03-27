// ─── User ─────────────────────────────────────────────────────────────────────
export interface User {
  lastMessage?: string;
  _id: string;
  fullName: string;
  email: string;
  profilePic: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Message ──────────────────────────────────────────────────────────────────
export interface Message {
  _id: string;
  sender: User;
  receiver: User;
  text?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Auth form payloads ───────────────────────────────────────────────────────
export interface SignupData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginData {
  email: string;
  password: string;
}

// ─── Zustand store shape ──────────────────────────────────────────────────────
export interface AuthState {
  authUser: User | null;
  isCheckingAuth: boolean;
  isAuthenticated: boolean;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isLoggingOut: boolean;
  isUpdatingProfile: boolean;

  checkAuth: () => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  login: (data: LoginData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfilePic: (data: FormData) => Promise<void>;
}

export interface ChatState {
  selectedUser: User | null;
  isSoundEnabled: boolean;
  activeTab: "chats" | "contacts";
  allContacts: User[];
  chats: User[];
  messages: Message[];
  isUsersLoading: boolean;
  isMessagesLoading: boolean;

  toggleSound: () => void;
  setActiveTab: (tab: "chats" | "contacts") => void;
  setSelectedUser: (user: User | null) => void;
  getAllContacts: () => Promise<void>;
  getMyChatPartners: () => Promise<void>;
}
