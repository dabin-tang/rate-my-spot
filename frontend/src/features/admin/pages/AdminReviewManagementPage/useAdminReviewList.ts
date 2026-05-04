import { useState, useEffect, useCallback } from 'react';
import { getAdminReviewList } from '../../api/getAdminReviewList';
import { deleteAdminReview } from '../../api/deleteAdminReview';
import type { AdminReviewQueryDTO, SpotReviewResponse, PageResult } from '../../types';

export const useAdminReviewList = () => {
  const [data, setData] = useState<PageResult<SpotReviewResponse> | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [queryParams, setQueryParams] = useState<AdminReviewQueryDTO>({
    page: 1,
    size: 10
  });

  const fetchReviews = useCallback(async (params: AdminReviewQueryDTO) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const response = await getAdminReviewList(params);
      if (response && response.data) {
        setData(response.data);
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message || 'Failed to fetch reviews');
      } else {
        setErrorMsg('Failed to fetch reviews');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews(queryParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams.page, queryParams.spotReviewId]);

  const handlePageChange = (newPage: number) => {
    if (data && newPage >= 1 && newPage <= data.totalPages) {
      setQueryParams(prev => ({ ...prev, page: newPage }));
    }
  };

  const handleFilter = (spotReviewId?: number) => {
    setQueryParams(prev => ({ ...prev, page: 1, spotReviewId }));
  };

  const refreshReviews = () => {
    fetchReviews(queryParams);
  };

  const deleteReviewById = async (id: number) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      await deleteAdminReview(id);
      refreshReviews();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message || 'Failed to delete review');
      } else {
        setErrorMsg('Failed to delete review');
      }
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    errorMsg,
    handlePageChange,
    handleFilter,
    refreshReviews,
    deleteReviewById
  };
};
