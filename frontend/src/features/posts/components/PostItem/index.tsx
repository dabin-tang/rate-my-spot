import React, { useState } from 'react';
import { Typography, Flex, Dropdown } from 'antd';
import { useNavigate } from 'react-router-dom';
import { HeartOutlined, HeartFilled, MoreOutlined, DeleteOutlined } from '@ant-design/icons';
import { useAuthStore } from '../../../auth/stores/useAuthStore';
import { useDeletePost } from '../../hooks/useDeletePost';
import { ConfirmDialog } from '../../../../shared/components/ConfirmDialog';
import type { PostResponse } from '../../types';
import styles from './PostItem.module.scss';

const { Text } = Typography;

interface PostItemProps {
  post: PostResponse;
  onClick: (postId: number) => void;
  onLike?: (postId: number) => void;
}

export const PostItem: React.FC<PostItemProps> = ({ post, onClick, onLike }) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { mutate: deletePost } = useDeletePost();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const isMe = user?.id === post.userId;
  const firstImage = post.images ? post.images.split(',')[0] : '';

  const handleUserClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (post.userId) {
      navigate(`/user/${post.userId}`);
    }
  };

  return (
    <div
      className={styles.container}
      onClick={() => onClick(post.id)}
    >
      <div className={styles.imageContainer}>
        {firstImage ? (
          <img
            alt={post.title}
            src={firstImage}
            className={styles.image}
          />
        ) : (
          <div className={styles.imagePlaceholder} />
        )}
      </div>

      <div className={styles.body}>
        <Text strong className={styles.title}>
          {post.title}
        </Text>
        
        <Flex justify="space-between" align="center">
          <div className={styles.authorContainer} onClick={handleUserClick} style={{ cursor: 'pointer' }}>
            <div className={styles.avatarContainer}>
              {post.userIcon ? (
                <img src={post.userIcon} alt="avatar" className={styles.avatarImage} />
              ) : (
                <span className={styles.avatarInitial}>{post.userNickname?.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <span className={styles.authorName}>
              {post.userNickname}
            </span>
          </div>

          <div className={styles.stats}>
            {post.isLiked ? (
              <HeartFilled 
                className={`${styles.likeIcon} ${styles.liked}`} 
                onClick={(e) => {
                  e.stopPropagation();
                  onLike?.(post.id);
                }}
              />
            ) : (
              <HeartOutlined 
                className={`${styles.likeIcon} ${styles.unliked}`} 
                onClick={(e) => {
                  e.stopPropagation();
                  onLike?.(post.id);
                }}
              />
            )}
            <span className={styles.likeCount} style={{ marginRight: isMe ? 8 : 0 }}>
              {post.liked || 0}
            </span>
            
            {isMe && (
              <Dropdown 
                menu={{ items: [
                  {
                    key: 'delete',
                    icon: <DeleteOutlined />,
                    label: 'Delete Post',
                    onClick: ({ domEvent }) => {
                      domEvent.stopPropagation();
                      setIsDeleteDialogOpen(true);
                    }
                  }
                ]}} 
                trigger={['click']} 
                placement="bottomRight"
              >
                <div 
                  className={styles.moreOptions} 
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreOutlined />
                </div>
              </Dropdown>
            )}
          </div>
        </Flex>
      </div>
      
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isDanger={true}
        onConfirm={() => deletePost(post.id)}
        onCancel={() => setIsDeleteDialogOpen(false)}
      />
    </div>
  );
};
