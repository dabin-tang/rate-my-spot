import React, { useState } from 'react';
import { Modal, Typography } from 'antd';
import { LoginForm } from '../LoginForm';
import { RegisterForm } from '../RegisterForm';
import { ForgotPasswordForm } from '../ForgotPasswordForm';
import styles from './AuthModal.module.scss';

const { Title, Text } = Typography;

interface AuthModalProps {
  visible: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ visible, onClose }) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot_password'>('login');

  const handleClose = () => {
    setMode('login'); // Reset to login mode on close
    onClose();
  };

  return (
    <Modal
      open={visible}
      onCancel={handleClose}
      footer={null}
      width={400}
      centered
      destroyOnClose
      maskClosable={false}
      styles={{
        body: { padding: '8px' },
      }}
    >
      <div className={styles.headerContainer}>
        <Title 
          level={3} 
          className={styles.title}
        >
          Rate My Spot
        </Title>
        <Text className={styles.subtitle}>
          Discover & Share amazing spots
        </Text>
      </div>

      {mode === 'login' ? (
        <LoginForm 
          onSuccess={handleClose} 
          onSwitchToRegister={() => setMode('register')} 
          onSwitchToForgotPassword={() => setMode('forgot_password')}
        />
      ) : mode === 'register' ? (
        <RegisterForm 
          onSuccess={handleClose} 
          onSwitchToLogin={() => setMode('login')} 
        />
      ) : (
        <ForgotPasswordForm
          onSuccess={handleClose}
          onSwitchToLogin={() => setMode('login')}
        />
      )}
    </Modal>
  );
};
