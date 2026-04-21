import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AdminUser } from '../types';

interface AdminAuthState {
  adminUser: AdminUser | null;
  adminToken: string | null;
}

interface AdminAuthActions {
  login: (userData: AdminUser, tokenStr: string) => void;
  logout: () => void;
}

export type AdminAuthStore = AdminAuthState & AdminAuthActions;

export const useAdminAuthStore = create<AdminAuthStore>()(
  persist(
    (set) => ({
      adminUser: null,
      adminToken: null,

      login: (userData: AdminUser, tokenStr: string) => {
        set({ adminUser: userData, adminToken: tokenStr });
      },

      logout: () => {
        set({ adminUser: null, adminToken: null });
      },
    }),
    {
      name: 'rate-my-spot-admin-auth', // Key used in localStorage
    }
  )
);
