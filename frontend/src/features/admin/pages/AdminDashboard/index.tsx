import React from 'react';
import { useAdminDashboard } from './useAdminDashboard';
import styles from './AdminDashboard.module.scss';

export const AdminDashboard: React.FC = () => {
  const { stats } = useAdminDashboard();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Admin Dashboard</h1>
      </header>
      
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h3>Total Users</h3>
          <p>{stats.users}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Total Posts</h3>
          <p>{stats.posts}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Pending Reports</h3>
          <p>{stats.reports}</p>
        </div>
      </div>
      
      <div>
        <p>Admin features coming soon...</p>
      </div>
    </div>
  );
};
