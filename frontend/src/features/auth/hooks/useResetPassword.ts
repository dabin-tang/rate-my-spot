import { useMutation } from '@tanstack/react-query';
import { message } from 'antd';
import { authResetPassword } from '../api/authResetPassword';
import type { UserRegisterDTO } from '../../users/types';

export const useResetPassword = (onSuccess?: () => void) => {
  return useMutation({
    mutationFn: (data: UserRegisterDTO) => authResetPassword(data),
    onSuccess: () => {
      message.success('Password reset successfully! Please log in.');
      if (onSuccess) onSuccess();
    },
    onError: (error: Error) => {
      message.error(error.message || 'Failed to reset password. Please check your code.');
    }
  });
};
