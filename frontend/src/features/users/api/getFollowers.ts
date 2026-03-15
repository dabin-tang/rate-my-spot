import request, { type Result } from '../../../shared/api/axios';
import type { UserProfileDTO } from '../types';

export interface FollowListResponse {
  list: UserProfileDTO[];
  total: number;
}

export const getFollowers = (pageNum: number = 1, pageSize: number = 10): Promise<Result<FollowListResponse>> => {
  return request.get('/api/follow/followers', {
    params: { pageNum, pageSize }
  });
};
