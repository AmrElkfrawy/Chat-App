// ─── User ─────────────────────────────────────────────────────────────────────
export interface User {
  _id: string;
  fullName: string;
  email: string;
  profilePic: string;
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

  checkAuth: () => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  login: (data: LoginData) => Promise<void>;
  logout: () => Promise<void>;
}
