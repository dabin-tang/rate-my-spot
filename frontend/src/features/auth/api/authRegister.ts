import request, { type Result } from '@/shared/api/axios';
import type { UserRegisterDTO } from '../types';

export const authRegister = (data: UserRegisterDTO): Promise<Result<null>> => {
  return request.post('/api/user/register', data);
};
