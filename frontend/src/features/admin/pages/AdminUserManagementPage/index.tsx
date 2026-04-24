import React from 'react';
import { useAdminUserList } from './useAdminUserList';
import styles from './AdminUserManagementPage.module.scss';


export const AdminUserManagementPage: React.FC = () => {
  const {
    data,
    loading,
    errorMsg,
    queryParams,
    setQueryParams,
    handleSearch,
    handlePageChange,
    toggleUserStatus
  } = useAdminUserList();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2>User Management</h2>
      </header>

      <form className={styles.searchBar} onSubmit={handleSearch}>
        <input 
          type="text" 
          placeholder="Search Nickname..."
          className={styles.searchInput}
          value={queryParams.nickname || ''}
          onChange={e => setQueryParams(prev => ({ ...prev, nickname: e.target.value }))}
        />
        <input 
          type="email" 
          placeholder="Search Email..."
          className={styles.searchInput}
          value={queryParams.email || ''}
          onChange={e => setQueryParams(prev => ({ ...prev, email: e.target.value }))}
        />
        <button type="submit" className={styles.searchButton} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {errorMsg && <div className={styles.errorMessage}>{errorMsg}</div>}

      <div className={styles.tableContainer}>
        {loading && !data ? (
          <div>Loading Users...</div>
        ) : (
          <>
            <table className={styles.userTable}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Avatar</th>
                  <th>Nickname</th>
                  <th>Email</th>
                  <th>Credit</th>
                  <th>Status</th>
                  <th>Registration Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {data?.list.map(user => (
                  <tr key={user.id}>
                    <td>#{user.id}</td>
                    <td>
                      <img 
                        src={user.icon || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + user.id} 
                        alt={user.nickname} 
                        className={styles.userIcon} 
                      />
                    </td>
                    <td>{user.nickname}</td>
                    <td>{user.email}</td>
                    <td>{user.credit}</td>
                    <td>
                      <span className={user.status === 0 ? styles.statusActive : styles.statusBanned}>
                        {user.status === 0 ? 'Active' : 'Banned'}
                      </span>
                    </td>
                    <td>{new Date(user.createTime).toLocaleDateString()}</td>
                    <td>
                      <label className={styles.toggleSwitch} title={user.status === 0 ? "Ban User" : "Unban User"}>
                        <input 
                          type="checkbox" 
                          checked={user.status === 1}
                          onChange={() => toggleUserStatus(user.id, user.status)}
                        />
                        <span className={styles.slider}></span>
                      </label>
                    </td>
                  </tr>
                ))}
                {data?.list.length === 0 && (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center' }}>No users found matching your criteria.</td>
                  </tr>
                )}
              </tbody>
            </table>

            {data && data.totalPages > 1 && (
              <div className={styles.pagination}>
                <button 
                  className={styles.pageButton} 
                  disabled={data.page <= 1}
                  onClick={() => handlePageChange(data.page - 1)}
                >
                  Previous
                </button>
                <span>Page {data.page} of {data.totalPages}</span>
                <button 
                  className={styles.pageButton}
                  disabled={data.page >= data.totalPages}
                  onClick={() => handlePageChange(data.page + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
