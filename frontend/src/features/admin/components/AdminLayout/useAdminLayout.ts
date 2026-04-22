import { useNavigate } from 'react-router-dom';
import { adminLogout } from '../../api/adminLogout';
import { useAdminAuthStore } from '../../stores/useAdminAuthStore';
import { useState } from 'react';

export const useAdminLayout = () => {
  const navigate = useNavigate();
  const { adminToken, adminUser, logout } = useAdminAuthStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Protected Route logic checks token
  const isAuthenticated = !!adminToken;

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await adminLogout();
    } catch (err: unknown) {
      console.error('Logout failed:', err);
    } finally {
      // Always remove token and navigate away even if the API call slightly fails
      // Because we want the local session completely gone
      logout();
      navigate('/admin/login', { replace: true });
      setIsLoggingOut(false);
    }
  };

  return {
    isAuthenticated,
    isLoggingOut,
    adminUser,
    handleLogout
  };
};
