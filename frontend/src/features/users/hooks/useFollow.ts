import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleFollow, getFollowers, getFollowing } from '../api/followApi';
import { message } from 'antd';

export const followKeys = {
  all: ['follow'] as const,
  followers: (userId?: number) => [...followKeys.all, 'followers', userId] as const,
  following: (userId?: number) => [...followKeys.all, 'following', userId] as const,
};

export const useToggleFollow = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (targetUserId: number) => toggleFollow(targetUserId),
    onSuccess: () => {
      // Invalidate both followers and following lists so counts/buttons reflect status universally
      queryClient.invalidateQueries({
        queryKey: followKeys.all,
      });

      // Additionally invalidate profile info if viewing someone's profile to update overall counts
      queryClient.invalidateQueries({
        queryKey: ['userProfile'],
      });

      // And my own info to update 'Following' counts
      queryClient.invalidateQueries({
        queryKey: ['currentUser'],
      });

      // Clear Feed caches universally to ensure Posts update their isFollow states dynamically
      queryClient.invalidateQueries({
        queryKey: ['feed'],
      });
      queryClient.invalidateQueries({
        queryKey: ['postDetail'],
      });

      if (onSuccessCallback) {
        onSuccessCallback();
      }
    },
    onError: () => {
      message.error('Failed to update follow status');
    }
  });
};

export const useFollowList = (type: 'followers' | 'following', userId?: number) => {
  return useInfiniteQuery({
    queryKey: followKeys[type](userId),
    queryFn: async ({ pageParam = 1 }) => {
      const response = type === 'followers'
        ? await getFollowers({ userId, pageNum: pageParam, pageSize: 15 })
        : await getFollowing({ userId, pageNum: pageParam, pageSize: 15 });
      return response.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.pageNum < lastPage.totalPages) {
        return lastPage.pageNum + 1;
      }
      return undefined;
    },
  });
};
