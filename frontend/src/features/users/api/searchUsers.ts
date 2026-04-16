import request, { type Result } from '../../../shared/api/axios';
import type { UserResponse } from '../types';

export const searchUsers = (keyword: string, page: number = 1, size: number = 20): Promise<Result<{ list: UserResponse[] }>> => {
  return request.get('/api/user/search', {
    params: { keyword, page, size }
  });
};
