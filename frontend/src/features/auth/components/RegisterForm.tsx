import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Typography, message, Space } from 'antd';
import { useMutation } from '@tanstack/react-query';
import { authRegister } from '../api/authRegister';
import { authSendCode } from '../api/authSendCode';
import type { UserRegisterDTO } from '../types';

const { Text } = Typography;

interface RegisterFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess, onSwitchToLogin }) => {
  const [form] = Form.useForm();
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);
  
  const mutation = useMutation({
    mutationFn: authRegister,
    onSuccess: () => {
      message.success('Registration successful! Please log in.');
      onSuccess?.();
      // Auto switch to login after successful registration
      if (onSwitchToLogin) {
        onSwitchToLogin();
      }
    },
    onError: (error: Error) => {
      message.error(error.message || 'Registration failed.');
    }
  });

  const onFinish = (values: UserRegisterDTO) => {
    mutation.mutate(values);
  };

  const resendCode = async () => {
    try {
      const values = await form.validateFields(['email']);
      const email = values.email;
      
      const res = await authSendCode(email, 0); // 0 corresponds to registration
      message.success(typeof res.data === 'string' ? res.data : 'Verification code sent to your email.');
      setCountdown(60); // Start 60-second cooldown
    } catch (error) {
      if (error && typeof error === 'object' && 'errorFields' in error) {
        // Validation error from validateFields
        return;
      }
      if (error instanceof Error) {
        message.error(error.message || 'Failed to send verification code.');
      } else {
        message.error('Failed to send verification code.');
      }
    }
  };

  return (
    <div style={{ padding: '24px 0' }}>
      <Form
        form={form}
        name="register"
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
          label={<span style={{ color: '#888', fontSize: '12px' }}>Verification Code</span>}
          name="code"
          rules={[{ required: true, message: 'Please input verification code!' }]}
          style={{ marginBottom: '16px' }}
        >
          <Space.Compact style={{ width: '100%' }}>
             <Input 
                placeholder="6-digit code" 
                size="large"
                style={{ borderRadius: '8px 0 0 8px' }}
             />
             <Button 
                type="default" 
                size="large" 
                onClick={resendCode} 
                disabled={countdown > 0}
                style={{ borderRadius: '0 8px 8px 0', width: '120px' }}>
                {countdown > 0 ? `${countdown}s` : 'Send Code'}
             </Button>
          </Space.Compact>
        </Form.Item>

        <Form.Item
          label={<span style={{ color: '#888', fontSize: '12px' }}>Password</span>}
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
            Sign Up
          </Button>
        </Form.Item>
      </Form>
      
      {onSwitchToLogin && (
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <Text style={{ color: '#333', fontSize: '13px' }}>Already have an account? </Text>
          <span 
            onClick={onSwitchToLogin} 
            style={{ color: '#ff2442', cursor: 'pointer', fontSize: '13px', textDecoration: 'underline' }}
          >
            Log in
          </span>
        </div>
      )}
    </div>
  );
};
