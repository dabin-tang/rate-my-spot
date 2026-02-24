import request, { type Result } from '@/shared/api/axios';
import type { SpotResponse } from '../types';

export const getSpotById = (id: number): Promise<Result<SpotResponse>> => {
  return request.get(`/api/spot/${id}`);
};
