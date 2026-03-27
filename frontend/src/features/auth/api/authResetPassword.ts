import request, { type Result } from '@/shared/api/axios';
import type { UserRegisterDTO } from '../../users/types';

/**
 * Resets the user's password using an emailed verification code.
 * @param data Includes email, new password, and verification code
 */
export const authResetPassword = (data: UserRegisterDTO): Promise<Result<string>> => {
  return request.post('/api/user/reset-password', data);
};
