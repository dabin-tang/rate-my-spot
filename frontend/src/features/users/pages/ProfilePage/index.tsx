import React from 'react';
import { Flex, Tabs, Skeleton, Row, Col } from 'antd';
import { useParams } from 'react-router-dom';
import { useAuthStore } from '../../../auth/stores/useAuthStore';
import { UserProfileCard } from '../../components/UserProfileCard';
import { useUserProfile } from '../../hooks/useUserProfile';
import { UserPostFeed } from '../../../posts/components/UserPostFeed';
import { UserLikeFeed } from '../../../posts/components/UserLikeFeed';

import styles from './ProfilePage.module.scss';

const PostGridSkeleton = ({ columns = 5 }: { columns?: 3 | 5 }) => {
  const count = columns === 5 ? 10 : 6;
  return (
    <Row gutter={columns === 5 ? [16, 16] : [24, 24]}>
      {Array.from({ length: count }).map((_, index) => (
        <Col xs={12} sm={12} md={columns === 5 ? 6 : 8} lg={columns === 5 ? 4 : 8} key={index}>
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
  );
};

export const ProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const routeUserId = id ? parseInt(id, 10) : undefined;
  
  const { user, token } = useAuthStore();
  
  // Determine if viewing own profile based on URL matching
  const isCurrentUser = !routeUserId || (user && user.id === routeUserId) || false;
  const targetUserId = isCurrentUser ? user?.id : routeUserId;

  const { data: profileData, isLoading } = useUserProfile(targetUserId);

  if (isCurrentUser && (!token || !user) && !isLoading) {
    return (
      <Flex justify="center" align="center" className={styles.emptyContainer}>
        <h3>Please log in to view your profile.</h3>
      </Flex>
    );
  }

  if (!isCurrentUser && !profileData && !isLoading) {
    return (
      <Flex justify="center" align="center" className={styles.emptyContainer}>
        <h3>User not found.</h3>
      </Flex>
    );
  }

  const tabItems = [
    {
      label: isCurrentUser ? 'My Posts' : 'Posts',
      key: 'posts',
      children: (
        <div className={styles.tabContent}>
          <UserPostFeed userId={profileData?.id || 0} columns={3} skeletonGrid={<PostGridSkeleton columns={3} />} />
        </div>
      ),
    },
    {
      label: isCurrentUser ? 'My Likes' : 'Likes',
      key: 'liked',
      children: (
        <div className={styles.tabContent}>
          <UserLikeFeed userId={targetUserId || 0} columns={5} skeletonGrid={<PostGridSkeleton columns={5} />} />
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
          <UserProfileCard user={profileData} isCurrentUser={isCurrentUser} />
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
