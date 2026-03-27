import React from 'react';
import { Form, Input, Button, Typography, Space } from 'antd';
import { useForgotPasswordForm } from './useForgotPasswordForm';
import styles from './ForgotPasswordForm.module.scss';

const { Text } = Typography;

interface ForgotPasswordFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onSuccess, onSwitchToLogin }) => {
  const { form, countdown, onFinish, resendCode, isPending } = useForgotPasswordForm(onSuccess, onSwitchToLogin);

  return (
    <div className={styles.container}>
      <Form
        form={form}
        name="forgotPassword"
        onFinish={onFinish}
        layout="vertical"
        requiredMark={false}
      >
        <Form.Item
          label={<span className={styles.label}>Email Address</span>}
          name="email"
          rules={[
            { required: true, message: 'Please input your registered email!' },
            { type: 'email', message: 'The input is not a valid E-mail!' }
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
          label={<span className={styles.label}>Verification Code</span>}
          name="code"
          rules={[{ required: true, message: 'Please input the verification code sent to your email!' }]}
          style={{ marginBottom: '12px' }}
        >
          <Space.Compact style={{ width: '100%' }}>
             <Input 
                placeholder="6-digit code" 
                size="large"
                className={styles.codeInput}
             />
             <Button 
                type="default" 
                size="large" 
                onClick={resendCode} 
                disabled={countdown > 0}
                className={styles.codeBtn}
             >
                {countdown > 0 ? `${countdown}s` : 'Get Code'}
             </Button>
          </Space.Compact>
        </Form.Item>

        <Form.Item
          label={<span className={styles.label}>New Password</span>}
          name="password"
          rules={[
            { required: true, message: 'Please input your new password!' },
            { min: 6, message: 'Password must be at least 6 characters long.' }
          ]}
          style={{ marginBottom: '12px' }}
        >
          <Input.Password
            placeholder="******"
            size="large"
            className={styles.input}
          />
        </Form.Item>

        <Form.Item style={{ marginTop: '20px' }}>
          <Button 
            type="primary" 
            htmlType="submit" 
            size="large"
            block 
            shape="round"
            loading={isPending}
            className={styles.submitBtn}
          >
            Reset Password
          </Button>
        </Form.Item>
      </Form>
      
      {onSwitchToLogin && (
        <div className={styles.switchContainer}>
          <Text className={styles.switchText}>Remember your password? </Text>
          <span 
            onClick={onSwitchToLogin} 
            className={styles.switchAction}
          >
            Log in
          </span>
        </div>
      )}
    </div>
  );
};
