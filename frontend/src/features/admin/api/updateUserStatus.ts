import request from '../../../shared/api/axios';
import type { Result } from '../../../shared/api/axios';

export const updateUserStatus = async (id: number, status: number): Promise<Result<string>> => {
  return request.put<Result<string>, Result<string>>(`/api/admin/user/${id}/status`, null, {
    params: { status }
  });
};
