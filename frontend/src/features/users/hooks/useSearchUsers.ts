import { useInfiniteQuery } from '@tanstack/react-query';
import { searchUsers } from '../api/searchUsers';
import type { UserResponse } from '../types';

export const useSearchUsers = (keyword: string, enabled: boolean) => {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ['searchUsers', keyword],
    queryFn: ({ pageParam = 1 }) => searchUsers(keyword, pageParam, 20),
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

  const users: UserResponse[] = data?.pages.flatMap(page => page?.data?.list || []) || [];

  return {
    users,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  };
};
