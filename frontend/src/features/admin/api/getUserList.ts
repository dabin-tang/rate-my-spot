import request from '../../../shared/api/axios';
import type { Result } from '../../../shared/api/axios';
import type { AdminUserQueryDTO, AdminUserResponse, PageResult } from '../types';

export const getUserList = async (params: AdminUserQueryDTO): Promise<Result<PageResult<AdminUserResponse>>> => {
  return request.get<Result<PageResult<AdminUserResponse>>, Result<PageResult<AdminUserResponse>>>('/api/admin/user/list', { params });
};
