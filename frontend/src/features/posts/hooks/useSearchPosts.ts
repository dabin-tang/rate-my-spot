import { useInfiniteQuery } from '@tanstack/react-query';
import { searchPosts } from '../api/searchPosts';
import type { PostResponse } from '../types';

export const useSearchPosts = (keyword: string, enabled: boolean) => {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ['searchPosts', keyword],
    queryFn: ({ pageParam = 1 }) => searchPosts(keyword, pageParam, 20),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const resultObj = lastPage?.data;
      if (!resultObj) return undefined;
      const loadedInThisPage = resultObj.list?.length || 0;
      if (loadedInThisPage < 20) return undefined;
      return allPages.length + 1;
    },
    enabled: enabled && !!keyword.trim(),
    staleTime: 60 * 1000,
  });

  const posts: PostResponse[] = data?.pages.flatMap(page => page?.data?.list || []) || [];

  return {
    posts,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  };
};
