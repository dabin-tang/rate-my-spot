import request from '../../../shared/api/axios';
import type { Result } from '../../../shared/api/axios';
import type { AdminPostQueryDTO, PageResult } from '../types';
import type { PostResponse } from '../../posts/types';

export const getAdminPostList = async (params: AdminPostQueryDTO): Promise<Result<PageResult<PostResponse>>> => {
  return request.get<Result<PageResult<PostResponse>>, Result<PageResult<PostResponse>>>('/api/admin/post/list', { params });
};
