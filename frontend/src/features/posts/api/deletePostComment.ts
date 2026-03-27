import request, { type Result } from '@/shared/api/axios';

/**
 * Executes a hard delete operation for a specific post comment tree.
 * @param commentId Unique identifier of the target comment
 */
export const deletePostComment = (commentId: number): Promise<Result<null>> => {
  return request.delete(`/api/post-comment/${commentId}`);
};
