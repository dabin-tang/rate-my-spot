import React from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { useMutation } from '@tanstack/react-query';
import { authLogin } from '../api/authLogin';
import type { UserLoginDTO } from '../types';
import { useAuthStore } from '../stores/useAuthStore';
import { runAuthTransition } from '../../../shared/utils/authTransition';

const { Text } = Typography;

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onSwitchToRegister }) => {
  const loginAction = useAuthStore(state => state.login);

  const mutation = useMutation({
    mutationFn: authLogin,
    onSuccess: (res) => {
      runAuthTransition('Logging in...', () => {
        loginAction(res.data.user, res.data.token);
        onSuccess?.();
      });
    },
    onError: (error: Error) => {
      message.error(error.message || 'Login failed, please check your credentials.');
    }
  });

  const onFinish = (values: UserLoginDTO) => {
    mutation.mutate(values);
  };

  return (
    <div style={{ padding: '24px 0' }}>
      <Form
        name="login"
        onFinish={onFinish}
        layout="vertical"
        requiredMark={false}
      >
        <Form.Item
          label={<span style={{ color: '#888', fontSize: '12px' }}>Email</span>}
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
            style={{ borderRadius: '8px' }}
          />
        </Form.Item>

        <Form.Item
          label={<span style={{ color: '#888', fontSize: '12px' }}>Password</span>}
          name="password"
          rules={[{ required: true, message: 'Please input your Password!' }]}
          style={{ marginBottom: '24px' }}
        >
          <Input.Password
            placeholder="******"
            size="large"
            style={{ borderRadius: '8px' }}
          />
        </Form.Item>

        <Form.Item style={{ marginTop: '32px' }}>
          <Button 
            type="primary" 
            htmlType="submit" 
            size="large"
            block 
            shape="round"
            loading={mutation.isPending}
            style={{ fontWeight: 600 }}
          >
            Log In
          </Button>
        </Form.Item>
      </Form>
      
      {onSwitchToRegister && (
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <Text style={{ color: '#333', fontSize: '13px' }}>New here? </Text>
          <span 
            onClick={onSwitchToRegister} 
            style={{ color: '#ff2442', cursor: 'pointer', fontSize: '13px', textDecoration: 'underline' }}
          >
            Create an account
          </span>
        </div>
      )}
    </div>
  );
};
