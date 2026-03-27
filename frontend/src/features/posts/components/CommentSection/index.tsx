import React, { useState } from 'react';
import { Typography, Spin, Empty } from 'antd';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import { usePostCommentsQuery } from '../../hooks/usePostComments';
import { useToggleCommentLike } from '../../hooks/useToggleCommentLike';
import { CommentItem } from '../CommentItem';
import { CommentForm } from '../CommentForm';
import type { PostCommentResponse } from '../../types';
import styles from './CommentSection.module.scss';

const { Title } = Typography;

interface CommentSectionProps {
  postId: number;
  postLiked?: number;
  postIsLiked?: boolean;
  onTogglePostLike?: () => void;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ 
  postId, postLiked = 0, postIsLiked = false, onTogglePostLike 
}) => {
  const { data: comments, isLoading, isError } = usePostCommentsQuery(postId);
  const { mutate: toggleCommentLike } = useToggleCommentLike(postId);
  
  // Track who the user is currently replying to, if anyone
  const [replyingTo, setReplyingTo] = useState<PostCommentResponse | null>(null);

  const handleReplyClick = (comment: PostCommentResponse) => {
    setReplyingTo(comment);
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
  };

  const handleCommentSubmitted = () => {
    // When a comment is successfully posted, clear reply state
    setReplyingTo(null);
  };

  return (
    <div className={styles.sectionContainer}>
      <div className={styles.header}>
        <Title level={5} className={styles.title}>Comments</Title>
        {onTogglePostLike && (
          <div className={styles.postLikeBtn} onClick={onTogglePostLike}>
            {postIsLiked ? <HeartFilled className={styles.liked} /> : <HeartOutlined className={styles.unliked} />}
            <span className={styles.count}>{postLiked}</span>
          </div>
        )}
      </div>

      <div className={styles.listContainer}>
        {isLoading ? (
          <div className={styles.loadingWrapper}>
            <Spin size="large" />
          </div>
        ) : isError ? (
          <Empty 
            description="Failed to load comments" 
            className={styles.emptyWrapper} 
          />
        ) : !comments || comments.length === 0 ? (
          <Empty 
            description="No comments yet. Be the first to share your thoughts!" 
            className={styles.emptyWrapper} 
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <div className={styles.commentsTree}>
            {comments.map((comment) => (
              <CommentItem 
                key={comment.id}
                comment={comment}
                onReply={handleReplyClick}
                onLike={() => toggleCommentLike(comment.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* The sticky footer form */}
      <CommentForm 
        postId={postId}
        replyingTo={replyingTo}
        onCancelReply={handleCancelReply}
        onCommentSubmitted={handleCommentSubmitted}
      />
    </div>
  );
};
