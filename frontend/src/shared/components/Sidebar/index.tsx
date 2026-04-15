import React from 'react';
import { Flex, Button, Typography, Layout as AntLayout, Dropdown } from 'antd';
import { HomeOutlined, PlusCircleOutlined, UserOutlined, HeartOutlined, EditOutlined, MessageOutlined, LogoutOutlined } from '@ant-design/icons';
import { AuthModal } from '../../../features/auth/components/AuthModal';
import { useSidebarNavigation } from './useSidebarNavigation';
import { TrendingSpotsPanel } from '../../../features/spots/components/TrendingSpotsPanel';
import styles from './Sidebar.module.scss';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  collapsed?: boolean;
}

const { Sider } = AntLayout;
const { Text } = Typography;

const Sidebar: React.FC<SidebarProps> = ({ collapsed = false }) => {
  const { 
    user, 
    isLoggedIn, 
    isAuthModalVisible, 
    setIsAuthModalVisible, 
    handleLogout, 
    navigateTo, 
    isActivePath 
  } = useSidebarNavigation();
  const navigate = useNavigate();

  const menuItems = [
    { key: '/', icon: <HomeOutlined />, label: 'Discover' },
    { key: '/post/create', icon: <PlusCircleOutlined />, label: 'Post' },
    { key: '/profile', icon: <UserOutlined />, label: 'Profile' },
  ];

  return (
    <Sider
      width={240}
      theme="light"
      collapsed={collapsed}
      className={styles.sider}
    >
      <Flex vertical className={styles.container}>
        
        <div className={styles.logoContainer} onClick={() => navigate('/')}>
          <svg width="140" height="48" viewBox="0 0 140 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="24" cy="24" r="10" stroke="#ff2442" className={styles.animatedRing} />
            
            <g className={styles.animatedPin}>
              <defs>
                <linearGradient id="pinGrad" x1="10" y1="10" x2="38" y2="44" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#ff4d64" />
                  <stop offset="1" stopColor="#e6102f" />
                </linearGradient>
                <filter id="shadow" x="-5" y="-5" width="60" height="60">
                  <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#ff2442" floodOpacity="0.2"/>
                </filter>
              </defs>
              <path 
                d="M24 4C14.0589 4 6 12.0589 6 22C6 33.5 21.5 45.4 22.8 46.4C23.5 46.9 24.5 46.9 25.2 46.4C26.5 45.4 42 33.5 42 22C42 12.0589 33.9411 4 24 4Z" 
                fill="url(#pinGrad)" 
                filter="url(#shadow)"
              />
              <circle cx="24" cy="20" r="10" fill="white" />
              <path 
                className={styles.animatedStar}
                d="M24 13L25.5 17.5H30L26.5 20.5L28 25L24 22L20 25L21.5 20.5L18 17.5H22.5L24 13Z" 
                fill="#ff2442" 
              />
            </g>
            
            <g transform="translate(54, 22)">
              <text 
                fill="#111" 
                fontFamily="'Inter', -apple-system, sans-serif" 
                fontWeight="900" 
                fontSize="16" 
                letterSpacing="-0.5"
              >
                Rate
              </text>
              <text 
                fill="#111" 
                fontFamily="'Inter', -apple-system, sans-serif" 
                fontWeight="800" 
                fontSize="14" 
                letterSpacing="-0.2"
                y="16"
              >
                My Spot
              </text>
              <circle cx="68" cy="12" r="2.5" fill="#ff2442" />
            </g>
          </svg>
        </div>

        <Flex vertical gap={8} className={styles.navMenu}>
          {menuItems.map(item => {
            const isActive = isActivePath(item.key);
            return (
              <div
                key={item.key}
                onClick={() => navigateTo(item.key)}
                className={`${styles.navItem} ${isActive ? styles.navItemActive : styles.navItemInactive}`}
              >
                <span className={styles.navIcon}>
                  {item.icon}
                </span>
                {!collapsed && <span>{item.label}</span>}
              </div>
            );
          })}
        </Flex>

        {!collapsed && (
          <TrendingSpotsPanel 
            isLoggedIn={isLoggedIn} 
            onLoginRequest={() => setIsAuthModalVisible(true)} 
          />
        )}

        <div className={styles.footer}>
          {!isLoggedIn ? (
            <Flex vertical gap={16}>
              <Button 
                type="text" 
                shape="round" 
                size="large"
                className={styles.loginBtn}
                onClick={() => setIsAuthModalVisible(true)}
              >
                Log In
              </Button>
              <div className={styles.loginPromo}>
                <Text strong className={styles.promoTitle}>
                  Log in to explore more
                </Text>
                <Flex vertical gap={8}>
                  <Flex align="center" gap={8}><HeartOutlined className={styles.promoIcon}/><Text className={styles.promoItem}>view your liked posts</Text></Flex>
                  <Flex align="center" gap={8}><EditOutlined className={styles.promoIcon}/><Text className={styles.promoItem}>comment and post</Text></Flex>
                  <Flex align="center" gap={8}><MessageOutlined className={styles.promoIcon}/><Text className={styles.promoItem}>connect with others</Text></Flex>
                </Flex>
              </div>
            </Flex>
          ) : (
            <Dropdown 
              menu={{ 
                items: [
                  {
                    key: 'logout',
                    icon: <LogoutOutlined />,
                    label: 'Log out',
                    danger: true,
                    onClick: handleLogout
                  }
                ] 
              }} 
              trigger={['click']}
              placement="topRight"
            >
              <Flex align="center" gap={12} className={styles.userMenu}>
                <div className={styles.userAvatar}>
                  {user?.icon ? (
                    <img src={user.icon} alt="user avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    user?.nickname?.charAt(0)?.toUpperCase() || 'Me'
                  )}
                </div>
                <Text strong className={styles.userName}>
                  {user?.nickname || 'My Account'}
                </Text>
              </Flex>
            </Dropdown>
          )}
        </div>
      </Flex>
      <AuthModal 
        visible={isAuthModalVisible} 
        onClose={() => setIsAuthModalVisible(false)} 
      />
    </Sider>
  );
};

export default Sidebar;
