import React, { useState } from 'react';
import { Typography, Flex } from 'antd';
import { ManOutlined, WomanOutlined, SettingOutlined, LeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { FollowButton } from '../FollowButton';
import { EditProfileModal } from '../EditProfileModal';
import { SettingsModal } from '../SettingsModal';
import { UserListModal } from '../../../../shared/components/UserListModal';
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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'followers' | 'following' | null>(null);

  // Use actual info, fallback to subtle text if empty
  const introText = user.intro || "This user hasn't written a bio yet.";
  const navigate = useNavigate();

  return (
    <div className={styles.cardWrapper}>
      {isCurrentUser && (
        <div className={styles.settingsIconWrapper} onClick={() => setIsSettingsModalOpen(true)}>
          <SettingOutlined className={styles.settingsIcon} />
        </div>
      )}
      {!isCurrentUser && (
        <div className={styles.backIconWrapper} onClick={() => navigate(-1)}>
          <LeftOutlined className={styles.backIcon} />
        </div>
      )}
      <Flex gap={40} align="flex-start" className={styles.mainLayout}>
        <div className={styles.avatarContainer}>
          {user.icon ? (
            <img src={user.icon} alt="user avatar" className={styles.avatarImg} />
          ) : (
            <div className={styles.avatarPlaceholder}>
              {user.nickname?.substring(0, 2).toUpperCase() || 'ME'}
            </div>
          )}
        </div>
        
        <Flex vertical className={styles.rightSection}>
          <div className={styles.headerRow}>
            <Title level={2} className={styles.name}>
              {user.nickname || 'My Account'}
              {user.gender === 1 && <ManOutlined className={styles.genderIconMale} />}
              {user.gender === 2 && <WomanOutlined className={styles.genderIconFemale} />}
            </Title>
          </div>
          <div className={styles.idLabel}>ID: {user.id}</div>
          
          <Text className={styles.intro}>
            {introText}
          </Text>

          <Flex gap={40} className={styles.statsRow}>
            <div className={styles.statBlock} onClick={() => setModalType('following')}>
              <Text className={styles.statNumber}>{user.followingCount ?? user.followee ?? 0}</Text>
              <Text className={styles.statLabel}>Following</Text>
            </div>
            <div className={styles.statBlock} onClick={() => setModalType('followers')}>
              <Text className={styles.statNumber}>{user.followersCount ?? user.fans ?? 0}</Text>
              <Text className={styles.statLabel}>Followers</Text>
            </div>
          </Flex>

          <div className={styles.actionArea}>
            {isCurrentUser ? (
              <button className={styles.editBtn} onClick={() => setIsEditModalOpen(true)}>
                Edit Profile
              </button>
            ) : (
              <FollowButton 
                userId={user.id} 
                initialIsFollowing={user.isFollowing ?? user.isFollow ?? false} 
              />
            )}
          </div>
        </Flex>
      </Flex>
      {isCurrentUser && (
        <>
          <EditProfileModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            currentUser={user}
          />
          <SettingsModal
            isOpen={isSettingsModalOpen}
            onClose={() => setIsSettingsModalOpen(false)}
            initialPrivacy={user.likesPrivate}
          />
        </>
      )}
      <UserListModal 
        isOpen={!!modalType}
        onClose={() => setModalType(null)}
        type={modalType || 'followers'}
        title={modalType === 'followers' ? 'Followers' : 'Following'}
        userId={user.id}
      />
    </div>
  );
};
