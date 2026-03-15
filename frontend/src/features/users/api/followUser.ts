import request, { type Result } from '../../../shared/api/axios';

export const followUser = (targetUserId: number): Promise<Result<null>> => {
  return request.post(`/api/follow/toggle?targetUserId=${targetUserId}`);
};
