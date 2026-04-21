import React from 'react';
import styles from './AdminLoginPage.module.scss';
import { useAdminLoginForm } from './useAdminLoginForm';

// Isolated View for Admin Login
export const AdminLoginPage: React.FC = () => {
  const { formData, loading, errorMsg, handleChange, handleSubmit } = useAdminLoginForm();

  return (
    <div className={styles.adminLoginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.header}>
          <h2>System Admin Dashboard</h2>
          <p>Please log in with admin credentials.</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              disabled={loading}
              className={styles.neumorphicInput}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              disabled={loading}
              className={styles.neumorphicInput}
            />
          </div>

          {errorMsg && <div className={styles.errorMessage}>{errorMsg}</div>}

          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};
