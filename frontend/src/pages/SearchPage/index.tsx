import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Input, Tabs, Spin, Typography, Avatar, Flex, Button } from 'antd';
import { SearchOutlined, LeftOutlined } from '@ant-design/icons';

import { searchPosts } from '../../features/posts/api/searchPosts';
import { searchUsers } from '../../features/users/api/searchUsers';
import { PostItem } from '../../features/posts/components/PostItem';
import { FollowButton } from '../../shared/components/FollowButton';
import { useUIStore } from '../../shared/stores/useUIStore';
import { useToggleLike } from '../../features/posts/hooks/useToggleLike';

import type { PostResponse } from '../../features/posts/types';
import type { UserResponse } from '../../features/users/types';
import styles from './SearchPage.module.scss';

const { Text } = Typography;

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const setSelectedPostId = useUIStore((state) => state.setSelectedPostId);
  const { mutate: toggleLike } = useToggleLike();

  const rawKeyword = searchParams.get('q') || '';
  const activeTab = searchParams.get('type') || 'posts';

  const [inputVal, setInputVal] = useState(rawKeyword);
  
  // Data State
  const [posts, setPosts] = useState<PostResponse[]>([]);
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setInputVal(rawKeyword); // Synchronize input if route params change externally
    if (rawKeyword.trim()) {
      handleSearchExecution(rawKeyword.trim());
    } else {
      setPosts([]);
      setUsers([]);
    }
  }, [rawKeyword]);

  const handleSearchExecution = async (triggerKeyword: string) => {
    setIsLoading(true);
    try {
      // Parallel execution mapping both endpoints securely
      const [postsRes, usersRes] = await Promise.all([
        searchPosts(triggerKeyword),
        searchUsers(triggerKeyword)
      ]);
      // Safely unpack backend PageResult wrappers resolving arrays dynamically
      const postsArray = (Array.isArray(postsRes.data) ? postsRes.data : (postsRes.data as Record<string, unknown>)?.list || []) as PostResponse[];
      const usersArray = (Array.isArray(usersRes.data) ? usersRes.data : (usersRes.data as Record<string, unknown>)?.list || []) as UserResponse[];
      
      setPosts(postsArray);
      setUsers(usersArray);
    } catch (err) {
      console.error('Failed sweeping global search:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSearch = () => {
    if (!inputVal.trim()) return;
    setSearchParams({ q: inputVal.trim(), type: activeTab });
  };

  const onTabChange = (key: string) => {
    setSearchParams({ q: rawKeyword, type: key });
  };

  return (
    <div className={styles.container}>
      {/* Centered Top Navigation */}
      <div className={styles.header}>
        <div className={styles.headerSpacer}>
          <Button 
            type="text" 
            icon={<LeftOutlined />} 
            className={styles.backBtn}
            onClick={() => navigate('/')} 
          />
        </div>
        
        <div className={styles.searchWrapper}>
          <Input 
            placeholder="Search..." 
            suffix={
              <div 
                onClick={handleManualSearch}
                style={{ cursor: 'pointer', padding: '0 4px', display: 'flex', alignItems: 'center', transition: 'opacity 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.6'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                <SearchOutlined style={{ color: '#333', fontSize: '18px' }} />
              </div>
            }
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onPressEnter={handleManualSearch}
            className={styles.searchInput}
            allowClear
          />
        </div>

        <div className={styles.headerSpacer}></div>
      </div>

      <div className={styles.tabWrapper}>
        <Tabs 
          activeKey={activeTab} 
          onChange={onTabChange}
          centered
          className={styles.tabs}
          items={[
            { key: 'posts', label: 'Posts' },
            { key: 'users', label: 'Users' }
          ]}
        />
      </div>

      <div className={styles.contentArea}>
        {isLoading ? (
          <Flex justify="center" align="center" style={{ height: '300px' }}>
            <Spin size="large" />
          </Flex>
        ) : activeTab === 'posts' ? (
          /* P O S T   F E E D   G R I D */
          posts.length > 0 ? (
            <div className={styles.postGrid}>
              {posts.map(post => (
                <div key={post.id} className={styles.postCard}>
                  <PostItem 
                    post={post} 
                    onClick={(id) => setSelectedPostId(id)}
                    onLike={(id) => {
                      // Apply optimistic update locally since Search bypasses React Query pools
                      setPosts(prev => prev.map(p => {
                        if (p.id === id) {
                          const isLiked = !p.isLiked;
                          const likedCount = isLiked ? (p.liked || 0) + 1 : Math.max(0, (p.liked || 0) - 1);
                          return { ...p, isLiked, liked: likedCount };
                        }
                        return p;
                      }));
                      toggleLike(id);
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <Flex justify="center" className={styles.emptyContainer}>
              <Text type="secondary">No posts found for "{rawKeyword}"</Text>
            </Flex>
          )
        ) : (
          /* U S E R   L I S T   V I E W */
          users.length > 0 ? (
            <div className={styles.userList}>
              {users.map((user: UserResponse) => (
                <div key={user.id} className={styles.userRow}>
                  <Avatar src={user.icon} size={48} className={styles.avatar}>
                    {user.nickname?.charAt(0).toUpperCase() || 'U'}
                  </Avatar>
                  <div className={styles.userInfo}>
                    <div className={styles.nickname}>{user.nickname}</div>
                    {user.intro && <div className={styles.intro}>{user.intro}</div>}
                  </div>
                  <div className={styles.actionArea}>
                    <FollowButton 
                      targetUserId={user.id} 
                      initialIsFollow={user.isFollowing ?? user.isFollow ?? false}
                      onFollowToggle={(newStatus) => {
                        setUsers(prev => prev.map(u => 
                          u.id === user.id ? { ...u, isFollowing: newStatus } : u
                        ));
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Flex justify="center" className={styles.emptyContainer}>
              <Text type="secondary">No users found for "{rawKeyword}"</Text>
            </Flex>
          )
        )}
      </div>
    </div>
  );
};
