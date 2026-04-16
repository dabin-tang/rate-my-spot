import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSpotReviews, createSpotReview } from '../api/reviewApi';
import type { SpotReviewCreateDTO, SpotReviewResponse } from '../types';

export const reviewKeys = {
  all: ['spot-reviews'] as const,
  list: (spotId: number) => [...reviewKeys.all, { spotId }] as const,
};

export const useSpotReviews = (spotId: number) => {
  const queryInfo = useInfiniteQuery({
    queryKey: reviewKeys.list(spotId),
    queryFn: async ({ pageParam = 1 }) => {
      const response = await getSpotReviews(spotId, pageParam);
      return response.data; // PageResult
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const resultObj = lastPage;
      if (!resultObj) return undefined;
      const loadedInThisPage = resultObj.list?.length || 0;
      if (loadedInThisPage < 20) return undefined;
      return allPages.length + 1;
    },
    enabled: !!spotId, // Only fetch if spotId is valid
  });

  const reviews: SpotReviewResponse[] = queryInfo.data?.pages.flatMap((page: any) => page?.list || []) || [];

  return {
    ...queryInfo,
    reviews
  };
};

export const useCreateSpotReview = (spotId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SpotReviewCreateDTO) => createSpotReview({ ...data, spotId }),
    onSuccess: () => {
      // Invalidate and refetch all review lists for this spot
      queryClient.invalidateQueries({
        queryKey: reviewKeys.list(spotId),
      });
    },
  });
};
