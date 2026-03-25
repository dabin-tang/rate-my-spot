import { useInfiniteQuery } from '@tanstack/react-query';
import { getPostsByUser } from '../api/getPostsByUser';
import type { PostResponse } from '../types';

export const useUserPosts = (userId: number) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError
  } = useInfiniteQuery({
    queryKey: ['userPosts', userId],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await getPostsByUser(userId, pageParam as number, 12);
      return response.data; // PageResult<PostResponse>
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage || !lastPage.list || lastPage.list.length < 12) {
        return undefined;
      }
      return allPages.length + 1;
    },
    enabled: !!userId,
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
