import React from 'react';
import { Flex, Typography, Empty, Tabs } from 'antd';
import { useAuthStore } from '../../../auth/stores/useAuthStore';
import { UserProfileCard } from '../../components/UserProfileCard';

import styles from './ProfilePage.module.scss';

const { Title, Text } = Typography;

export const ProfilePage: React.FC = () => {
  const { user, token } = useAuthStore();

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
           <Text type="secondary" className={styles.comingSoon}>User posts API integration coming soon...</Text>
           {/* Replace with actual UserPostsFeed when API is ready */}
        </div>
      ),
    },
    {
      label: 'Liked',
      key: 'liked',
      children: (
        <div className={styles.tabContent}>
          <Text type="secondary" className={styles.comingSoon}>Liked posts API integration coming soon...</Text>
        </div>
      ),
    },
    {
      label: 'Collections',
      key: 'collections',
      children: (
        <div className={styles.tabContent}>
          <Empty description="No collections found" />
        </div>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <UserProfileCard user={user as Exclude<typeof user, null>} isCurrentUser={true} />
        
        <div className={styles.tabsContainer}>
          <Tabs 
            defaultActiveKey="posts" 
            items={tabItems}
            size="large"
            tabBarStyle={{ padding: '0 16px', fontWeight: 600 }}
          />
        </div>
      </div>
    </div>
  );
};
