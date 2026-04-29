import { useState, useEffect, useCallback } from 'react';
import { getCategoryList } from '../../api/getCategoryList';
import type { AdminCategoryResponse } from '../../types';

export const useAdminCategoryList = () => {
  const [data, setData] = useState<AdminCategoryResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const response = await getCategoryList();
      if (response && response.data) {
        setData(response.data);
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message || 'Failed to fetch categories');
      } else {
        setErrorMsg('Failed to fetch categories');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    data,
    loading,
    errorMsg,
    refreshCategories: fetchCategories
  };
};
