import request from '../../../shared/api/axios';
import type { Result } from '../../../shared/api/axios';

export const deleteAdminPost = async (id: number): Promise<Result<string>> => {
  return request.delete<Result<string>, Result<string>>(`/api/admin/post/${id}`);
};
