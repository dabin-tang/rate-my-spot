import request, { type Result } from '@/shared/api/axios';
import type { UserUpdateDTO } from '../types';

export const updateUserProfile = (data: UserUpdateDTO): Promise<Result<null>> => {
  return request.put('/api/user/update', data);
};
