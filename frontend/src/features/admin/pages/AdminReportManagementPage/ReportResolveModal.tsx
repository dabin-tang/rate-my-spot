import React, { useState } from 'react';
import styles from './ReportResolveModal.module.scss';
import type { ReportResponse, ResolveReportDTO } from '../../types';

interface ReportResolveModalProps {
  report: ReportResponse;
  onClose: () => void;
  onResolve: (id: number, payload: ResolveReportDTO) => Promise<void>;
}

export const ReportResolveModal: React.FC<ReportResolveModalProps> = ({ report, onClose, onResolve }) => {
  const [status, setStatus] = useState<number>(1);
  const [remark, setRemark] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await onResolve(report.id, { status, adminRemark: remark });
    setSubmitting(false);
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3>Process Report #{report.id}</h3>
        
        <div className={styles.reportSummary}>
          <p><strong>Target:</strong> {report.targetType} #{report.targetId}</p>
          <p><strong>Reason:</strong> {report.reason}</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Action to Take:</label>
            <div className={styles.radioGroup}>
              <label className={styles.radioBlock}>
                <input 
                  type="radio" 
                  name="status" 
                  value={1} 
                  checked={status === 1} 
                  onChange={() => setStatus(1)} 
                />
                <div className={styles.radioLabel}>
                  <strong>Resolve & Delete Content</strong>
                  <span>Delete the target UGC and notify system</span>
                </div>
              </label>
              <label className={styles.radioBlock}>
                <input 
                  type="radio" 
                  name="status" 
                  value={2} 
                  checked={status === 2} 
                  onChange={() => setStatus(2)} 
                />
                <div className={styles.radioLabel}>
                  <strong>Reject Report (Ignore)</strong>
                  <span>Keep the content, disregard this report</span>
                </div>
              </label>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Admin Remark / Reason (Optional)</label>
            <textarea 
              value={remark} 
              onChange={(e) => setRemark(e.target.value)} 
              placeholder="Internal moderation note or ban reason..."
              rows={3}
            />
          </div>

          <div className={styles.actions}>
            <button type="button" onClick={onClose} className={styles.cancelBtn} disabled={submitting}>Cancel</button>
            <button type="submit" className={styles.submitBtn} disabled={submitting}>
              {submitting ? 'Processing...' : 'Confirm Execution'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
