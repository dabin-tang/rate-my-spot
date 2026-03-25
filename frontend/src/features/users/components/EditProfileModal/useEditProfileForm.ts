import { useState } from 'react';
import { Form, message } from 'antd';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../../auth/stores/useAuthStore';
import { updateUserProfile } from '../../api/updateUserProfile';
import { uploadFile } from '@/shared/api/upload';
import type { UserProfileDTO, UserUpdateDTO } from '../../types';

export const useEditProfileForm = (onSuccess: () => void) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string>('');

  const initForm = (profile: UserProfileDTO) => {
    form.setFieldsValue({
      nickname: profile.nickname,
      gender: profile.gender,
      city: profile.city,
      intro: profile.intro,
    });
    setAvatarPreviewUrl(profile.icon || '');
    setAvatarFile(null);
  };

  const clearForm = () => {
    form.resetFields();
    setAvatarPreviewUrl('');
    setAvatarFile(null);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (values: UserUpdateDTO) => {
    try {
      setIsSubmitting(true);
      let newIconUrl = avatarPreviewUrl;

      if (avatarFile) {
        const uploadRes = await uploadFile(avatarFile);
        if (uploadRes.success && uploadRes.data) {
          newIconUrl = uploadRes.data;
        } else {
          message.error('Avatar upload failed');
          setIsSubmitting(false);
          return;
        }
      }

      const updateData: UserUpdateDTO = {
        nickname: values.nickname,
        gender: values.gender,
        city: values.city,
        intro: values.intro,
        icon: newIconUrl,
      };

      const res = await updateUserProfile(updateData);
      
      if (res.success) {
        message.success('Profile updated successfully');
        
        // Update local auth store so layout header stays synced
        useAuthStore.getState().updateUser({
          nickname: updateData.nickname,
          gender: updateData.gender,
          intro: updateData.intro,
          icon: updateData.icon,
        });

        // Optimistically update profile cache so UI updates instantly without waiting for refetch
        queryClient.setQueryData(['currentUserProfile', useAuthStore.getState().user?.id], (oldData: UserProfileDTO | undefined) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            ...updateData,
          };
        });

        // Invalidate profile query to ensure it eventually syncs perfectly with server
        queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
        onSuccess();
      } else {
        message.error(res.errorMsg || 'Failed to update profile');
      }
    } catch (error) {
      console.error(error);
      message.error('Network or server error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    initForm,
    clearForm,
    handleSubmit,
    avatarPreviewUrl,
    handleAvatarChange
  };
};
