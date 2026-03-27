import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { Avatar, Typography, Spin } from 'antd';
import { useFollowList } from '../../../features/users/hooks/useFollow';
import { FollowButton } from '../FollowButton';
import styles from './UserListModal.module.scss';
import type { UserResponse } from '../../../features/users/types';

const { Text } = Typography;

interface UserListModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  type: 'followers' | 'following';
  userId?: number; // Targets specific user if viewing public profile
}

export const UserListModal: React.FC<UserListModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  type, 
  userId 
}) => {
  const navigate = useNavigate();
  const isFollowers = type === 'followers';

  // Select the appropriate query hook
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading
  } = useFollowList(type, userId);

  // Flatten infinite pages
  const users = data?.pages.flatMap(page => page.list) || [];

  // Ref for infinite scrolling bottom sentinel
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }, { threshold: 0.1 });

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>

        <div className={styles.listContainer}>
          {isLoading ? (
            <div className={styles.loadingState}>
              <Spin />
            </div>
          ) : users.length === 0 ? (
            <div className={styles.emptyState}>
              <Text type="secondary">No {isFollowers ? 'followers' : 'following'} yet.</Text>
            </div>
          ) : (
            <>
              {users.map((user: UserResponse) => (
                <div 
                  key={user.id} 
                  className={styles.userRow} 
                  onClick={() => { navigate(`/user/${user.id}`); onClose(); }} 
                  style={{ cursor: 'pointer' }}
                >
                  <Avatar src={user.icon} size={44} className={styles.avatar}>
                    {user.nickname?.charAt(0).toUpperCase()}
                  </Avatar>
                  <div className={styles.userInfo}>
                    <div className={styles.nickname}>{user.nickname}</div>
                    {user.intro && <div className={styles.intro}>{user.intro}</div>}
                  </div>
                  <div className={styles.actionArea} onClick={e => e.stopPropagation()}>
                    <FollowButton 
                      targetUserId={user.id} 
                      initialIsFollow={user.isFollow || false} 
                    />
                  </div>
                </div>
              ))}
              
              <div ref={loadMoreRef} className={styles.loadMoreSentinel}>
                {isFetchingNextPage && <Spin size="small" />}
              </div>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
