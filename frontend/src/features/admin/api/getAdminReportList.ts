import request from '../../../shared/api/axios';
import type { Result } from '../../../shared/api/axios';
import type { AdminReportQueryDTO, ReportResponse, PageResult } from '../types';

export const getAdminReportList = async (params: AdminReportQueryDTO): Promise<Result<PageResult<ReportResponse>>> => {
  return request.get<Result<PageResult<ReportResponse>>, Result<PageResult<ReportResponse>>>('/api/admin/report/list', { params });
};
