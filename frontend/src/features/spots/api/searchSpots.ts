import request, { type Result } from '@/shared/api/axios';
import type { SpotResponse } from '../types';

export const searchSpots = (keyword: string): Promise<Result<SpotResponse[]>> => {
  return request.get('/api/spot/search', { params: { keyword } });
};
