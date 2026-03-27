import { useMutation, useQueryClient } from '@tanstack/react-query';
import { setLikesPrivacy } from '../api/userSettingsApi';
import { message } from 'antd';

export const useToggleLikesPrivacy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (isPrivate: boolean) => setLikesPrivacy(isPrivate),
    onSuccess: () => {
      message.success('Privacy settings updated');
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
    onError: () => {
      message.error('Failed to update privacy settings');
    }
  });
};
