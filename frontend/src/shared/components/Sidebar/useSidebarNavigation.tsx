import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Modal } from 'antd';
import { useAuthStore } from '../../../features/auth/stores/useAuthStore';
import { runAuthTransition } from '../../utils/authTransition';


export const useSidebarNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthModalVisible, setIsAuthModalVisible] = useState(false);
  
  const { user, token, logout } = useAuthStore();
  const isLoggedIn = !!token;

  const handleLogout = () => {
    Modal.confirm({
      // Inline styles here because they are inside a component render function passed to Modal
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

  const navigateTo = (path: string) => {
    if ((path === '/post/create' || path === '/profile') && !isLoggedIn) {
      setIsAuthModalVisible(true);
      return;
    }
    navigate(path);
  };

  const isActivePath = (path: string) => {
    return location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
  };

  return {
    user,
    isLoggedIn,
    isAuthModalVisible,
    setIsAuthModalVisible,
    handleLogout,
    navigateTo,
    isActivePath
  };
};
