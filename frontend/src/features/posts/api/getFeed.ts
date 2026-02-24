import request, { type Result } from '@/shared/api/axios';
import type { PostFeedRequestDTO, PostResponse } from '../types';
import type { PageResult } from '@/features/spots/api/getSpots';

export const getFeed = (params: PostFeedRequestDTO): Promise<Result<PageResult<PostResponse>>> => {
  return request.get('/api/post/feed', { params });
};
