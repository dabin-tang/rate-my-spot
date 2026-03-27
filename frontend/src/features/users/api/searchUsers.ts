import request, { type Result } from '../../../shared/api/axios';
import type { UserResponse } from '../types';

export const searchUsers = (keyword: string): Promise<Result<UserResponse[]>> => {
  return request.get('/api/user/search', {
    params: { keyword }
  });
};
