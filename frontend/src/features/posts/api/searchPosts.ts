import request, { type Result } from '../../../shared/api/axios';
import type { PostResponse } from '../types';

export const searchPosts = (keyword: string): Promise<Result<PostResponse[]>> => {
  return request.get('/api/post/search', {
    params: { keyword }
  });
};
