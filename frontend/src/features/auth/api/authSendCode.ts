import request, { type Result } from '@/shared/api/axios';

/**
 * Sends a verification code to the specified email.
 * @param email The target email address
 * @param type The type of code (0 for registration, 1 for password reset)
 */
export const authSendCode = (email: string, type: number): Promise<Result<string>> => {
  return request.post('/api/user/send-code', null, {
    params: {
      email,
      type
    }
  });
};
