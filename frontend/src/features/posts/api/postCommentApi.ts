import request, { type Result } from '../../../shared/api/axios';
import type { PostCommentCreateDTO, PostCommentResponse } from '../types';

export const getPostComments = (postId: number): Promise<Result<PostCommentResponse[]>> => {
  return request.get('/api/post-comment/list', {
    params: { postId }
  });
};

export const createPostComment = (data: PostCommentCreateDTO): Promise<Result<PostCommentResponse>> => {
  return request.post('/api/post-comment/create', data);
};

export const deletePostComment = (commentId: number): Promise<Result<null>> => {
  return request.delete(`/api/post-comment/${commentId}`);
};
