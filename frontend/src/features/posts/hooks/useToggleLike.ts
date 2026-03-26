import { useMutation, useQueryClient } from '@tanstack/react-query';
import { togglePostLike } from '../api/postLikeApi';
import type { PostResponse } from '../types';
import { message } from 'antd';
import { useAuthStore } from '../../auth/stores/useAuthStore';

// A generic hook for optimistic updates on a post's like status.
// It accepts an array of query keys that contain PostResponse objects or paginated results of PostResponse.
export const useToggleLike = () => {
  const queryClient = useQueryClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const token = useAuthStore((state: any) => state.token);

  return useMutation({
    mutationFn: async (postId: number) => {
      if (!token) {
        message.warning('Please log in to continue.');
        throw new Error('AUTH_REQUIRED');
      }
      return togglePostLike(postId);
    },
    onMutate: async (postId: number) => {
      const targetPrefixes = ['postDetail', 'postFeed', 'userPosts', 'userLikes'];

      // 1. Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({
        predicate: query => targetPrefixes.includes(query.queryKey[0] as string)
      });

      // 2. Discover and snapshot all relevant queries across the entire app
      const activeQueries = queryClient.getQueriesData({
        predicate: query => targetPrefixes.includes(query.queryKey[0] as string)
      });
      const previousData = activeQueries.map(([queryKey, data]) => ({ queryKey, data }));

      // 3. Optimistically update all discovered queries instantly
      activeQueries.forEach(([queryKey]) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        queryClient.setQueryData(queryKey, (oldData: any) => {
          if (!oldData) return oldData;

          const isUserLikesFeed = Array.isArray(queryKey) && queryKey[0] === 'userLikes';

          // Helper to toggle a single post
          const toggleSinglePost = (post: PostResponse): PostResponse => {
            if (post.id === postId) {
              const isLiked = !post.isLiked;
              const likedCount = isLiked ? (post.liked || 0) + 1 : Math.max(0, (post.liked || 0) - 1);
              return { ...post, isLiked, liked: likedCount };
            }
            return post;
          };

          // Helper to process lists globally: toggle stats, and remove from 'userLikes' if unliked
          const processList = (list: PostResponse[] | undefined) => {
            if (!list) return [];
            const mapped = list.map(toggleSinglePost);
            if (isUserLikesFeed) {
              // Immediately remove the post if it is unliked
              return mapped.filter(p => p.id !== postId || p.isLiked);
            }
            return mapped;
          };

          // Case 1: Infinite Query Data (Pages of arrays)
          if (oldData.pages) {
            return {
              ...oldData,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              pages: oldData.pages.map((page: any) => ({
                ...page,
                list: processList(page.list)
              }))
            };
          }

          // Determine if we are dealing with a standard Axios Result wrapper
          const hasDataWrapper = oldData.code !== undefined && oldData.data !== undefined;
          const targetData = hasDataWrapper ? oldData.data : oldData;

          if (!targetData) return oldData;

          // Case 2: Array Data (e.g., recent posts for a spot)
          if (Array.isArray(targetData)) {
             const newList = processList(targetData);
             return hasDataWrapper ? { ...oldData, data: newList } : newList;
          }

          // Case 3: PageResult Data (e.g., standard pagination wrapper)
          if (targetData.list && Array.isArray(targetData.list)) {
            const newList = processList(targetData.list);
            return hasDataWrapper 
              ? { ...oldData, data: { ...targetData, list: newList } }
              : { ...targetData, list: newList };
          }

          // Case 4: Single Post Data
          if (targetData.id === postId) {
            const newPost = toggleSinglePost(targetData);
            return hasDataWrapper ? { ...oldData, data: newPost } : newPost;
          }

          return oldData;
        });
      });

      // 4. Return a context object with the snapshotted value
      return { previousData };
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (err, _postId, context) => {
      if (context?.previousData) {
        context.previousData.forEach(({ queryKey, data }) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      if (err.message !== 'AUTH_REQUIRED') {
        message.error('Failed to update like status');
      }
    },
    // Always refetch after error or success to ensure server sync
    onSettled: () => {
      const targetPrefixes = ['postDetail', 'postFeed', 'userPosts', 'userLikes'];
      queryClient.invalidateQueries({
        predicate: query => targetPrefixes.includes(query.queryKey[0] as string)
      });
    },
  });
};
