import React from 'react';
import { Navigate, Outlet, NavLink } from 'react-router-dom';
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
      
      <div className={styles.bodyArea}>
        <aside className={styles.sidebar}>
          <nav className={styles.navMenu}>
            <NavLink 
              to="/admin/dashboard" 
              className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}
            >
              Dashboard
            </NavLink>
            <NavLink 
              to="/admin/user-management" 
              className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}
            >
              User Management
            </NavLink>
            <NavLink 
              to="/admin/spot-management" 
              className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}
            >
              Spot Management
            </NavLink>
            <NavLink 
              to="/admin/category-management" 
              className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}
            >
              Category Management
            </NavLink>
            <NavLink 
              to="/admin/post-management" 
              className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}
            >
              Post Management
            </NavLink>
          </nav>
        </aside>

        <main className={styles.mainContent}>
          {/* Child routes like Dashboard will render here */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};
