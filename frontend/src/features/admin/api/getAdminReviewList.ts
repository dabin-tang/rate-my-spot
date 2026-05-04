import request from '../../../shared/api/axios';
import type { Result } from '../../../shared/api/axios';
import type { AdminReviewQueryDTO, SpotReviewResponse, PageResult } from '../types';

export const getAdminReviewList = async (params: AdminReviewQueryDTO): Promise<Result<PageResult<SpotReviewResponse>>> => {
  return request.get<Result<PageResult<SpotReviewResponse>>, Result<PageResult<SpotReviewResponse>>>('/api/admin/spot-review/list', { params });
};
