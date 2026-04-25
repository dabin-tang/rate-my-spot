import request from '../../../shared/api/axios';
import type { Result } from '../../../shared/api/axios';
import type { PageResult, AdminSpotQueryDTO } from '../types';
import type { SpotResponse } from '../../spots/types';

export const getSpotList = async (params: AdminSpotQueryDTO): Promise<Result<PageResult<SpotResponse>>> => {
  return request.get<Result<PageResult<SpotResponse>>, Result<PageResult<SpotResponse>>>('/api/admin/spot/list', { params });
};
