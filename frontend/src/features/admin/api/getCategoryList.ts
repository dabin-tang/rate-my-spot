import request from '../../../shared/api/axios';
import type { Result } from '../../../shared/api/axios';
import type { AdminCategoryResponse } from '../types';

export const getCategoryList = async (): Promise<Result<AdminCategoryResponse[]>> => {
  return request.get<Result<AdminCategoryResponse[]>, Result<AdminCategoryResponse[]>>('/api/admin/spot-category/list');
};
