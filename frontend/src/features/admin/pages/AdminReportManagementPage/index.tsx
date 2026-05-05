import React, { useState } from 'react';
import { useAdminReportList } from './useAdminReportList';
import { ReportResolveModal } from './ReportResolveModal';
import type { ReportResponse } from '../../types';
import styles from './AdminReportManagementPage.module.scss';

export const AdminReportManagementPage: React.FC = () => {
  const {
    data,
    loading,
    errorMsg,
    handlePageChange,
    handleFilterStatus,
    resolveReportById,
    queryParams
  } = useAdminReportList();

  const [resolvingReport, setResolvingReport] = useState<ReportResponse | null>(null);

  const renderStatusBadge = (status: number) => {
    switch(status) {
      case 0: return <span className={`${styles.badge} ${styles.badgePending}`}>Pending</span>;
      case 1: return <span className={`${styles.badge} ${styles.badgeResolved}`}>Resolved</span>;
      case 2: return <span className={`${styles.badge} ${styles.badgeRejected}`}>Rejected</span>;
      default: return <span className={styles.badge}>Unknown</span>;
    }
  };

  const renderTargetBadge = (type: string, id: number) => {
    let styleClass = '';
    if (type === 'POST') styleClass = styles.targetPost;
    else if (type === 'COMMENT') styleClass = styles.targetComment;
    else if (type === 'REVIEW') styleClass = styles.targetReview;

    return <span className={`${styles.targetBadge} ${styleClass}`}>{type} #{id}</span>;
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2>Report Handling</h2>
      </header>

      {errorMsg && <div className={styles.errorMessage}>{errorMsg}</div>}

      <div className={styles.filterSection}>
        <div className={styles.filterGroup}>
          <label>Filter Status:</label>
          <select 
            value={queryParams.status === undefined ? '' : queryParams.status} 
            onChange={(e) => {
              const val = e.target.value;
              handleFilterStatus(val === '' ? undefined : Number(val));
            }}
            className={styles.statusSelect}
          >
            <option value="">All Tickets</option>
            <option value="0">Pending Processing</option>
            <option value="1">Resolved (Acted)</option>
            <option value="2">Rejected (Ignored)</option>
          </select>
        </div>
      </div>

      <div className={styles.tableContainer}>
        {loading && !data ? (
          <div>Loading Report Tickets...</div>
        ) : (
          <>
            <table className={styles.reportTable}>
              <thead>
                <tr>
                  <th>Ticket ID</th>
                  <th>Reporter</th>
                  <th>Violating Target</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Date Logged</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.list.map(report => (
                  <tr key={report.id}>
                    <td>#{report.id}</td>
                    <td>User #{report.userId}</td>
                    <td>{renderTargetBadge(report.targetType, report.targetId)}</td>
                    <td>
                      <div className={styles.reasonCell}>
                        {report.reason}
                        {report.adminRemark && <div className={styles.remarkSubtext}>Note: {report.adminRemark}</div>}
                      </div>
                    </td>
                    <td>{renderStatusBadge(report.status)}</td>
                    <td>{new Date(report.createTime).toLocaleString()}</td>
                    <td>
                      {report.status === 0 ? (
                        <button 
                          className={styles.resolveActionBtn}
                          onClick={() => setResolvingReport(report)}
                        >
                          Process
                        </button>
                      ) : (
                        <span className={styles.noAction}>—</span>
                      )}
                    </td>
                  </tr>
                ))}
                {data?.list.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center' }}>No tickets found matching current criteria.</td>
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

      {resolvingReport && (
        <ReportResolveModal 
          report={resolvingReport}
          onClose={() => setResolvingReport(null)}
          onResolve={resolveReportById}
        />
      )}
    </div>
  );
};
