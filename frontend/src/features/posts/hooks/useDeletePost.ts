import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deletePost } from '../api/deletePost';
import { message } from 'antd';
import { useUIStore } from '../../../shared/stores/useUIStore';

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  const setSelectedPostId = useUIStore(state => state.setSelectedPostId);
  const selectedPostId = useUIStore(state => state.selectedPostId);

  return useMutation({
    mutationFn: (postId: number) => deletePost(postId),
    onSuccess: (_, postId) => {
      // Optimistically invalidate cache layers
      message.success('Post deleted successfully');
      
      // If the post being deleted is currently open in a modal, close it
      if (selectedPostId === postId) {
        setSelectedPostId(null);
      }

      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['userPosts'] });
      queryClient.invalidateQueries({ queryKey: ['likedPosts'] });
      queryClient.invalidateQueries({ queryKey: ['spotPosts'] });
    },
    onError: () => {
      message.error('Failed to delete post');
    }
  });
};
