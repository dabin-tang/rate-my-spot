import React, { useMemo, useState } from 'react';
import { Avatar, Typography, Flex, Dropdown, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import type { MenuProps } from 'antd';
import { HeartOutlined, HeartFilled, MoreOutlined } from '@ant-design/icons';
import { formatDistanceToNow } from 'date-fns';
import { useAuthStore } from '../../../auth/stores/useAuthStore';
import { ReportModal } from '../../../../shared/components/ReportModal';
import type { PostCommentResponse } from '../../../posts/types';
import styles from './CommentItem.module.scss';

const { Text } = Typography;

interface CommentItemProps {
  comment: PostCommentResponse;
  onReply: (comment: PostCommentResponse) => void;
  onLike: (commentId: number) => void;
  onDelete?: (commentId: number) => void;
  depth?: number;
}

export const CommentItem: React.FC<CommentItemProps> = ({ comment, onReply, onLike, onDelete, depth = 0 }) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const currentUser = useAuthStore(state => state.user);

  const isOwner = currentUser?.id === comment.userId;

  const menuItems = useMemo<MenuProps['items']>(() => {
    const items: MenuProps['items'] = [
      {
        key: 'report',
        label: 'Report',
        onClick: () => {
          if (!currentUser) {
            message.warning('Please log in first.');
            return;
          }
          setIsReportModalOpen(true);
        },
      }
    ];

    if (isOwner && onDelete) {
      items.push({
        key: 'delete',
        label: 'Delete',
        danger: true,
        onClick: () => onDelete(comment.id)
      });
    }

    return items;
  }, [isOwner, onDelete, comment.id, currentUser]);

  // We cap nesting visual indent at depth 1 for a flat Bilibili style look.
  const indentClass = useMemo(() => {
    return depth > 0 ? styles.depth1 : '';
  }, [depth]);

  const timeAgo = useMemo(() => {
    try {
      if (!comment.createTime) return '';
      return formatDistanceToNow(new Date(comment.createTime), { addSuffix: true });
    } catch {
      return '';
    }
  }, [comment.createTime]);

  const handleUserClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (comment.userId) {
      navigate(`/user/${comment.userId}`);
    }
  };

  return (
    <div className={`${styles.commentWrapper} ${indentClass}`}>
      <Flex gap={8} align="flex-start" className={styles.commentBody}>
        <div onClick={handleUserClick} style={{ cursor: 'pointer' }}>
          <Avatar src={comment.userIcon} className={styles.avatar} size={depth === 0 ? 32 : 24}>
            {comment.userNickname?.charAt(0)?.toUpperCase()}
          </Avatar>
        </div>
        
        <Flex vertical gap={2} className={styles.contentArea}>
          <Flex align="center" gap={8} className={styles.headerRow}>
            <Text strong className={styles.nickname} onClick={handleUserClick} style={{ cursor: 'pointer' }}>
              {comment.userNickname}
            </Text>
            
            {comment.replyToUserId && comment.replyToUserNickname && (
              <Text type="secondary" className={styles.replyTo}>
                ▶ {comment.replyToUserNickname}
              </Text>
            )}
            
            <Text className={styles.time}>{timeAgo}</Text>
            
            <Dropdown 
              menu={{ items: menuItems }} 
              trigger={['click']} 
              placement="bottomRight"
              onOpenChange={(open) => setIsDropdownOpen(open)}
            >
              <span className={`${styles.moreIconWrapper} ${isDropdownOpen ? styles.active : ''}`}>
                <MoreOutlined style={{ transform: 'rotate(90deg)' }} />
              </span>
            </Dropdown>
          </Flex>

          <Text className={styles.contentText}>{comment.content}</Text>
          
          <Flex gap={16} className={styles.actionRow} align="center">
            <Text 
              className={styles.actionBtn} 
              onClick={() => onReply(comment)}
            >
              Reply
            </Text>
            <Flex gap={4} align="center" className={styles.actionBtn} onClick={() => onLike(comment.id)}>
              {comment.isLiked ? <HeartFilled style={{ color: '#ff2442' }} /> : <HeartOutlined />}
              <span>{comment.liked || 0}</span>
            </Flex>
          </Flex>
        </Flex>
      </Flex>

      {/* Flattened rendering for children */}
      {comment.children && comment.children.length > 0 && (
        <div className={styles.childrenContainer}>
          {/* Always render first child */}
          <CommentItem 
            key={comment.children[0].id} 
            comment={comment.children[0]} 
            onReply={onReply}
            onLike={onLike}
            onDelete={onDelete}
            depth={1} 
          />

          {/* Render the REST inside an animated container */}
          {comment.children.length > 1 && (
            <div className={`${styles.expandableWrapper} ${isExpanded ? styles.expanded : ''}`}>
              <div className={styles.expandableInner}>
                {comment.children.slice(1).map(child => (
                  <CommentItem 
                    key={child.id} 
                    comment={child} 
                    onReply={onReply}
                    onLike={onLike}
                    onDelete={onDelete}
                    depth={1} 
                  />
                ))}
              </div>
            </div>
          )}

          {/* Toggle Button */}
          {comment.children.length > 1 && (
            <div className={styles.expandBtn} onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? '―― Hide replies ⏶' : `―― View ${comment.children.length - 1} more replies ⏷`}
            </div>
          )}
        </div>
      )}

      <ReportModal
        isOpen={isReportModalOpen}
        targetId={comment.id}
        targetType="COMMENT"
        onClose={() => setIsReportModalOpen(false)}
      />
    </div>
  );
};
