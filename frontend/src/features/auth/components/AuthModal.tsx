import React, { useState } from 'react';
import { Modal, Typography } from 'antd';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

const { Title, Text } = Typography;

interface AuthModalProps {
  visible: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ visible, onClose }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');

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
      <div style={{ textAlign: 'center', marginBottom: '32px', marginTop: '16px' }}>
        <Title 
          level={3} 
          style={{ 
            color: '#ff2442', 
            fontWeight: 700, 
            marginBottom: '8px' 
          }}
        >
          Rate My Spot
        </Title>
        <Text style={{ color: '#666', fontSize: '14px' }}>
          Discover & Share amazing spots
        </Text>
      </div>

      {mode === 'login' ? (
        <LoginForm 
          onSuccess={handleClose} 
          onSwitchToRegister={() => setMode('register')} 
        />
      ) : (
        <RegisterForm 
          onSuccess={handleClose} 
          onSwitchToLogin={() => setMode('login')} 
        />
      )}
    </Modal>
  );
};
