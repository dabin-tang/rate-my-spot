import { useQuery } from '@tanstack/react-query';
import { getFeed } from '../../api/getFeed';
import type { PostResponse } from '../../types';

export const usePostFeed = (categoryId?: number, sort: string = 'latest') => {

  const { data, isLoading, isError } = useQuery({
    queryKey: ['postFeed', categoryId || 'all', sort],
    queryFn: () => getFeed({ categoryId, sort, page: 1, size: 20 }),
  });

  const posts: PostResponse[] = (data as any)?.data?.list || [];

  return {
    posts,
    isLoading,
    isError
  };
};
