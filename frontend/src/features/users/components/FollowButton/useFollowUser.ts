import { useState } from 'react';
import { message } from 'antd';
import { useMutation } from '@tanstack/react-query';
import { followUser } from '../../api/followUser';
import { useAuthStore } from '../../../auth/stores/useAuthStore';

export const useFollowUser = (userId: number, initialIsFollowing: boolean) => {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const { token } = useAuthStore();

  const mutation = useMutation({
    mutationFn: () => followUser(userId),
    onSuccess: () => {
      // Toggle the local state optimistically
      const newStatus = !isFollowing;
      setIsFollowing(newStatus);
      message.success(newStatus ? 'Successfully followed user' : 'Unfollowed user');
    },
    onError: () => {
      message.error('Failed to update follow status');
    }
  });

  const toggleFollow = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!token) {
      message.warning('Please log in to follow users');
      return;
    }
    mutation.mutate();
  };

  return {
    isFollowing,
    toggleFollow,
    isLoading: mutation.isPending
  };
};
