import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Match the frontend UserDTO required structure
export interface User {
  id: number;
  email: string;
  nickname: string;
  icon?: string;
  gender?: number;
  intro?: string;
  credit?: number;
}

interface AuthState {
  user: User | null;
  token: string | null;
}

interface AuthActions {
  login: (userData: User, tokenStr: string) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

export type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,

      login: (userData: User, tokenStr: string) => {
        set({ user: userData, token: tokenStr });
      },

      logout: () => {
        set({ user: null, token: null });
      },

      updateUser: (userData: Partial<User>) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null
        }));
      }
    }),
    {
      name: 'rate-my-spot-auth', // Key used in localStorage
      // Optionally define which fields to save, default is all
      // partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);
