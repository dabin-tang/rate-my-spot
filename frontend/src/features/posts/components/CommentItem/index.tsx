import React, { useMemo } from 'react';
import { Avatar, Typography, Flex } from 'antd';
import { formatDistanceToNow } from 'date-fns';
import type { PostCommentResponse } from '../../../posts/types';
import styles from './CommentItem.module.scss';

const { Text } = Typography;

interface CommentItemProps {
  comment: PostCommentResponse;
  onReply: (comment: PostCommentResponse) => void;
  depth?: number;
}

export const CommentItem: React.FC<CommentItemProps> = ({ comment, onReply, depth = 0 }) => {
  // Indent based on depth. We cap nesting visual indent at depth 3 for better mobile UX.
  const indentClass = useMemo(() => {
    if (depth === 0) return '';
    if (depth === 1) return styles.depth1;
    if (depth === 2) return styles.depth2;
    return styles.depth3;
  }, [depth]);

  const timeAgo = useMemo(() => {
    try {
      if (!comment.createTime) return '';
      return formatDistanceToNow(new Date(comment.createTime), { addSuffix: true });
    } catch {
      return '';
    }
  }, [comment.createTime]);

  return (
    <div className={`${styles.commentWrapper} ${indentClass}`}>
      <Flex gap={12} align="flex-start" className={styles.commentBody}>
        <Avatar src={comment.userIcon} className={styles.avatar}>
          {comment.userNickname?.charAt(0)?.toUpperCase()}
        </Avatar>
        
        <Flex vertical gap={4} className={styles.contentArea}>
          <Flex align="center" gap={8} className={styles.headerRow}>
            <Text strong className={styles.nickname}>{comment.userNickname}</Text>
            
            {comment.replyToUserId && comment.replyToUserNickname && (
              <Text type="secondary" className={styles.replyTo}>
                ▶ {comment.replyToUserNickname}
              </Text>
            )}
            
            <Text className={styles.time}>{timeAgo}</Text>
          </Flex>

          <Text className={styles.contentText}>{comment.content}</Text>
          
          <Flex gap={16} className={styles.actionRow}>
            <Text 
              className={styles.actionBtn} 
              onClick={() => onReply(comment)}
            >
              Reply
            </Text>
            {/* Like button could be added here later */}
          </Flex>
        </Flex>
      </Flex>

      {/* Recursive rendering for children */}
      {comment.children && comment.children.length > 0 && (
        <div className={styles.childrenContainer}>
          {comment.children.map(child => (
            <CommentItem 
              key={child.id} 
              comment={child} 
              onReply={onReply}
              depth={depth + 1} 
            />
          ))}
        </div>
      )}
    </div>
  );
};
