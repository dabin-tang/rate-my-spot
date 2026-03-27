import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { message } from 'antd';
import { authLogin } from '../../api/authLogin';
import type { UserLoginDTO } from '../../types';
import { useAuthStore } from '../../stores/useAuthStore';
import type { UserProfileDTO } from '../../../users/types';

type AuthAnimationState = 'idle' | 'authenticating' | 'success';

export const useLoginForm = (onSuccess?: () => void) => {
  const loginAction = useAuthStore(state => state.login);
  const [animState, setAnimState] = useState<AuthAnimationState>('idle');
  const [userData, setUserData] = useState<UserProfileDTO | null>(null);

  const mutation = useMutation({
    mutationFn: authLogin,
    onError: (error: Error) => {
      setAnimState('idle');
      message.error(error.message || 'Login failed, please check your credentials.');
    }
  });

  const onFinish = async (values: UserLoginDTO) => {
    setAnimState('authenticating');
    
    // Guarantee minimum 600ms vanish transition
    const minDelay = new Promise(resolve => setTimeout(resolve, 600));
    
    try {
      const res = await mutation.mutateAsync(values);
      await minDelay;
      
      setUserData(res.data.user as UserProfileDTO);
      setAnimState('success');
      
      // Complete exactly 3000ms total (600 + 2400)
      setTimeout(() => {
        loginAction(res.data.user, res.data.token);
        onSuccess?.();
      }, 2400);
      
    } catch {
      // Bound by onError above
    }
  };

  return {
    onFinish,
    isPending: mutation.isPending,
    animState,
    userData
  };
};
