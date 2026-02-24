import React from 'react';
import { Typography, Flex } from 'antd';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import type { PostResponse } from '../types';
import './PostItem.scss';

const { Text } = Typography;

interface PostItemProps {
  post: PostResponse;
  onClick: (postId: number) => void;
}

export const PostItem: React.FC<PostItemProps> = ({ post, onClick }) => {
  const firstImage = post.images ? post.images.split(',')[0] : '';

  return (
    <div
      className="post-item"
      onClick={() => onClick(post.id)}
    >
      {/* Cover Image */}
      <div className="post-item-image-container">
        {firstImage ? (
          <img
            alt={post.title}
            src={firstImage}
            className="post-item-image"
          />
        ) : (
          <div className="post-item-image-placeholder" />
        )}
      </div>

      {/* Card Body */}
      <div className="post-item-body">
        <Text strong className="post-item-title">
          {post.title}
        </Text>
        
        <Flex justify="space-between" align="center">
          <div className="post-item-author-container">
            <div className="post-item-avatar-container">
              {post.userIcon ? (
                <img src={post.userIcon} alt="avatar" className="post-item-avatar-image" />
              ) : (
                <span className="post-item-avatar-initial">{post.userNickname?.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <span className="post-item-author-name">
              {post.userNickname}
            </span>
          </div>

          <div className="post-item-stats">
            {post.isLiked ? (
              <HeartFilled className="post-item-like-icon liked" />
            ) : (
              <HeartOutlined className="post-item-like-icon unliked" />
            )}
            <span className="post-item-like-count">
              {post.liked || 0}
            </span>
          </div>
        </Flex>
      </div>
    </div>
  );
};
