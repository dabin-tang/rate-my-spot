import request, { type Result } from '../../../shared/api/axios';
import type { PostResponse } from '../types';

export const searchPosts = (keyword: string, page: number = 1, size: number = 20): Promise<Result<{ list: PostResponse[] }>> => {
  return request.get('/api/post/search', {
    params: { keyword, page, size }
  });
};
