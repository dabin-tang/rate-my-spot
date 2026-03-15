import React, { useState, useEffect } from 'react';
import { Input, Button, Avatar, Flex, Typography, message } from 'antd';
import { CloseOutlined, SendOutlined } from '@ant-design/icons';
import { useAuthStore } from '../../../auth/stores/useAuthStore';
import { useCreatePostComment } from '../../hooks/usePostComments';
import type { PostCommentResponse } from '../../types';
import styles from './CommentForm.module.scss';

const { Text } = Typography;

interface CommentFormProps {
  postId: number;
  replyingTo: PostCommentResponse | null;
  onCancelReply: () => void;
  onCommentSubmitted: () => void;
}

export const CommentForm: React.FC<CommentFormProps> = ({ 
  postId, 
  replyingTo, 
  onCancelReply,
  onCommentSubmitted
}) => {
  const { user } = useAuthStore();
  const [content, setContent] = useState('');
  const createMutation = useCreatePostComment(postId);

  // Auto-focus input when replyingTo changes to someone
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const inputRef = React.useRef<any>(null);
  useEffect(() => {
    if (replyingTo) {
      inputRef.current?.focus();
    }
  }, [replyingTo]);

  const handleSubmit = () => {
    if (!user) {
      message.warning('Please log in to comment');
      return;
    }
    
    if (!content.trim()) return;

    createMutation.mutate(
      {
        userId: user.id,
        content: content.trim(),
        parentId: replyingTo ? (replyingTo.parentId || replyingTo.id) : 0, // Attach to root of thread
        replyToUserId: replyingTo ? replyingTo.userId : undefined,
      },
      {
        onSuccess: () => {
          setContent('');
          onCommentSubmitted();
          message.success('Comment posted');
        },
        onError: () => {
          message.error('Failed to post comment');
        }
      }
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  if (!user) {
    return (
      <div className={styles.loginPrompt}>
        <Text type="secondary">Please log in to leave a comment</Text>
      </div>
    );
  }

  return (
    <div className={styles.formContainer}>
      {replyingTo && (
        <Flex align="center" justify="space-between" className={styles.replyBanner}>
          <Text className={styles.replyText}>
            Replying to <span className={styles.highlight}>@{replyingTo.userNickname}</span>
          </Text>
          <Button 
            type="text" 
            size="small" 
            icon={<CloseOutlined />} 
            onClick={onCancelReply} 
            className={styles.cancelBtn}
          />
        </Flex>
      )}

      <Flex gap={12} align="flex-end" className={styles.inputArea}>
        <Avatar src={user.icon} className={styles.avatar}>
          {user.nickname?.charAt(0)?.toUpperCase()}
        </Avatar>
        
        <div className={styles.inputWrapper}>
          <Input.TextArea
            ref={inputRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={replyingTo ? 'Write a reply...' : 'Add a comment...'}
            autoSize={{ minRows: 1, maxRows: 4 }}
            className={styles.textarea}
            bordered={false}
          />
        </div>
        
        <Button 
          type="primary" 
          shape="circle" 
          icon={<SendOutlined />} 
          onClick={handleSubmit}
          loading={createMutation.isPending}
          disabled={!content.trim()}
          className={styles.sendBtn}
        />
      </Flex>
    </div>
  );
};
