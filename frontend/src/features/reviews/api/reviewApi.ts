import request, { type Result } from '@/shared/api/axios';
import type { SpotReviewResponse, SpotReviewCreateDTO } from '../types';

export const getSpotReviews = async (spotId: number, page: number = 1, size: number = 10): Promise<Result<{ list: SpotReviewResponse[], total: number }>> => {
  return request.get('/api/spot-review/list', {
    params: { spotId, page, size }
  });
};

export const createSpotReview = async (data: SpotReviewCreateDTO): Promise<Result<null>> => {
  return request.post('/api/spot-review/create', data);
};
