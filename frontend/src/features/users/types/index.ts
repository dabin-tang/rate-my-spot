// src/features/users/types/index.ts
export interface UserUpdateDTO {
  nickname?: string;
  icon?: string;
  gender?: number;
  intro?: string;
  city?: string;
}

// Re-export User basic info
export type { User } from '@/features/auth/stores/useAuthStore';
