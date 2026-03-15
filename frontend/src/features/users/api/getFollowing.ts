import request, { type Result } from '../../../shared/api/axios';
import type { FollowListResponse } from './getFollowers';

export const getFollowing = (pageNum: number = 1, pageSize: number = 10): Promise<Result<FollowListResponse>> => {
  return request.get('/api/follow/following', {
    params: { pageNum, pageSize }
  });
};
