import request, { type Result } from '../../../shared/api/axios';

export const followUser = (followUserId: number, isFollow: boolean): Promise<Result<null>> => {
  return request.put(`/api/follow/${followUserId}/${isFollow}`);
};
