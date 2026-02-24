import request, { type Result } from '@/shared/api/axios';
import type { PostCreateDTO } from '../types';

export const createPost = (data: PostCreateDTO): Promise<Result<null>> => {
  return request.post('/api/post/create', data);
};
