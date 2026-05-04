import React, { useState } from 'react';
import { useAdminReviewList } from './useAdminReviewList';
import styles from './AdminReviewManagementPage.module.scss';
import type { SpotReviewResponse } from '../../types';

export const AdminReviewManagementPage: React.FC = () => {
  const [filterReviewId, setFilterReviewId] = useState<string>('');
  const [reviewToDelete, setReviewToDelete] = useState<SpotReviewResponse | null>(null);
  
  const {
    data,
    loading,
    errorMsg,
    handlePageChange,
    handleFilter,
    deleteReviewById
  } = useAdminReviewList();

  const applyFilters = () => {
    const rId = filterReviewId ? Number(filterReviewId) : undefined;
    handleFilter(rId);
  };

  const executeDelete = async () => {
    if (reviewToDelete) {
      await deleteReviewById(reviewToDelete.id);
      setReviewToDelete(null);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2>Review Moderation</h2>
      </header>

      {errorMsg && <div className={styles.errorMessage}>{errorMsg}</div>}

      <div className={styles.filterSection}>
        <input 
          type="number" 
          placeholder="Search exact Review ID..." 
          value={filterReviewId}
          onChange={(e) => setFilterReviewId(e.target.value)}
          className={styles.filterInput}
        />
        <button onClick={applyFilters} className={styles.searchBtn}>Find Review</button>
      </div>

      <div className={styles.tableContainer}>
        {loading && !data ? (
          <div>Loading Spot Reviews...</div>
        ) : (
          <>
            <table className={styles.reviewTable}>
              <thead>
                <tr>
                  <th>Review ID</th>
                  <th>Author</th>
                  <th>Rating</th>
                  <th>Content Snapshot</th>
                  <th>Published Time</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.list.map(review => {
                  const safeContent = review.content.length > 50 ? review.content.substring(0, 50) + '...' : review.content;
                  return (
                    <tr key={review.id}>
                      <td>#{review.id}</td>
                      <td>
                        <div className={styles.authorProfile}>
                          {review.userIcon && <img src={review.userIcon} alt={review.userNickname} className={styles.avatar} />}
                          <strong>{review.userNickname || 'Unknown'}</strong>
                        </div>
                      </td>
                      <td>
                        <span className={styles.ratingBadge}>★ {review.rating} / 5</span>
                      </td>
                      <td><div className={styles.contentSnippet}>{safeContent}</div></td>
                      <td>{new Date(review.createTime).toLocaleString()}</td>
                      <td className={styles.actionsCell}>
                         <button 
                           className={styles.deleteActionBtn} 
                           onClick={() => setReviewToDelete(review)}
                         >
                           Remove Review
                         </button>
                      </td>
                    </tr>
                  );
                })}
                {data?.list.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center' }}>No reviews currently matched.</td>
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

      {reviewToDelete && (
        <div className={styles.confirmOverlay}>
          <div className={styles.confirmModal}>
            <h3>Confirm Review Deletion</h3>
            <p>Are you sure you want to forcibly delete Review #{reviewToDelete.id} written by {reviewToDelete.userNickname}? This penalty is irreversible and destroys all linked visual traces.</p>
            <div className={styles.confirmActions}>
              <button className={styles.confirmCancelBtn} onClick={() => setReviewToDelete(null)}>
                Cancel
              </button>
              <button className={styles.confirmDeleteBtn} onClick={executeDelete}>
                Delete Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
