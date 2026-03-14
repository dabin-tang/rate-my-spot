import React from 'react';
import { Form, Input, Button, Typography } from 'antd';
import { useLoginForm } from './useLoginForm';
import styles from './LoginForm.module.scss';

const { Text } = Typography;

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onSwitchToRegister }) => {
  const { onFinish, isPending } = useLoginForm(onSuccess);

  return (
    <div className={styles.container}>
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
          style={{ marginBottom: '16px' }}
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
  );
};
