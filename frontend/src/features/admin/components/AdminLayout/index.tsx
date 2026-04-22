import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import styles from './AdminLayout.module.scss';
import { useAdminLayout } from './useAdminLayout';

export const AdminLayout: React.FC = () => {
  const { isAuthenticated, isLoggingOut, adminUser, handleLogout } = useAdminLayout();

  // Route Guard
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className={styles.adminLayout}>
      <header className={styles.header}>
        <div className={styles.welcomeText}>
          {adminUser ? `Welcome, ${adminUser.username}` : 'Admin Portal'}
        </div>
        <button 
          className={styles.logoutButton} 
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? 'Logging out...' : 'Logout'}
        </button>
      </header>
      
      <main className={styles.mainContent}>
        {/* Child routes like Dashboard will render here */}
        <Outlet />
      </main>
    </div>
  );
};
