import React from 'react';
import { Flex, Skeleton, Typography } from 'antd';
import { usePostFeed } from './usePostFeed';
import { useToggleLike } from '../../hooks/useToggleLike';
import { PostItem } from '../PostItem';
import { useUIStore } from '../../../../shared/stores/useUIStore';
import styles from './PostFeed.module.scss';
import type { PostResponse } from '../../types';

const { Text } = Typography;

interface PostFeedProps {
  categoryId?: number;
  sort?: string;
}

export const PostFeed: React.FC<PostFeedProps> = ({ categoryId, sort = 'latest' }) => {
  const { 
    posts, 
    isLoading, 
    isError 
  } = usePostFeed(categoryId, sort);
  
  const setSelectedPostId = useUIStore((state) => state.setSelectedPostId);
  const { mutate: toggleLike } = useToggleLike([['postFeed', categoryId || 'all', sort]]);

  if (isLoading) {
    return (
      <Flex gap={16} className={styles.loadingContainer}>
        <div className={styles.skeletonWrapper}><Skeleton active paragraph={{ rows: 6 }} /></div>
        <div className={styles.skeletonWrapper}><Skeleton active paragraph={{ rows: 8 }} /></div>
      </Flex>
    );
  }

  if (isError) {
    return <Text type="danger">Failed to load posts.</Text>;
  }

  if (posts.length === 0) {
    return (
      <Flex justify="center" className={styles.emptyContainer}>
        <Text type="secondary">No posts found in this category yet.</Text>
      </Flex>
    );
  }

  return (
    <>
      <div className={styles.grid}>
        {posts.map((post: PostResponse) => (
          <div key={post.id} className={styles.itemWrapper}>
            <PostItem 
              post={post} 
              onClick={(id: number) => setSelectedPostId(id)}
              onLike={(id: number) => toggleLike(id)}
            />
          </div>
        ))}
      </div>
    </>
  );
};
