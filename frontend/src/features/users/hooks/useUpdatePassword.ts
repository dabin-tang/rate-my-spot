import { useMutation } from '@tanstack/react-query';
import { updatePassword } from '../api/userSettingsApi';
import { message } from 'antd';

export const useUpdatePassword = (onSuccess?: () => void) => {
  return useMutation({
    mutationFn: ({ newPassword, code }: { newPassword: string; code: string }) => 
      updatePassword(newPassword, code),
    onSuccess: () => {
      message.success('Password updated successfully! You can now use your new password.');
      if (onSuccess) onSuccess();
    },
    onError: (error: any) => {
      message.error(error.message || 'Failed to update password. Please check your verification code.');
    }
  });
};
