import request, { type Result } from '@/shared/api/axios';
import type { UserResponse, PageResult } from '../types';

export interface FollowListParams {
  userId?: number;
  pageNum: number;
  pageSize: number;
}

export const toggleFollow = (targetUserId: number): Promise<Result<void>> => {
  // Use URLSearchParams or POST body depending on the backend controller format. 
  // It's expecting @RequestParam Long targetUserId for POST /api/follow/toggle
  const params = new URLSearchParams();
  params.append('targetUserId', targetUserId.toString());
  return request.post('/api/follow/toggle', params);
};

export const getFollowers = (params: FollowListParams): Promise<Result<PageResult<UserResponse>>> => {
  return request.get('/api/follow/followers', { params });
};

export const getFollowing = (params: FollowListParams): Promise<Result<PageResult<UserResponse>>> => {
  return request.get('/api/follow/following', { params });
};
