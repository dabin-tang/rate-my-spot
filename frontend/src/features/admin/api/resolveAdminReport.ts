import request from '../../../shared/api/axios';
import type { Result } from '../../../shared/api/axios';
import type { ResolveReportDTO } from '../types';

export const resolveAdminReport = async (id: number, data: ResolveReportDTO): Promise<Result<string>> => {
  return request.put<Result<string>, Result<string>>(`/api/admin/report/${id}/resolve`, data);
};
