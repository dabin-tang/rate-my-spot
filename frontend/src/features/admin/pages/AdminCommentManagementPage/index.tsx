import React, { useState } from 'react';
import { useAdminCommentList } from './useAdminCommentList';
import styles from './AdminCommentManagementPage.module.scss';
import type { AdminCommentResponse } from '../../types';

export const AdminCommentManagementPage: React.FC = () => {
  const [filterPostId, setFilterPostId] = useState<string>('');
  const [filterKeyword, setFilterKeyword] = useState<string>('');
  const [commentToDelete, setCommentToDelete] = useState<AdminCommentResponse | null>(null);
  
  const {
    data,
    loading,
    errorMsg,
    handlePageChange,
    handleFilter,
    deleteCommentById
  } = useAdminCommentList();

  const applyFilters = () => {
    const pId = filterPostId ? Number(filterPostId) : undefined;
    const kw = filterKeyword ? filterKeyword : undefined;
    handleFilter(pId, kw);
  };

  const executeDelete = async () => {
    if (commentToDelete) {
      await deleteCommentById(commentToDelete.id);
      setCommentToDelete(null);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2>Comment Moderation</h2>
      </header>

      {errorMsg && <div className={styles.errorMessage}>{errorMsg}</div>}

      <div className={styles.filterSection}>
        <input 
          type="number" 
          placeholder="Filter by Post ID" 
          value={filterPostId}
          onChange={(e) => setFilterPostId(e.target.value)}
          className={styles.filterInput}
        />
        <input 
          type="text" 
          placeholder="Search keyword..." 
          value={filterKeyword}
          onChange={(e) => setFilterKeyword(e.target.value)}
          className={styles.filterInput}
        />
        <button onClick={applyFilters} className={styles.searchBtn}>Search Filters</button>
      </div>

      <div className={styles.tableContainer}>
        {loading && !data ? (
          <div>Loading Comments...</div>
        ) : (
          <>
            <table className={styles.commentTable}>
              <thead>
                <tr>
                  <th>Comment ID</th>
                  <th>Post ID</th>
                  <th>Author ID</th>
                  <th>Content Snippet</th>
                  <th>Timestamp</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.list.map(comment => {
                  const safeContent = comment.content.length > 50 ? comment.content.substring(0, 50) + '...' : comment.content;
                  return (
                    <tr key={comment.id}>
                      <td>#{comment.id} {comment.parentId !== 0 && comment.parentId !== null ? `(Reply to #${comment.parentId})` : ''}</td>
                      <td>#{comment.postId}</td>
                      <td>User #{comment.userId}</td>
                      <td><div className={styles.contentSnippet}>{safeContent}</div></td>
                      <td>{new Date(comment.createTime).toLocaleString()}</td>
                      <td className={styles.actionsCell}>
                         <button 
                           className={styles.deleteActionBtn} 
                           onClick={() => setCommentToDelete(comment)}
                         >
                           Remove Comment
                         </button>
                      </td>
                    </tr>
                  );
                })}
                {data?.list.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center' }}>No matching comments found.</td>
                  </tr>
                )}
              </tbody>
            </table>

            {data && data.totalPages > 1 && (
              <div className={styles.pagination}>
                <button 
                  className={styles.pageButton} 
                  disabled={Number(data.page) <= 1}
                  onClick={() => handlePageChange(Number(data.page) - 1)}
                >
                  Previous
                </button>
                <span>Page {data.page} of {data.totalPages}</span>
                <button 
                  className={styles.pageButton}
                  disabled={Number(data.page) >= Number(data.totalPages)}
                  onClick={() => handlePageChange(Number(data.page) + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {commentToDelete && (
        <div className={styles.confirmOverlay}>
          <div className={styles.confirmModal}>
            <h3>Confirm Comment Deletion</h3>
            <p>Are you sure you want to forcibly delete Comment #{commentToDelete.id}? This will securely remove its threads and cannot be undone.</p>
            <div className={styles.confirmActions}>
              <button className={styles.confirmCancelBtn} onClick={() => setCommentToDelete(null)}>
                Cancel
              </button>
              <button className={styles.confirmDeleteBtn} onClick={executeDelete}>
                Delete Comment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
