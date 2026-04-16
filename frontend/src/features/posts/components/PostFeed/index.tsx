import React, { useEffect, useRef } from 'react';
import { Flex, Skeleton, Typography, Spin } from 'antd';
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
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = usePostFeed(categoryId, sort);
  
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }, { threshold: 0.1 });

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);
  
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
      
      {/* Infinite Scroll Sentinel Node */}
      <div ref={loadMoreRef} style={{ width: '100%', height: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '20px 0' }}>
        {isFetchingNextPage && <Spin size="large" />}
      </div>
    </>
  );
};
