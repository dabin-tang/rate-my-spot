import request, { type Result } from '@/shared/api/axios';
import type { User } from '../types';

export const getUserProfile = (): Promise<Result<User>> => {
  return request.get('/api/user/me');
};
