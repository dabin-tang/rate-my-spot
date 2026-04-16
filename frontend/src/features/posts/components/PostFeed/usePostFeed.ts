import { useInfiniteQuery } from '@tanstack/react-query';
import { getFeed } from '../../api/getFeed';
import type { PostResponse } from '../../types';

export const usePostFeed = (categoryId?: number, sort: string = 'latest') => {

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ['postFeed', categoryId || 'all', sort],
    queryFn: ({ pageParam = 1 }) => getFeed({ categoryId, sort, page: pageParam, size: 20 }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      // Access the inner real payload logic
      const resultObj = (lastPage as any)?.data;
      if (!resultObj) return undefined;
      // If the page's list length is less than 20, we have exhausted the DB
      const loadedInThisPage = resultObj.list?.length || 0;
      if (loadedInThisPage < 20) return undefined;
      // Otherwise fetch next page
      return allPages.length + 1;
    }
  });

  const posts: PostResponse[] = data?.pages.flatMap((page: any) => page?.data?.list || []) || [];

  return {
    posts,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  };
};
