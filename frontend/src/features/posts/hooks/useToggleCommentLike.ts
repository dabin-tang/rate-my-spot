import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleCommentLike } from '../api/commentLikeApi';
import type { PostCommentResponse } from '../types';
import { message } from 'antd';
import { useAuthStore } from '../../auth/stores/useAuthStore';
import { commentKeys } from './usePostComments';

// Helper to recursively update the comment node
const updateCommentNode = (
  nodes: PostCommentResponse[],
  targetId: number,
  delta: number,
  isLiked: boolean
): PostCommentResponse[] => {
  return nodes.map((node) => {
    if (node.id === targetId) {
      return { ...node, liked: (node.liked || 0) + delta, isLiked };
    }
    if (node.children && node.children.length > 0) {
      return {
        ...node,
        children: updateCommentNode(node.children, targetId, delta, isLiked),
      };
    }
    return node;
  });
};

export const useToggleCommentLike = (postId: number) => {
  const queryClient = useQueryClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const token = useAuthStore((state: any) => state.token);

  return useMutation({
    mutationFn: async (commentId: number) => {
      if (!token) {
        message.warning('Please log in to continue.');
        throw new Error('AUTH_REQUIRED');
      }
      return toggleCommentLike(commentId);
    },
    onMutate: async (commentId: number) => {
      const queryKey = commentKeys.list(postId);
      await queryClient.cancelQueries({ queryKey });

      const previousComments = queryClient.getQueryData<PostCommentResponse[]>(queryKey);

      if (previousComments) {
        // Find the current state of this comment recursively to calculate delta
        let currentIsLiked = false;
        const findLikeStatus = (nodes: PostCommentResponse[]) => {
          for (const node of nodes) {
            if (node.id === commentId) currentIsLiked = node.isLiked || false;
            if (node.children) findLikeStatus(node.children);
          }
        };
        findLikeStatus(previousComments);

        const newIsLiked = !currentIsLiked;
        const delta = newIsLiked ? 1 : -1;

        queryClient.setQueryData<PostCommentResponse[]>(queryKey, (old) => {
          if (!old) return old;
          return updateCommentNode(old, commentId, delta, newIsLiked);
        });
      }

      return { previousComments, queryKey };
    },
    onError: (err, _commentId, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(context.queryKey, context.previousComments);
      }
      if (err.message !== 'AUTH_REQUIRED') {
        message.error('Failed to update comment like');
      }
    },
    onSettled: (_data, _error, _variables, context) => {
      if (context?.queryKey) {
        queryClient.invalidateQueries({ queryKey: context.queryKey });
      }
    },
  });
};
