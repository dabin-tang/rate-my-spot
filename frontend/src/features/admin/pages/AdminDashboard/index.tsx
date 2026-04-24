import React from 'react';
import { useAdminDashboard } from './useAdminDashboard';
import styles from './AdminDashboard.module.scss';

export const AdminDashboard: React.FC = () => {
  const { stats, loading, errorMsg } = useAdminDashboard();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>System Overview</h1>
      </header>
      
      {loading && <div className={styles.loadingText}>Loading statistics...</div>}
      
      {errorMsg && <div className={styles.errorMessage}>{errorMsg}</div>}
      
      {!loading && !errorMsg && stats && (
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <h3>Total Users</h3>
            <p>{stats.totalUsers.toLocaleString()}</p>
          </div>
          <div className={styles.statCard}>
            <h3>Total Posts</h3>
            <p>{stats.totalPosts.toLocaleString()}</p>
          </div>
          <div className={styles.statCard}>
            <h3>Today's Posts</h3>
            <p>{stats.todayPosts.toLocaleString()}</p>
          </div>
          <div className={styles.statCard}>
            <h3>Total Spots</h3>
            <p>{stats.totalSpots.toLocaleString()}</p>
          </div>
        </div>
      )}
    </div>
  );
};
