import React from 'react';
import { Card, Avatar, Typography, Flex } from 'antd';
import { FollowButton } from '../FollowButton';
import type { UserProfileDTO } from '../../types';
import styles from './UserProfileCard.module.scss';

const { Title, Text } = Typography;

interface UserProfileCardProps {
  user: UserProfileDTO;
  isCurrentUser?: boolean;
}

export const UserProfileCard: React.FC<UserProfileCardProps> = ({ 
  user,
  isCurrentUser = false
}) => {
  return (
    <Card className={styles.card} bordered={false}>
      <Flex gap={24} align="center">
        <Avatar 
          size={84} 
          src={user.icon} 
          className={styles.avatar}
        >
          {user.nickname?.charAt(0).toUpperCase()}
        </Avatar>
        
        <Flex vertical gap={4} className={styles.info}>
          <Title level={3} className={styles.name}>
            {user.nickname}
          </Title>
          <Text className={styles.meta}>
            <span className={styles.stat}><strong>{user.fans || 0}</strong> followers</span>
            <span className={styles.divider}>·</span>
            <span className={styles.stat}><strong>{user.followee || 0}</strong> following</span>
          </Text>
        </Flex>

        {!isCurrentUser && (
            <div className={styles.action}>
              <FollowButton userId={user.id} />
            </div>
        )}
      </Flex>
    </Card>
  );
};
