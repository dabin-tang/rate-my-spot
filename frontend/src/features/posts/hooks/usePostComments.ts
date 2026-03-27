import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPostComments, createPostComment, deletePostComment } from '../api/postCommentApi';
import { useAuthStore } from '../../auth/stores/useAuthStore';
import type { PostCommentCreateDTO, PostCommentResponse } from '../types';

export const commentKeys = {
  all: ['post-comments'] as const,
  list: (postId: number) => [...commentKeys.all, { postId }] as const,
};

export const usePostCommentsQuery = (postId: number) => {
  return useQuery({
    queryKey: commentKeys.list(postId),
    queryFn: async () => {
      const response = await getPostComments(postId);
      return response.data; // List of PostCommentResponse representing the tree
    },
    enabled: !!postId,
  });
};

export const useCreatePostComment = (postId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<PostCommentCreateDTO, 'postId'>) => 
      createPostComment({ ...data, postId }),
    onSuccess: (response) => {
      const rawComment = response.data;
      if (rawComment) {
        // Hydrate backend DTO with explicit local session traits bridging the data gap.
        const currentUser = useAuthStore.getState().user;
        const newComment: PostCommentResponse = {
          ...rawComment,
          userNickname: rawComment.userNickname || currentUser?.nickname || 'User',
          userIcon: rawComment.userIcon || currentUser?.icon || '',
          userId: rawComment.userId || currentUser?.id || 0
        };

        queryClient.setQueryData<PostCommentResponse[]>(commentKeys.list(postId), (old) => {
          if (!old) return [newComment];

          // 1. If it's a root-level comment, prepend it to the absolute top of the feed temporarily
          if (!newComment.parentId || newComment.parentId === 0) {
            return [newComment, ...old];
          }

          // 2. If it's a nested reply, traverse the tree to append it to its specific parent
          const recursiveInsert = (nodes: PostCommentResponse[]): PostCommentResponse[] => {
            return nodes.map(node => {
              // Found the parent! Inject into its children boundary
              if (node.id === newComment.parentId) {
                return {
                  ...node,
                  children: [...(node.children || []), newComment]
                };
              }
              // Not the parent, drill down if children exist
              if (node.children && node.children.length > 0) {
                return { ...node, children: recursiveInsert(node.children) };
              }
              return node; // No modifications
            });
          };

          return recursiveInsert(old);
        });
      }

      // We explicitly skip invalidating the comment tree so the user's optimistic top-placement 
      // is held continuously during this viewing session without a jarring 0.1s snap.

      // We still invalidate the post detail to increment the Comment Count bubble UI
      queryClient.invalidateQueries({
        queryKey: ['postDetail', postId],
      });
    },
  });
};

export const useDeletePostComment = (postId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: number) => deletePostComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: commentKeys.list(postId),
      });
      queryClient.invalidateQueries({
        queryKey: ['postDetail', postId],
      });
    },
  });
};
