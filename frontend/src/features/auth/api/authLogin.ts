import request, { type Result } from '@/shared/api/axios';
import type { UserLoginDTO, User } from '../types';

export const authLogin = (data: UserLoginDTO): Promise<Result<{ user: User; token: string }>> => {
  return request.post('/api/user/login', data);
};
