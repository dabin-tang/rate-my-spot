import React from 'react';
import { Flex, Tabs, Skeleton, Row, Col } from 'antd';
import { useAuthStore } from '../../../auth/stores/useAuthStore';
import { UserProfileCard } from '../../components/UserProfileCard';
import { useCurrentUserProfile } from '../../hooks/useCurrentUserProfile';

import styles from './ProfilePage.module.scss';

const PostGridSkeleton = () => (
  <div className={styles.tabContent}>
    <Row gutter={[16, 24]}>
      {Array.from({ length: 6 }).map((_, index) => (
        <Col xs={12} sm={12} md={8} lg={8} key={index}>
          <div className={styles.skeletonCard}>
            <div className={styles.skeletonImageWrapper}>
              <Skeleton.Image active />
            </div>
            <div style={{ marginTop: '12px' }}>
              <Skeleton active title={false} paragraph={{ rows: 2, width: ['100%', '60%'] }} />
            </div>
          </div>
        </Col>
      ))}
    </Row>
  </div>
);

export const ProfilePage: React.FC = () => {
  const { user, token } = useAuthStore();
  const { data: profileData, isLoading } = useCurrentUserProfile();

  if (!token || !user) {
    return (
      <Flex justify="center" align="center" className={styles.emptyContainer}>
        <h3>Please log in to view your profile.</h3>
      </Flex>
    );
  }

  const tabItems = [
    {
      label: 'My Posts',
      key: 'posts',
      children: <PostGridSkeleton />,
    },
    {
      label: 'My Likes',
      key: 'liked',
      children: <PostGridSkeleton />,
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
