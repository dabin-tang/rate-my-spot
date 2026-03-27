import request, { type Result } from '@/shared/api/axios';

export const setLikesPrivacy = (isPrivate: boolean): Promise<Result<null>> => {
  return request.put('/api/post-like/privacy', null, { params: { isPrivate } });
};

export const updatePassword = (newPassword: string, code: string): Promise<Result<null>> => {
  return request.put('/api/user/update-password', null, { params: { newPassword, code } });
};
