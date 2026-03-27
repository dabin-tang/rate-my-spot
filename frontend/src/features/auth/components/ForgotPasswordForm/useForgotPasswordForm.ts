import { useState, useEffect } from 'react';
import { Form, message } from 'antd';
import { useResetPassword } from '../../hooks/useResetPassword';
import { authSendCode } from '../../api/authSendCode';
import type { UserRegisterDTO } from '../../../users/types';

export const useForgotPasswordForm = (onSuccess?: () => void, onSwitchToLogin?: () => void) => {
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
  
  const mutation = useResetPassword(() => {
    onSuccess?.();
    if (onSwitchToLogin) onSwitchToLogin();
  });

  const onFinish = (values: UserRegisterDTO) => {
    mutation.mutate(values);
  };

  const resendCode = async () => {
    try {
      const values = await form.validateFields(['email']);
      const email = values.email;
      
      const res = await authSendCode(email, 1); // 1 = password reset
      message.success(typeof res.data === 'string' ? res.data : 'Verification code sent to your email.');
      setCountdown(60); 
    } catch (error) {
      if (error && typeof error === 'object' && 'errorFields' in error) {
        return; // AntD Form validation error caught gracefully
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
