import React, { useState } from 'react';
import { useAuthStore } from '../../../features/auth/stores/useAuthStore';
import { message } from 'antd';
import { useToggleFollow } from '../../../features/users/hooks/useFollow';
import styles from './FollowButton.module.scss';

interface FollowButtonProps {
  targetUserId: number;
  initialIsFollow: boolean;
  className?: string;
  onFollowToggle?: (newStatus: boolean) => void;
}

export const FollowButton: React.FC<FollowButtonProps> = ({ 
  targetUserId, 
  initialIsFollow, 
  className,
  onFollowToggle 
}) => {
  const { user } = useAuthStore();
  const [isFollow, setIsFollow] = useState(initialIsFollow);
  
  // Custom hook wrapping the mutation
  const { mutate: toggleFollowApi, isPending } = useToggleFollow(() => {
    // We already handle local state immediately for optimistic UI
  });

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      message.warning('Please log in first');
      return;
    }
    
    if (user.id === targetUserId) {
      message.warning('You cannot follow yourself');
      return;
    }

    // Optimistic toggle
    const newStatus = !isFollow;
    setIsFollow(newStatus);
    if (onFollowToggle) {
      onFollowToggle(newStatus);
    }

    // Fire API Request
    toggleFollowApi(targetUserId);
  };

  if (user?.id === targetUserId) {
    return null; // Don't show follow button for self
  }

  return (
    <button 
      className={`${styles.followBtn} ${isFollow ? styles.following : styles.follow} ${className || ''}`}
      onClick={handleClick}
      disabled={isPending}
    >
      {isFollow ? 'Following' : 'Follow'}
    </button>
  );
};
