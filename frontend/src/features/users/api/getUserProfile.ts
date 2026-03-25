import request, { type Result } from '@/shared/api/axios';
import type { UserProfileDTO } from '../types';

export const getUserProfile = (userId: number): Promise<Result<UserProfileDTO>> => {
  return request.get(`/api/user/${userId}`);
};
