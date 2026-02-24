import request, { type Result } from '@/shared/api/axios';
import type { SpotPageReq, SpotResponse } from '../types';

export interface PageResult<T> {
  list: T[];
  total: number;
}

export const getSpots = (params: SpotPageReq): Promise<Result<PageResult<SpotResponse>>> => {
  return request.get('/api/spot/list', { params });
};
