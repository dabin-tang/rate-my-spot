import { useMutation, useQueryClient } from '@tanstack/react-query';
import { togglePostLike } from '../api/postLikeApi';
import type { PostResponse } from '../types';
import { message } from 'antd';

// A generic hook for optimistic updates on a post's like status.
// It accepts an array of query keys that contain PostResponse objects or paginated results of PostResponse.
export const useToggleLike = (queryKeysToUpdate: unknown[][]) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: number) => togglePostLike(postId),
    onMutate: async (postId: number) => {
      // 1. Cancel any outgoing refetches so they don't overwrite our optimistic update
      const cancelPromises = queryKeysToUpdate.map(queryKey =>
        queryClient.cancelQueries({ queryKey })
      );
      await Promise.all(cancelPromises);

      // 2. Snapshot the previous value for all query keys
      const previousData = queryKeysToUpdate.map(queryKey => ({
        queryKey,
        data: queryClient.getQueryData(queryKey)
      }));

      // 3. Optimistically update to the new value
      queryKeysToUpdate.forEach(queryKey => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        queryClient.setQueryData(queryKey, (oldData: any) => {
          if (!oldData) return oldData;

          // Helper to toggle a single post
          const toggleSinglePost = (post: PostResponse): PostResponse => {
            if (post.id === postId) {
              const isLiked = !post.isLiked;
              const likedCount = isLiked ? (post.liked || 0) + 1 : Math.max(0, (post.liked || 0) - 1);
              return { ...post, isLiked, liked: likedCount };
            }
            return post;
          };

          // Case 1: Infinite Query Data (Pages of arrays)
          if (oldData.pages) {
            return {
              ...oldData,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              pages: oldData.pages.map((page: any) => ({
                ...page,
                list: page.list?.map(toggleSinglePost) || []
              }))
            };
          }

          // Case 2: Array Data (e.g., recent posts for a spot)
          if (Array.isArray(oldData)) {
             return oldData.map(toggleSinglePost);
          }

          // Case 3: PageResult Data (e.g., standard pagination wrapper)
          if (oldData.list && Array.isArray(oldData.list)) {
            return {
              ...oldData,
              list: oldData.list.map(toggleSinglePost)
            };
          }

          // Case 4: Single Post Data
          if (oldData.id === postId) {
            return toggleSinglePost(oldData);
          }

          return oldData;
        });
      });

      // 4. Return a context object with the snapshotted value
      return { previousData };
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (_err, _postId, context) => {
      if (context?.previousData) {
        context.previousData.forEach(({ queryKey, data }) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      message.error('Failed to update like status');
    },
    // Always refetch after error or success to ensure server sync
    onSettled: () => {
      queryKeysToUpdate.forEach(queryKey => {
        queryClient.invalidateQueries({ queryKey });
      });
    },
  });
};
