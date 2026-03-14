import { useMutation } from '@tanstack/react-query';
import { message } from 'antd';
import { authLogin } from '../../api/authLogin';
import type { UserLoginDTO } from '../../types';
import { useAuthStore } from '../../stores/useAuthStore';
import { runAuthTransition } from '../../../../shared/utils/authTransition';

export const useLoginForm = (onSuccess?: () => void) => {
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

  return {
    onFinish,
    isPending: mutation.isPending
  };
};
