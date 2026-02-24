import request, { type Result } from '@/shared/api/axios';
import type { PostResponse } from '../types';
import type { PageResult } from '@/features/spots/api/getSpots';

export const getPostsByUser = (userId: number, page: number = 1, size: number = 10): Promise<Result<PageResult<PostResponse>>> => {
  return request.get(`/api/post/user/${userId}`, {
    params: { page, size }
  });
};
