import React, { useState } from 'react';
import { Typography, Spin, Empty, Dropdown, message } from 'antd';
import { MoreOutlined, FlagOutlined } from '@ant-design/icons';
import { usePostCommentsQuery } from '../../hooks/usePostComments';
import { useToggleCommentLike } from '../../hooks/useToggleCommentLike';
import { useDeleteComment } from '../../hooks/useDeleteComment';
import { CommentItem } from '../CommentItem';
import { CommentForm } from '../CommentForm';
import { ReportModal } from '../../../../shared/components/ReportModal';
import { useAuthStore } from '../../../auth/stores/useAuthStore';
import type { PostCommentResponse } from '../../types';
import styles from './CommentSection.module.scss';

const { Title } = Typography;

interface CommentSectionProps {
  postId: number;
  postLiked?: number;
  postIsLiked?: boolean;
  postCommentCount?: number;
  onTogglePostLike?: () => void;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ 
  postId, postLiked = 0, postIsLiked = false, postCommentCount = 0, onTogglePostLike 
}) => {
  const { data: comments, isLoading, isError } = usePostCommentsQuery(postId);
  const { mutate: toggleCommentLike } = useToggleCommentLike(postId);
  const { mutate: deleteComment } = useDeleteComment(postId);
  const user = useAuthStore(state => state.user);
  
  // Track who the user is currently replying to, if anyone
  const [replyingTo, setReplyingTo] = useState<PostCommentResponse | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

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
        <Dropdown
          menu={{
            items: [
              {
                key: 'report',
                label: 'Report Post',
                icon: <FlagOutlined />,
                onClick: () => {
                  if (!user) {
                    message.warning('Please log in first.');
                    return;
                  }
                  setIsReportModalOpen(true);
                }
              }
            ]
          }}
          trigger={['click']}
          placement="bottomRight"
        >
          <div className={styles.moreOptionsBtn}>
            <MoreOutlined />
          </div>
        </Dropdown>
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
                onDelete={deleteComment}
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
        postLiked={postLiked}
        postIsLiked={postIsLiked}
        postCommentCount={postCommentCount}
        onTogglePostLike={onTogglePostLike}
      />

      <ReportModal
        isOpen={isReportModalOpen}
        targetId={postId}
        targetType="POST"
        onClose={() => setIsReportModalOpen(false)}
      />
    </div>
  );
};
