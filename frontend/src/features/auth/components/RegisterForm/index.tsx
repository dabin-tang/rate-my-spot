import React from 'react';
import { Form, Input, Button, Typography, Space } from 'antd';
import { useRegisterForm } from './useRegisterForm';
import styles from './RegisterForm.module.scss';

const { Text } = Typography;

interface RegisterFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess, onSwitchToLogin }) => {
  const { form, countdown, onFinish, resendCode, isPending } = useRegisterForm(onSuccess, onSwitchToLogin);

  return (
    <div className={styles.container}>
      <Form
        form={form}
        name="register"
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
          style={{ marginBottom: '16px' }}
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
          rules={[{ required: true, message: 'Please input verification code!' }]}
          style={{ marginBottom: '16px' }}
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
                {countdown > 0 ? `${countdown}s` : 'Send Code'}
             </Button>
          </Space.Compact>
        </Form.Item>

        <Form.Item
          label={<span className={styles.label}>Password</span>}
          name="password"
          rules={[
            { required: true, message: 'Please input your Password!' },
            { min: 6, message: 'Password must be at least 6 characters.' }
          ]}
          style={{ marginBottom: '24px' }}
        >
          <Input.Password
            placeholder="******"
            size="large"
            className={styles.input}
          />
        </Form.Item>

        <Form.Item style={{ marginTop: '32px' }}>
          <Button 
            type="primary" 
            htmlType="submit" 
            size="large"
            block 
            shape="round"
            loading={isPending}
            className={styles.submitBtn}
          >
            Sign Up
          </Button>
        </Form.Item>
      </Form>
      
      {onSwitchToLogin && (
        <div className={styles.switchContainer}>
          <Text className={styles.switchText}>Already have an account? </Text>
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
