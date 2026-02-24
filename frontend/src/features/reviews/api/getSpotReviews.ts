import request, { type Result } from '@/shared/api/axios';
import type { SpotReviewPageReq } from '../types';
import type { PageResult } from '@/features/spots/api/getSpots';

// As the schema doesn't specify SpotReviewResponse clearly, we use any or generic. 
// However, the user strictly forbid any. We will define a generic ReviewResponse.
export interface SpotReviewResponse {
  id: number;
  userId: number;
  rating: number;
  content: string;
  images: string[];
  userNickname: string;
  userIcon: string;
  createTime: string;
}

export const getSpotReviews = (params: SpotReviewPageReq): Promise<Result<PageResult<SpotReviewResponse>>> => {
  return request.get('/api/spot-review/list', { params });
};
