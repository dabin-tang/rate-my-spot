import React from 'react';
import { Button } from 'antd';
import { useFollowUser } from './useFollowUser';
import styles from './FollowButton.module.scss';

interface FollowButtonProps {
  userId: number;
  initialIsFollowing?: boolean;
}

export const FollowButton: React.FC<FollowButtonProps> = ({ 
  userId, 
  initialIsFollowing = false 
}) => {
  const { isFollowing, toggleFollow, isLoading } = useFollowUser(userId, initialIsFollowing);

  return (
    <Button
      type={isFollowing ? 'default' : 'primary'}
      shape="round"
      onClick={toggleFollow}
      loading={isLoading}
      className={`${styles.button} ${isFollowing ? styles.following : styles.notFollowing}`}
    >
      {isFollowing ? 'Following' : 'Follow'}
    </Button>
  );
};
