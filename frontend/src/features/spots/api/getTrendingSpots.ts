import request, { type Result } from '@/shared/api/axios';
import type { SpotResponse } from '../types';

export const getTrendingSpots = (): Promise<Result<SpotResponse[]>> => {
  return request.get('/api/spot/trending');
};
