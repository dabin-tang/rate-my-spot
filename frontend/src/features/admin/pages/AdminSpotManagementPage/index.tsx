import React, { useState } from 'react';
import { useAdminSpotList } from './useAdminSpotList';
import styles from './AdminSpotManagementPage.module.scss';
import { SpotFormModal } from './SpotFormModal';
const DEFAULT_IMG = 'https://images.unsplash.com/photo-1555685812-4b943f1cb6eb?auto=format&fit=crop&w=150&q=80'; 

export const AdminSpotManagementPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    data,
    loading,
    errorMsg,
    handlePageChange,
    refreshSpots
  } = useAdminSpotList();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2>Spot Management</h2>
        <button className={styles.createBtn} onClick={() => setIsModalOpen(true)}>
          + Create New Spot
        </button>
      </header>

      {errorMsg && <div className={styles.errorMessage}>{errorMsg}</div>}

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
                      <td>
                         <span style={{color: '#a0aec0'}}>Actions coming soon</span>
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
          onClose={() => setIsModalOpen(false)} 
          onSuccess={refreshSpots} 
        />
      )}
    </div>
  );
};
