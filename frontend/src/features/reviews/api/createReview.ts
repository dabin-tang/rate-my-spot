import request, { type Result } from '@/shared/api/axios';
import type { SpotReviewCreateDTO } from '../types';

export const createReview = (data: SpotReviewCreateDTO): Promise<Result<null>> => {
  return request.post('/api/spot-review/create', data);
};
