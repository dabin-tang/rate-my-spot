import { useState, useEffect, useCallback } from 'react';
import { getSpotList } from '../../api/getSpotList';
import { deleteSpot } from '../../api/deleteSpot';
import type { AdminSpotQueryDTO, PageResult } from '../../types';
import type { SpotResponse } from '../../../spots/types';

export const useAdminSpotList = () => {
  const [data, setData] = useState<PageResult<SpotResponse> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [queryParams, setQueryParams] = useState<AdminSpotQueryDTO>({
    page: 1,
    size: 10,
    categoryId: undefined,
    keyword: undefined
  });

  const fetchSpots = useCallback(async (params: AdminSpotQueryDTO) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const result = await getSpotList(params);
      setData(result.data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message || 'Failed to fetch spots list');
      } else {
        setErrorMsg('Failed to fetch spots list');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSpots(queryParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams.page, queryParams.categoryId, queryParams.keyword]);

  const handlePageChange = (newPage: number) => {
    if (data && newPage >= 1 && newPage <= data.totalPages) {
      setQueryParams(prev => ({ ...prev, page: newPage }));
    }
  };

  const handleFilterCategory = (categoryId?: number) => {
    setQueryParams(prev => ({ ...prev, page: 1, categoryId }));
  };

  const handleFilterKeyword = (keyword?: string) => {
    setQueryParams(prev => ({ ...prev, page: 1, keyword: keyword || undefined }));
  };

  const refreshSpots = () => {
    fetchSpots(queryParams);
  };

  const deleteSpotById = async (id: number) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      await deleteSpot(id);
      refreshSpots(); // Reload data silently on success
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message || 'Failed to delete spot');
      } else {
        setErrorMsg('Failed to delete spot');
      }
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    errorMsg,
    queryParams,
    handlePageChange,
    handleFilterCategory,
    handleFilterKeyword,
    refreshSpots,
    deleteSpotById
  };
};
