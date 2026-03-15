import React from 'react';
import { Avatar, Typography, Flex, Button } from 'antd';
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
    <div className={styles.cardWrapper}>
      <Flex gap={24} align="flex-start" className={styles.mainLayout}>
        <Avatar 
          src={user.icon} 
          className={styles.avatar}
        >
          {user.nickname?.charAt(0).toUpperCase()}
        </Avatar>
        
        <Flex vertical className={styles.rightSection}>
          <Flex justify="space-between" align="flex-start" className={styles.headerRow}>
            <Flex vertical>
              <Title level={2} className={styles.name}>
                {user.nickname}
              </Title>
              <Text className={styles.intro}>
                {user.intro || 'This person is lazy and wrote nothing.'}
              </Text>
            </Flex>
            
            <div className={styles.actionArea}>
              {isCurrentUser ? (
                <Button shape="round" className={styles.editBtn}>
                  Edit Profile
                </Button>
              ) : (
                <FollowButton userId={user.id} />
              )}
            </div>
          </Flex>

          <Flex gap={32} className={styles.statsRow}>
            <div className={styles.statBlock}>
              <Text className={styles.statNumber}>{user.followee || 0}</Text>
              <Text className={styles.statLabel}>Following</Text>
            </div>
            <div className={styles.statBlock}>
              <Text className={styles.statNumber}>{user.fans || 0}</Text>
              <Text className={styles.statLabel}>Followers</Text>
            </div>
            <div className={styles.statBlock}>
              <Text className={styles.statNumber}>{user.credit || 0}</Text>
              <Text className={styles.statLabel}>Credit</Text>
            </div>
          </Flex>
        </Flex>
      </Flex>
    </div>
  );
};
