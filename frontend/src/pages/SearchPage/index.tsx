import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Input, Tabs, Spin, Typography, Avatar, Flex, Button } from 'antd';
import { SearchOutlined, LeftOutlined } from '@ant-design/icons';

import { useSearchPosts } from '../../features/posts/hooks/useSearchPosts';
import { useSearchUsers } from '../../features/users/hooks/useSearchUsers';
import { PostItem } from '../../features/posts/components/PostItem';
import { FollowButton } from '../../shared/components/FollowButton';
import { useUIStore } from '../../shared/stores/useUIStore';
import { useToggleLike } from '../../features/posts/hooks/useToggleLike';
import { useQueryClient } from '@tanstack/react-query';

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
  const queryClient = useQueryClient();
  
  // Data State bounded by Infinite Hooks intelligently filtering active renders.
  const {
    posts,
    isLoading: isPostsLoading,
    fetchNextPage: fetchNextPosts,
    hasNextPage: hasNextPosts,
    isFetchingNextPage: isFetchingPosts
  } = useSearchPosts(rawKeyword, activeTab === 'posts');

  const {
    users,
    isLoading: isUsersLoading,
    fetchNextPage: fetchNextUsers,
    hasNextPage: hasNextUsers,
    isFetchingNextPage: isFetchingUsers
  } = useSearchUsers(rawKeyword, activeTab === 'users');

  const isLoading = activeTab === 'posts' ? isPostsLoading : isUsersLoading;

  const postSentinelRef = React.useRef<HTMLDivElement>(null);
  const userSentinelRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputVal(rawKeyword); // Synchronize input if route params change externally
  }, [rawKeyword]);

  // Observer for Post Infinite Scroll
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPosts && !isFetchingPosts) fetchNextPosts();
    }, { threshold: 0.1 });
    if (postSentinelRef.current) observer.observe(postSentinelRef.current);
    return () => observer.disconnect();
  }, [hasNextPosts, isFetchingPosts, fetchNextPosts]);

  // Observer for User Infinite Scroll
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextUsers && !isFetchingUsers) fetchNextUsers();
    }, { threshold: 0.1 });
    if (userSentinelRef.current) observer.observe(userSentinelRef.current);
    return () => observer.disconnect();
  }, [hasNextUsers, isFetchingUsers, fetchNextUsers]);

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
            <>
              <div className={styles.postGrid}>
              {posts.map(post => (
                <div key={post.id} className={styles.postCard}>
                  <PostItem 
                    post={post} 
                    onClick={(id) => setSelectedPostId(id)}
                    onLike={(id) => {
                      // Apply optimistic update via React Query
                      queryClient.setQueryData(['searchPosts', rawKeyword], (oldData: any) => {
                        if (!oldData) return oldData;
                        return {
                          ...oldData,
                          pages: oldData.pages.map((page: any) => ({
                            ...page,
                            data: {
                              ...page.data,
                              list: page.data.list.map((p: any) => {
                                if (p.id === id) {
                                  const isLiked = !p.isLiked;
                                  const likedCount = isLiked ? (p.liked || 0) + 1 : Math.max(0, (p.liked || 0) - 1);
                                  return { ...p, isLiked, liked: likedCount };
                                }
                                return p;
                              })
                            }
                          }))
                        };
                      });
                      toggleLike(id);
                    }}
                  />
                </div>
              ))}
            </div>
            {/* Infinite Scroll Post Sentinel Node */}
            <div ref={postSentinelRef} style={{ width: '100%', height: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '20px 0' }}>
              {isFetchingPosts && <Spin size="large" />}
            </div>
          </>
          ) : (
            <Flex justify="center" className={styles.emptyContainer}>
              <Text type="secondary">No posts found for "{rawKeyword}"</Text>
            </Flex>
          )
        ) : (
          /* U S E R   L I S T   V I E W */
          users.length > 0 ? (
            <>
              <div className={styles.userList}>
              {users.map((user: UserResponse) => (
                <div 
                  key={user.id} 
                  className={styles.userRow}
                  onClick={() => navigate(`/user/${user.id}`)} 
                  style={{ cursor: 'pointer' }}
                >
                  <Avatar src={user.icon} size={48} className={styles.avatar}>
                    {user.nickname?.charAt(0).toUpperCase() || 'U'}
                  </Avatar>
                  <div className={styles.userInfo}>
                    <div className={styles.nickname}>{user.nickname}</div>
                    {user.intro && <div className={styles.intro}>{user.intro}</div>}
                  </div>
                  <div className={styles.actionArea} onClick={e => e.stopPropagation()}>
                    <FollowButton 
                      targetUserId={user.id} 
                      initialIsFollow={user.isFollowing ?? user.isFollow ?? false}
                      onFollowToggle={(newStatus) => {
                        queryClient.setQueryData(['searchUsers', rawKeyword], (oldData: any) => {
                          if (!oldData) return oldData;
                          return {
                            ...oldData,
                            pages: oldData.pages.map((page: any) => ({
                              ...page,
                              data: {
                                ...page.data,
                                list: page.data.list.map((u: any) => 
                                  u.id === user.id ? { ...u, isFollowing: newStatus, isFollow: newStatus } : u
                                )
                              }
                            }))
                          };
                        });
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            {/* Infinite Scroll User Sentinel Node */}
            <div ref={userSentinelRef} style={{ width: '100%', height: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '20px 0' }}>
              {isFetchingUsers && <Spin size="large" />}
            </div>
          </>
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
