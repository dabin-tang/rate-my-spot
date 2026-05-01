import { useState, useEffect, useCallback } from 'react';
import { getAdminCommentList } from '../../api/getAdminCommentList';
import { deleteAdminComment } from '../../api/deleteAdminComment';
import type { AdminCommentQueryDTO, AdminCommentResponse, PageResult } from '../../types';

export const useAdminCommentList = () => {
  const [data, setData] = useState<PageResult<AdminCommentResponse> | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [queryParams, setQueryParams] = useState<AdminCommentQueryDTO>({
    page: 1,
    size: 10
  });

  const fetchComments = useCallback(async (params: AdminCommentQueryDTO) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const response = await getAdminCommentList(params);
      if (response && response.data) {
        setData(response.data);
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message || 'Failed to fetch comments');
      } else {
        setErrorMsg('Failed to fetch comments');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Re-fetch only when specific array parameters structurally trigger
    fetchComments(queryParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams.page, queryParams.postId, queryParams.keyword]);

  const handlePageChange = (newPage: number) => {
    if (data && newPage >= 1 && newPage <= data.totalPages) {
      setQueryParams(prev => ({ ...prev, page: newPage }));
    }
  };

  const handleFilter = (postId?: number, keyword?: string) => {
    setQueryParams(prev => ({ ...prev, page: 1, postId, keyword }));
  };

  const refreshComments = () => {
    fetchComments(queryParams);
  };

  const deleteCommentById = async (id: number) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      await deleteAdminComment(id);
      refreshComments(); // Fast cycle reload without exposing unmounted promises
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message || 'Failed to delete comment');
      } else {
        setErrorMsg('Failed to delete comment');
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
    refreshComments,
    deleteCommentById
  };
};
