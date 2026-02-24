import React, { useState } from 'react';
import { Flex, Button, Typography, Layout as AntLayout, Dropdown, Modal } from 'antd';
import { HomeOutlined, PlusCircleOutlined, UserOutlined, HeartOutlined, EditOutlined, MessageOutlined, LogoutOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/stores/useAuthStore';
import { AuthModal } from '../../features/auth/components/AuthModal';
import { runAuthTransition } from '../utils/authTransition';

// Sidebar component props definition
interface SidebarProps {
  collapsed?: boolean;
}

const { Sider } = AntLayout;
const { Text } = Typography;

const Sidebar: React.FC<SidebarProps> = ({ collapsed = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthModalVisible, setIsAuthModalVisible] = useState(false);
  
  // Subscribe to Zustand auth state
  const { user, token, logout } = useAuthStore();
  const isLoggedIn = !!token;

  const handleLogout = () => {
    Modal.confirm({
      title: <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>Log Out</div>,
      content: <div style={{ color: '#666', fontSize: '15px' }}>Are you sure you want to log out?</div>,
      icon: null,
      okText: 'Yes, log out',
      cancelText: 'Cancel',
      okButtonProps: { danger: true, shape: 'round', size: 'large', style: { minWidth: '100px' } },
      cancelButtonProps: { shape: 'round', size: 'large', type: 'text', style: { background: '#f5f5f5', color: '#666', minWidth: '100px' } },
      width: 400,
      centered: true,
      maskClosable: true,
      onOk() {
        runAuthTransition('Logging out...', () => {
          logout();
          navigate('/');
        });
      }
    });
  };

  // Define sidebar navigation items
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
      style={{
        borderRight: '1px solid #eee',
        height: '100vh',
        position: 'sticky',
        top: 0,
        left: 0,
        zIndex: 100,
        overflow: 'hidden'
      }}
    >
      <Flex vertical style={{ height: '100%', padding: '24px 16px' }}>
        
        {/* Application Logo Area */}
        <style>{`
          @keyframes floatLogo {
            0% { transform: translateY(0px); filter: drop-shadow(0 4px 8px rgba(255, 36, 66, 0.15)); }
            50% { transform: translateY(-4px); filter: drop-shadow(0 8px 16px rgba(255, 36, 66, 0.25)); }
            100% { transform: translateY(0px); filter: drop-shadow(0 4px 8px rgba(255, 36, 66, 0.15)); }
          }
          @keyframes pulseStar {
            0% { transform: scale(1) rotate(0deg); opacity: 0.8; }
            50% { transform: scale(1.1) rotate(180deg); opacity: 1; fill: #ffd700; }
            100% { transform: scale(1) rotate(360deg); opacity: 0.8; }
          }
          @keyframes expandRing {
            0% { r: 10; opacity: 0.8; stroke-width: 3; }
            100% { r: 35; opacity: 0; stroke-width: 0; }
          }
          .brand-logo-container {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 40px;
            padding: 10px 0;
            cursor: pointer;
            transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          }
          .brand-logo-container:hover {
            transform: scale(1.05);
          }
          .animated-pin {
            animation: floatLogo 4s ease-in-out infinite;
            transform-origin: center bottom;
          }
          .animated-star {
            animation: pulseStar 4s linear infinite;
            transform-origin: 50% 35%; 
          }
          .animated-ring {
            animation: expandRing 2.5s cubic-bezier(0.2, 0.8, 0.2, 1) infinite;
            transform-origin: center;
          }
        `}</style>
        <div className="brand-logo-container" onClick={() => navigate('/')}>
          <svg width="140" height="48" viewBox="0 0 140 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Outer expanding ripple */}
            <circle cx="24" cy="24" r="10" stroke="#ff2442" className="animated-ring" />
            
            <g className="animated-pin">
              {/* Main Map Pin Body */}
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
              
              {/* Inner cutout for the star */}
              <circle cx="24" cy="20" r="10" fill="white" />
              
              {/* The "Rate" Star inside the pin */}
              <path 
                className="animated-star"
                d="M24 13L25.5 17.5H30L26.5 20.5L28 25L24 22L20 25L21.5 20.5L18 17.5H22.5L24 13Z" 
                fill="#ff2442" 
              />
            </g>
            
            {/* Minimalist Modern Typography beside the logo */}
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

        {/* Navigation Menu */}
        <Flex vertical gap={8} style={{ flex: 1 }}>
          {menuItems.map(item => {
            const isActive = location.pathname === item.key || 
                            (item.key !== '/' && location.pathname.startsWith(item.key));
            return (
              <div
                key={item.key}
                onClick={() => {
                  if (item.key === '/post/create' && !isLoggedIn) {
                    setIsAuthModalVisible(true);
                    return;
                  }
                  if (item.key === '/profile' && !isLoggedIn) {
                    setIsAuthModalVisible(true);
                    return;
                  }
                  navigate(item.key);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  backgroundColor: isActive ? '#f0f2f5' : 'transparent',
                  color: isActive ? '#111' : '#666',
                  transition: 'background 0.2s',
                  fontSize: '16px',
                  fontWeight: isActive ? 600 : 500,
                }}
              >
                <span style={{ marginRight: 12, fontSize: 20, display: 'flex' }}>
                  {item.icon}
                </span>
                {!collapsed && <span>{item.label}</span>}
              </div>
            );
          })}
        </Flex>

        {/* Footer Authentication Area */}
        <div style={{ marginTop: 'auto' }}>
          {!isLoggedIn ? (
            <Flex vertical gap={16}>
              <Button 
                type="text" 
                shape="round" 
                size="large"
                style={{ 
                  width: '100%', 
                  fontSize: '16px',
                  fontWeight: 'bold',
                  backgroundColor: '#f5f5f5',
                  color: '#333',
                  border: 'none',
                  boxShadow: 'none'
                }}
                onClick={() => setIsAuthModalVisible(true)}
              >
                Log In
              </Button>
              <div style={{ 
                border: '1px solid rgba(0,0,0,0.03)', 
                borderRadius: '16px', 
                padding: '16px', 
                background: '#fff',
                boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
              }}>
                <Text strong style={{ fontSize: '13px', display: 'block', marginBottom: 12, color: '#333' }}>
                  Log in to explore more
                </Text>
                <Flex vertical gap={8}>
                  <Flex align="center" gap={8}><HeartOutlined style={{color: '#777'}}/><Text style={{ fontSize: '12px', color: '#666' }}>view your liked posts</Text></Flex>
                  <Flex align="center" gap={8}><EditOutlined style={{color: '#777'}}/><Text style={{ fontSize: '12px', color: '#666' }}>comment and post</Text></Flex>
                  <Flex align="center" gap={8}><MessageOutlined style={{color: '#777'}}/><Text style={{ fontSize: '12px', color: '#666' }}>connect with others</Text></Flex>
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
              <Flex 
                align="center" 
                gap={12} 
                style={{
                  padding: '12px',
                  background: '#f9f9f9',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
              >
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: '#333',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  flexShrink: 0
                }}>
                  {user?.nickname?.charAt(0)?.toUpperCase() || 'Me'}
                </div>
                <Text strong style={{ fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
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
