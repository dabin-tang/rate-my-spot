import request, { type Result } from '@/shared/api/axios';

export const togglePostLike = async (postId: number): Promise<Result<null>> => {
  return request.post('/api/post-like/toggle', null, { params: { postId } });
};
