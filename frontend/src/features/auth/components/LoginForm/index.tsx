import React from 'react';
import { Form, Input, Button, Typography } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import { useLoginForm } from './useLoginForm';
import styles from './LoginForm.module.scss';

const { Text } = Typography;

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
  onSwitchToForgotPassword?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onSwitchToRegister, onSwitchToForgotPassword }) => {
  const { onFinish, isPending, animState, userData } = useLoginForm(onSuccess);

  return (
    <div className={styles.container}>
      <div className={`${styles.formWrapper} ${animState !== 'idle' ? styles.vanish : ''}`}>
        <div className={styles.heroGraphic}>
          <svg viewBox="0 0 400 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.citySvg}>
            <path d="M50 120 V50 H80 V120 M120 120 V20 H180 V120 M220 120 V70 H270 V120 M310 120 V40 H360 V120" stroke="#eee" strokeWidth="2" />
            <path d="M60 60 H70 M60 80 H70 M130 40 H140 M160 40 H170 M130 60 H140 M160 60 H170 M130 80 H140 M160 80 H170 M230 80 H260 M320 60 H350 M320 80 H350" stroke="#eee" strokeWidth="2" />
            <circle cx="200" cy="80" r="8" fill="#ff2442" opacity="0.8" />
            <path d="M200 88 L200 100" stroke="#ff2442" strokeWidth="2" opacity="0.8" />
            <circle cx="200" cy="100" r="3" fill="#ff2442" opacity="0.8" />
          </svg>
        </div>

        <Form
          name="login"
          onFinish={onFinish}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            label={<span className={styles.label}>Email</span>}
            name="email"
            rules={[
              { required: true, message: 'Please input your Email!' },
              { type: 'email', message: 'The input is not valid E-mail!' }
            ]}
            style={{ marginBottom: '12px' }}
          >
            <Input 
              placeholder="name@example.com" 
              size="large"
              className={styles.input}
            />
          </Form.Item>

          <Form.Item
            label={<span className={styles.label}>Password</span>}
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
            style={{ marginBottom: '8px' }}
          >
            <Input.Password
              placeholder="******"
              size="large"
              className={styles.input}
            />
          </Form.Item>
          {onSwitchToForgotPassword && (
            <div className={styles.forgotPasswordWrapper}>
              <span className={styles.forgotAction} onClick={onSwitchToForgotPassword}>
                Forgot Password?
              </span>
            </div>
          )}

          <Form.Item style={{ marginTop: '20px', marginBottom: 0 }}>
            <Button 
              type="primary" 
              htmlType="submit" 
              size="large"
              block 
              shape="round"
              loading={isPending}
              className={styles.submitBtn}
            >
              Log In
            </Button>
          </Form.Item>
        </Form>
        
        {onSwitchToRegister && (
          <div className={styles.switchContainer}>
            <Text className={styles.switchText}>New here? </Text>
            <span 
              onClick={onSwitchToRegister} 
              className={styles.switchAction}
            >
              Create an account
            </span>
          </div>
        )}
      </div>

      {animState === 'success' && userData && (
        <div className={styles.successOverlay}>
           <div className={styles.avatarContainer}>
              <img src={userData.icon || 'https://api.dicebear.com/7.x/notionists/svg?seed=fallback'} alt="user avatar" className={styles.avatarPulsate} />
           </div>
           <div className={styles.welcomeText}>Welcome, {userData.nickname}!</div>
           <div className={styles.checkWrapper}>
              <CheckOutlined className={styles.checkIcon} />
           </div>
        </div>
      )}
    </div>
  );
};
