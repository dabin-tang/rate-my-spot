import React from 'react';
import { Typography, Flex } from 'antd';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import type { PostResponse } from '../../types';
import styles from './PostItem.module.scss';

const { Text } = Typography;

interface PostItemProps {
  post: PostResponse;
  onClick: (postId: number) => void;
  onLike?: (postId: number) => void;
}

export const PostItem: React.FC<PostItemProps> = ({ post, onClick, onLike }) => {
  const firstImage = post.images ? post.images.split(',')[0] : '';

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
          <div className={styles.authorContainer}>
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
            <span className={styles.likeCount}>
              {post.liked || 0}
            </span>
          </div>
        </Flex>
      </div>
    </div>
  );
};
