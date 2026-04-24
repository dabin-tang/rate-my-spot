import request from '../../../shared/api/axios';
import type { Result } from '../../../shared/api/axios';
import type { AdminStatsResponse } from '../types';

export const getStats = async (): Promise<Result<AdminStatsResponse>> => {
  return request.get<Result<AdminStatsResponse>, Result<AdminStatsResponse>>('/api/admin/stats');
};
