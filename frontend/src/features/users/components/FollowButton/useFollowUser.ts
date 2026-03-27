import { useState, useEffect } from 'react';
import { message } from 'antd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { followUser } from '../../api/followUser';
import { useAuthStore } from '../../../auth/stores/useAuthStore';

export const useFollowUser = (userId: number, initialIsFollowing: boolean) => {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const { token } = useAuthStore();

  useEffect(() => {
    setIsFollowing(initialIsFollowing);
  }, [initialIsFollowing]);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => followUser(userId),
    onSuccess: () => {
      // Toggle the local state optimistically
      const newStatus = !isFollowing;
      setIsFollowing(newStatus);
      message.success(newStatus ? 'Successfully followed user' : 'Unfollowed user');
      
      // Force Profile counts update invalidating specific domain keys natively
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      queryClient.invalidateQueries({ queryKey: ['follow'] });
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
