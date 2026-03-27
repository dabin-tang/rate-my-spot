import request from '@/shared/api/axios';

/**
 * Toggle like status for a comment.
 *
 * @param commentId The ID of the comment
 * @returns An empty result wrapping the toggle outcome
 */
export const toggleCommentLike = async (commentId: number): Promise<void> => {
  await request.post('/api/comment-like/toggle', null, {
    params: { commentId },
  });
};
