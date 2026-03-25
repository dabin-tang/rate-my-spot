import request, { type Result } from '@/shared/api/axios';
import type { PostResponse } from '../types';

export interface PageResult<T> {
  total: number;
  list: T[];
}

export const getLikedPosts = (page: number = 1, size: number = 15): Promise<Result<PageResult<PostResponse>>> => {
  return request.get('/api/post-like/list', {
    params: { page, size }
  });
};
