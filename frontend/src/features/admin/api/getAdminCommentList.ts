import request from '../../../shared/api/axios';
import type { Result } from '../../../shared/api/axios';
import type { AdminCommentQueryDTO, AdminCommentResponse, PageResult } from '../types';

export const getAdminCommentList = async (params: AdminCommentQueryDTO): Promise<Result<PageResult<AdminCommentResponse>>> => {
  return request.get<Result<PageResult<AdminCommentResponse>>, Result<PageResult<AdminCommentResponse>>>('/api/admin/post-comment/list', { params });
};
