import React, { useState } from 'react';
import { useAdminPostList } from './useAdminPostList';
import styles from './AdminPostManagementPage.module.scss';
import type { PostResponse } from '../../../posts/types';

export const AdminPostManagementPage: React.FC = () => {
  const [postToDelete, setPostToDelete] = useState<PostResponse | null>(null);
  const [keywordInput, setKeywordInput] = useState('');

  const {
    data,
    loading,
    errorMsg,
    handlePageChange,
    handleFilterKeyword,
    deletePostById
  } = useAdminPostList();

  const executeDelete = async () => {
    if (postToDelete) {
      await deletePostById(postToDelete.id);
      setPostToDelete(null);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2>Post Moderation</h2>
      </header>

      {errorMsg && <div className={styles.errorMessage}>{errorMsg}</div>}

      <div className={styles.controlsBar}>
        <input 
          type="text" 
          placeholder="Search post title or content..." 
          className={styles.searchInput}
          value={keywordInput}
          onChange={(e) => setKeywordInput(e.target.value)}
        />
        <button 
          className={styles.searchBtn} 
          onClick={() => handleFilterKeyword(keywordInput)}
        >
          Search Posts
        </button>
      </div>

      <div className={styles.tableContainer}>
        {loading && !data ? (
          <div>Loading UGC Posts...</div>
        ) : (
          <>
            <table className={styles.postTable}>
              <thead>
                <tr>
                  <th>Post ID</th>
                  <th>Author</th>
                  <th>Spot Target</th>
                  <th>Content Snippet</th>
                  <th>Date Posted</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.list.map(post => {
                  const safeContent = post.content.length > 50 ? post.content.substring(0, 50) + '...' : post.content;
                  return (
                    <tr key={post.id}>
                      <td>#{post.id}</td>
                      <td>
                        <div className={styles.authorProfile}>
                          {post.userIcon && <img src={post.userIcon} alt={post.userNickname} className={styles.avatar} />}
                          <strong>{post.userNickname || 'Unknown User'}</strong>
                        </div>
                      </td>
                      <td>
                        <span className={styles.badge}>{post.spotName || `Spot #${post.spotId}`}</span>
                      </td>
                      <td><div className={styles.contentSnippet}>{safeContent}</div></td>
                      <td>{new Date(post.createTime).toLocaleString()}</td>
                      <td className={styles.actionsCell}>
                         <button 
                           className={styles.deleteActionBtn} 
                           onClick={() => setPostToDelete(post)}
                         >
                           Remove Post
                         </button>
                      </td>
                    </tr>
                  );
                })}
                {data?.list.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center' }}>No posts requiring moderation found.</td>
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

      {postToDelete && (
        <div className={styles.confirmOverlay}>
          <div className={styles.confirmModal}>
            <h3>Confirm Content Deletion</h3>
            <p>Are you sure you want to forcibly delete Post #{postToDelete.id} by {postToDelete.userNickname}? This will securely remove the UGC record and its comments permanently.</p>
            <div className={styles.confirmActions}>
              <button className={styles.confirmCancelBtn} onClick={() => setPostToDelete(null)}>
                Cancel
              </button>
              <button className={styles.confirmDeleteBtn} onClick={executeDelete}>
                Delete UGC
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
