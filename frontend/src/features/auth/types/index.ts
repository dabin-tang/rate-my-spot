// src/features/auth/types/index.ts
export interface UserRegisterDTO {
  email: string;
  password?: string;
  code: string;
}

export interface UserLoginDTO {
  email: string;
  password?: string;
  code?: string;
}

// Re-export User from the store to avoid duplication
export type { User } from '../stores/useAuthStore';
