import React from 'react';
import { Flex, Button, Typography } from 'antd';
import { useUserLikes } from '../../hooks/useUserLikes';
import { useToggleLike } from '../../hooks/useToggleLike';
import { PostItem } from '../PostItem';
import { useUIStore } from '../../../../shared/stores/useUIStore';
import styles from '../PostFeed/PostFeed.module.scss';
import type { PostResponse } from '../../types';

const { Text } = Typography;

interface UserLikeFeedProps {
  userId?: number;
  skeletonGrid?: React.ReactNode;
  columns?: 3 | 5 | 'auto';
}

export const UserLikeFeed: React.FC<UserLikeFeedProps> = ({ userId, skeletonGrid, columns = 'auto' }) => {
  const { 
    posts, 
    isLoading, 
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useUserLikes(userId);
  
  const setSelectedPostId = useUIStore((state) => state.setSelectedPostId);
  const { mutate: toggleLike } = useToggleLike([['userLikes']]);

  if (isLoading) {
    return <>{skeletonGrid}</>;
  }

  if (isError) {
    return (
      <Flex justify="center" align="center" style={{ minHeight: '300px' }}>
        <Text type="danger">Failed to load liked posts.</Text>
      </Flex>
    );
  }

  if (posts.length === 0) {
    return (
      <Flex justify="center" align="center" style={{ minHeight: '300px' }}>
        <Text type="secondary" style={{ fontSize: '15px' }}>You haven't liked any posts yet.</Text>
      </Flex>
    );
  }

  const gridClass = columns === 5 ? styles.grid5 : columns === 3 ? styles.grid3 : styles.grid;

  return (
    <div style={{ paddingTop: '16px' }}>
      <div className={gridClass}>
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
      
      {hasNextPage && (
        <Flex justify="center" style={{ marginTop: '32px' }}>
          <Button 
            onClick={() => fetchNextPage()} 
            loading={isFetchingNextPage}
            size="large"
            shape="round"
          >
            Load More Likes
          </Button>
        </Flex>
      )}
    </div>
  );
};
