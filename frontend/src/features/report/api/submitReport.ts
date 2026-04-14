import request, { type Result } from '@/shared/api/axios';
import type { ReportCreateDTO } from '../types';

export const submitReport = (data: ReportCreateDTO): Promise<Result<string>> => {
  return request.post('/api/report', data);
};
