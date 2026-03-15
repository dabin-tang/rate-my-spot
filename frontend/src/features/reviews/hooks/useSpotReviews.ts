import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSpotReviews, createSpotReview } from '../api/reviewApi';
import type { SpotReviewCreateDTO } from '../types';

export const reviewKeys = {
  all: ['spot-reviews'] as const,
  list: (spotId: number) => [...reviewKeys.all, { spotId }] as const,
};

export const useSpotReviews = (spotId: number, page: number = 1) => {
  return useQuery({
    queryKey: [...reviewKeys.list(spotId), page],
    queryFn: async () => {
      const response = await getSpotReviews(spotId, page);
      return response.data; // PageResult
    },
    enabled: !!spotId, // Only fetch if spotId is valid
  });
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
