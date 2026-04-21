import request from '../../../shared/api/axios';
import type { Result } from '../../../shared/api/axios';
import type { AdminLoginRequest } from '../types';

interface AdminLoginResData {
  token: string;
  id: number;
  username: string;
  role: string | number;
}

export const adminLogin = async (data: AdminLoginRequest): Promise<Result<AdminLoginResData>> => {
  return request.post<Result<AdminLoginResData>, Result<AdminLoginResData>>('/api/admin/login', data);
};
