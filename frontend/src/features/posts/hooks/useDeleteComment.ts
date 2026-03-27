import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { deletePostComment } from '../api/deletePostComment';
import { commentKeys } from './usePostComments';

/**
 * Handles the async state of deleting a comment.
 * Automatically invalidates and refreshes the post comments pipeline matching `postId`.
 */
export const useDeleteComment = (postId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: number) => deletePostComment(commentId),
    onSuccess: () => {
      message.success('Comment deleted successfully');
      // Force instantaneous refresh without tearing the DOM layout
      queryClient.invalidateQueries({ queryKey: commentKeys.list(postId) });
    },
    onError: (error: Error) => {
      message.error(error.message || 'Failed to delete the comment. Please try again.');
    }
  });
};
