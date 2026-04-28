import request from '../../../shared/api/axios';
import type { Result } from '../../../shared/api/axios';
import type { SpotCreateDTO } from '../types';
import type { SpotResponse } from '../../spots/types';

export const updateSpot = async (id: number, data: SpotCreateDTO): Promise<Result<SpotResponse>> => {
  return request.put<Result<SpotResponse>, Result<SpotResponse>>(`/api/admin/spot/${id}`, data);
};
