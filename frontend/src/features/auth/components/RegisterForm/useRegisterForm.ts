import { useState, useEffect } from 'react';
import { Form, message } from 'antd';
import { useMutation } from '@tanstack/react-query';
import { authRegister } from '../../api/authRegister';
import { authSendCode } from '../../api/authSendCode';
import type { UserRegisterDTO } from '../../types';

export const useRegisterForm = (onSuccess?: () => void, onSwitchToLogin?: () => void) => {
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
        return; // Validation error
      }
      if (error instanceof Error) {
        message.error(error.message || 'Failed to send verification code.');
      } else {
        message.error('Failed to send verification code.');
      }
    }
  };

  return {
    form,
    countdown,
    onFinish,
    resendCode,
    isPending: mutation.isPending
  };
};
