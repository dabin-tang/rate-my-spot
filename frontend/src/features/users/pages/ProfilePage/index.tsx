import React from 'react';
import { Flex, Typography, Empty, Tabs, Skeleton } from 'antd';
import { useAuthStore } from '../../../auth/stores/useAuthStore';
import { UserProfileCard } from '../../components/UserProfileCard';
import { useCurrentUserProfile } from '../../hooks/useCurrentUserProfile';

import styles from './ProfilePage.module.scss';

const { Title, Text } = Typography;

export const ProfilePage: React.FC = () => {
  const { user, token } = useAuthStore();
  const { data: profileData, isLoading } = useCurrentUserProfile();

  if (!token || !user) {
    return (
      <Flex justify="center" align="center" className={styles.emptyContainer}>
        <Title level={4}>Please log in to view your profile.</Title>
      </Flex>
    );
  }

  const tabItems = [
    {
      label: 'My Posts',
      key: 'posts',
      children: (
        <div className={styles.tabContent}>
           <Text type="secondary">User posts API integration coming soon...</Text>
        </div>
      ),
    },
    {
      label: 'My Likes',
      key: 'liked',
      children: (
        <div className={styles.tabContent}>
          <Text type="secondary">Liked posts API integration coming soon...</Text>
        </div>
      ),
    },
  ];

  return (
    <div className={styles.pageContainer}>
      <div className={styles.profileHeaderSection}>
        {isLoading || !profileData ? (
          <div style={{ padding: '40px' }}>
             <Skeleton avatar active paragraph={{ rows: 3 }} />
          </div>
        ) : (
          <UserProfileCard user={profileData} isCurrentUser={true} />
        )}
      </div>

      <div className={styles.tabsSection}>
        <Tabs 
          defaultActiveKey="posts" 
          items={tabItems}
          className={styles.profileTabs}
          centered
        />
      </div>
    </div>
  );
};
