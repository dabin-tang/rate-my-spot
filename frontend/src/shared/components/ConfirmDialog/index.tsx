import React from 'react';
import { createPortal } from 'react-dom';
import { Typography, Flex } from 'antd';
import { WarningOutlined } from '@ant-design/icons';
import styles from './ConfirmDialog.module.scss';

const { Title, Text } = Typography;

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDanger = true,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return createPortal(
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.iconWrapper}>
          <WarningOutlined className={`${styles.icon} ${isDanger ? styles.dangerIcon : ''}`} />
        </div>
        
        <Title level={4} className={styles.title}>
          {title}
        </Title>
        
        <Text className={styles.message}>
          {message}
        </Text>
        
        <Flex gap={12} className={styles.actions} justify="center">
          <button className={styles.cancelBtn} onClick={onCancel}>
            {cancelText}
          </button>
          <button 
            className={`${styles.confirmBtn} ${isDanger ? styles.dangerBtn : ''}`} 
            onClick={() => {
              onConfirm();
              onCancel();
            }}
          >
            {confirmText}
          </button>
        </Flex>
      </div>
    </div>,
    document.body
  );
};
