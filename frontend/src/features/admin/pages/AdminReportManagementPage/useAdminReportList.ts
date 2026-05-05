import { useState, useEffect, useCallback } from 'react';
import { getAdminReportList } from '../../api/getAdminReportList';
import { resolveAdminReport } from '../../api/resolveAdminReport';
import type { AdminReportQueryDTO, ReportResponse, PageResult, ResolveReportDTO } from '../../types';

export const useAdminReportList = () => {
  const [data, setData] = useState<PageResult<ReportResponse> | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [queryParams, setQueryParams] = useState<AdminReportQueryDTO>({
    page: 1,
    size: 10
  });

  const fetchReports = useCallback(async (params: AdminReportQueryDTO) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const response = await getAdminReportList(params);
      if (response && response.data) {
        setData(response.data);
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message || 'Failed to fetch reports');
      } else {
        setErrorMsg('Failed to fetch reports');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports(queryParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams.page, queryParams.status]);

  const handlePageChange = (newPage: number) => {
    if (data && newPage >= 1 && newPage <= data.totalPages) {
      setQueryParams(prev => ({ ...prev, page: newPage }));
    }
  };

  const handleFilterStatus = (status?: number) => {
    setQueryParams(prev => ({ ...prev, page: 1, status }));
  };

  const refreshReports = () => {
    fetchReports(queryParams);
  };

  const resolveReportById = async (id: number, payload: ResolveReportDTO) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      await resolveAdminReport(id, payload);
      refreshReports();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message || 'Failed to process report');
      } else {
        setErrorMsg('Failed to process report');
      }
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    errorMsg,
    handlePageChange,
    handleFilterStatus,
    refreshReports,
    resolveReportById,
    queryParams
  };
};
