import request from '../../../shared/api/axios';
import type { Result } from '../../../shared/api/axios';
import type { SpotCategoryUpdateDTO, AdminCategoryResponse } from '../types';

export const updateCategory = async (id: number, data: SpotCategoryUpdateDTO): Promise<Result<AdminCategoryResponse>> => {
  return request.put<Result<AdminCategoryResponse>, Result<AdminCategoryResponse>>(`/api/admin/spot-category/${id}`, data);
};
