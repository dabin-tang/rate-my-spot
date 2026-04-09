import request, { type Result } from '@/shared/api/axios';

export const deletePost = (postId: number): Promise<Result<null>> => {
  return request.delete(`/api/post/${postId}`);
};
