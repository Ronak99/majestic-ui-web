import { create } from "zustand";
import { User } from "@supabase/supabase-js";
import { getUser, signInWithGithub, signOut } from "@/actions/auth";

interface AuthState {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  initialized: false,

  signIn: async () => {
    try {
      await signInWithGithub();
    } catch (error) {
      console.error("Error signing in:", error);
    }
  },

  signOut: async () => {
    try {
      await signOut();
      set({ user: null });
    } catch (error) {
      console.error("Error signing out:", error);
    }
  },

  initialize: async () => {
    try {
      const user = await getUser();
      set({ user, loading: false, initialized: true });
    } catch (error) {
      console.error("Error initializing auth:", error);
      set({ loading: false, initialized: true });
    }
  },
}));
