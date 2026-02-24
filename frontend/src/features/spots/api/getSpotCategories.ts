import request, { type Result } from '@/shared/api/axios';
import type { SpotCategory } from '../types';

export const getSpotCategories = (): Promise<Result<SpotCategory[]>> => {
  return request.get('/api/spot-category/list');
};
