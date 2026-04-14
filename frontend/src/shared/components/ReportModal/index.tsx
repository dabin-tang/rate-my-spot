import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Typography, Flex } from 'antd';
import { WarningOutlined, CloseOutlined } from '@ant-design/icons';
import { useSubmitReport } from '../../../features/report/hooks/useSubmitReport';
import styles from './ReportModal.module.scss';

const { Title, Text } = Typography;

interface ReportModalProps {
  isOpen: boolean;
  targetId: number;
  targetType: 'POST' | 'COMMENT' | 'REVIEW';
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  targetId,
  targetType,
  onClose,
}) => {
  const [reason, setReason] = useState('');
  
  const handleSuccess = () => {
    onClose();
    // clear input after modal disappears
    setTimeout(() => setReason(''), 200);
  };
  
  const { mutate: submitReport, isPending } = useSubmitReport(handleSuccess);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!reason.trim()) return;
    submitReport({ targetId, targetType, reason: reason.trim() });
  };

  const handleCancel = () => {
    onClose();
    setTimeout(() => setReason(''), 200);
  };

  const characterCount = reason.length;
  const isSubmitDisabled = !reason.trim() || characterCount > 255 || isPending;

  return createPortal(
    <div className={styles.overlay} onClick={handleCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        
        <button className={styles.closeBtn} onClick={handleCancel}>
          <CloseOutlined />
        </button>

        <div className={styles.iconWrapper}>
          <WarningOutlined className={styles.icon} />
        </div>
        
        <Title level={4} className={styles.title}>
          Report Content
        </Title>
        
        <Text className={styles.subtitle}>
          Please provide a reason for reporting this {targetType.toLowerCase()}. Our moderation team will review it.
        </Text>
        
        <div className={styles.inputWrapper}>
          <textarea
            className={styles.textarea}
            placeholder="What's wrong with this content?"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={isPending}
            rows={4}
            maxLength={255}
          />
          <div className={styles.characterCount}>
            {characterCount}/255
          </div>
        </div>

        <Flex gap={12} className={styles.actions} justify="center">
          <button className={styles.cancelBtn} onClick={handleCancel} disabled={isPending}>
            Cancel
          </button>
          <button 
            className={styles.submitBtn} 
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
          >
            {isPending ? 'Sending...' : 'Submit Report'}
          </button>
        </Flex>
      </div>
    </div>,
    document.body
  );
};
