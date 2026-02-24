import request, { type Result } from '@/shared/api/axios';
import type { PostResponse } from '../types';

export const getPostById = (id: number): Promise<Result<PostResponse>> => {
  return request.get(`/api/post/${id}`);
};
