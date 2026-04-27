import request from '../../../shared/api/axios';
import type { Result } from '../../../shared/api/axios';
import type { SpotCreateDTO } from '../types';
import type { SpotResponse } from '../../spots/types';

export const createSpot = async (data: SpotCreateDTO): Promise<Result<SpotResponse>> => {
  return request.post<Result<SpotResponse>, Result<SpotResponse>>('/api/admin/spot/create', data);
};
