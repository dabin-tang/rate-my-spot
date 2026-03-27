import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPostComments, createPostComment, deletePostComment } from '../api/postCommentApi';
import type { PostCommentCreateDTO } from '../types';

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
    onSuccess: () => {
      // Invalidate the comment tree for this post to refetch new comments
      queryClient.invalidateQueries({
        queryKey: commentKeys.list(postId),
      });
      // Invalidate post detail to refetch commentCount
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
