import { useInfiniteQuery } from '@tanstack/react-query';
import { getLikedPosts } from '../api/getLikedPosts';
import type { PostResponse } from '../types';

export const useUserLikes = (userId?: number, isEnabled: boolean = true) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError
  } = useInfiniteQuery({
    queryKey: ['userLikes', userId],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await getLikedPosts(userId, pageParam as number, 15);
      return response.data; // PageResult<PostResponse>
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage || !lastPage.list || lastPage.list.length < 15) {
        return undefined;
      }
      return allPages.length + 1;
    },
    enabled: isEnabled,
  });

  const posts: PostResponse[] = data?.pages.flatMap((page) => page?.list || []) || [];

  return {
    posts,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError
  };
};
