import React, { useState } from 'react';
import { useAdminSpotList } from './useAdminSpotList';
import styles from './AdminSpotManagementPage.module.scss';
import { SpotFormModal } from './SpotFormModal';
import type { SpotResponse } from '../../../spots/types';
const DEFAULT_IMG = 'https://images.unsplash.com/photo-1555685812-4b943f1cb6eb?auto=format&fit=crop&w=150&q=80'; 

export const AdminSpotManagementPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSpot, setEditingSpot] = useState<SpotResponse | null>(null);
  const [spotToDelete, setSpotToDelete] = useState<SpotResponse | null>(null);
  
  const {
    data,
    loading,
    errorMsg,
    handlePageChange,
    handleFilterKeyword,
    refreshSpots,
    deleteSpotById
  } = useAdminSpotList();

  const [keywordInput, setKeywordInput] = useState('');

  const executeDelete = async () => {
    if (spotToDelete) {
      await deleteSpotById(spotToDelete.id);
      setSpotToDelete(null);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2>Spot Management</h2>
        <button className={styles.createBtn} onClick={() => { setEditingSpot(null); setIsModalOpen(true); }}>
          + Create New Spot
        </button>
      </header>

      {errorMsg && <div className={styles.errorMessage}>{errorMsg}</div>}

      <div className={styles.controlsBar}>
        <input 
          type="text" 
          placeholder="Search spot name or details..." 
          className={styles.searchInput}
          value={keywordInput}
          onChange={(e) => setKeywordInput(e.target.value)}
        />
        <button 
          className={styles.searchBtn} 
          onClick={() => handleFilterKeyword(keywordInput)}
        >
          Search Spot
        </button>
      </div>

      <div className={styles.tableContainer}>
        {loading && !data ? (
          <div>Loading Spots...</div>
        ) : (
          <>
            <table className={styles.spotTable}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Spot Details</th>
                  <th>Address</th>
                  <th>Score</th>
                  <th>Reviews</th>
                  <th>Creation Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {data?.list.map(spot => {
                  const firstImgUrl = spot.images ? spot.images.split(',')[0] : DEFAULT_IMG;
                  return (
                    <tr key={spot.id}>
                      <td>#{spot.id}</td>
                      <td>
                        <div className={styles.spotTitleCell}>
                          <img src={firstImgUrl} alt={spot.name} />
                          <div>
                            <strong>{spot.name}</strong>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={styles.badge}>{spot.address}</span>
                      </td>
                      <td>{spot.score.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</td>
                      <td>{spot.reviewCount}</td>
                      <td>{new Date(spot.createTime).toLocaleDateString()}</td>
                      <td className={styles.actionsCell}>
                         <button 
                           className={styles.editBtn} 
                           onClick={() => { setEditingSpot(spot); setIsModalOpen(true); }}
                         >
                           Edit
                         </button>
                         <button 
                           className={styles.deleteActionBtn} 
                           onClick={() => setSpotToDelete(spot)}
                         >
                           Delete
                         </button>
                      </td>
                    </tr>
                  );
                })}
                {data?.list.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center' }}>No spots found.</td>
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

      {isModalOpen && (
        <SpotFormModal 
          initialData={editingSpot}
          onClose={() => { setIsModalOpen(false); setEditingSpot(null); }} 
          onSuccess={refreshSpots} 
        />
      )}

      {spotToDelete && (
        <div className={styles.confirmOverlay}>
          <div className={styles.confirmModal}>
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to permanently delete "{spotToDelete.name}"? This action cannot be undone.</p>
            <div className={styles.confirmActions}>
              <button className={styles.confirmCancelBtn} onClick={() => setSpotToDelete(null)}>
                Cancel
              </button>
              <button className={styles.confirmDeleteBtn} onClick={executeDelete}>
                Delete Spot
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
