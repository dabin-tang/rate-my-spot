import request from '../../../shared/api/axios';
import type { Result } from '../../../shared/api/axios';

export const adminLogout = async (): Promise<Result<string>> => {
  return request.post<Result<string>, Result<string>>('/api/admin/logout');
};
