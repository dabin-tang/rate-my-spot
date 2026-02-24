import React, { useState } from 'react';
import { Flex, Skeleton, Typography } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { getFeed } from '../api/getFeed';
import { PostItem } from './PostItem';
import { PostDetailModal } from './PostDetailModal';

const { Text } = Typography;

interface PostFeedProps {
  categoryId?: number;
  sort?: string;
}

export const PostFeed: React.FC<PostFeedProps> = ({ categoryId, sort = 'latest' }) => {
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['postFeed', categoryId || 'all', sort],
    queryFn: () => getFeed({ categoryId, sort, page: 1, size: 20 }),
  });

  if (isLoading) {
    return (
      <Flex gap={16} style={{ padding: '0 24px' }}>
        <div style={{ flex: 1 }}><Skeleton active paragraph={{ rows: 6 }} /></div>
        <div style={{ flex: 1 }}><Skeleton active paragraph={{ rows: 8 }} /></div>
      </Flex>
    );
  }

  if (isError) {
    return <Text type="danger">Failed to load posts.</Text>;
  }

  const posts = data?.data?.list || [];

  if (posts.length === 0) {
    return (
      <Flex justify="center" style={{ padding: '40px' }}>
        <Text type="secondary">No posts found in this category yet.</Text>
      </Flex>
    );
  }

  return (
    <>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '20px', 
        width: '100%',
        alignContent: 'start'
      }}>
        {posts.map(post => (
          <div key={post.id} style={{ breakInside: 'avoid' }}>
            <PostItem 
              post={post} 
              onClick={(id) => setSelectedPostId(id)} 
            />
          </div>
        ))}
      </div>

      <PostDetailModal 
        key={selectedPostId || 'close'}
        postId={selectedPostId}
        visible={!!selectedPostId} 
        onClose={() => setSelectedPostId(null)} 
      />
    </>
  );
};
