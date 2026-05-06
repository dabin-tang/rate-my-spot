import { useState, useEffect, useCallback } from 'react';
import { getAdminPostList } from '../../api/getAdminPostList';
import { deleteAdminPost } from '../../api/deleteAdminPost';
import type { AdminPostQueryDTO, PageResult } from '../../types';
import type { PostResponse } from '../../../posts/types';

export const useAdminPostList = () => {
  const [data, setData] = useState<PageResult<PostResponse> | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [queryParams, setQueryParams] = useState<AdminPostQueryDTO>({
    page: 1,
    size: 10,
    keyword: undefined
  });

  const fetchPosts = useCallback(async (params: AdminPostQueryDTO) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const response = await getAdminPostList(params);
      if (response && response.data) {
        setData(response.data);
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message || 'Failed to fetch posts');
      } else {
        setErrorMsg('Failed to fetch posts');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // We intentionally fetch when page changes.
    fetchPosts(queryParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams.page, queryParams.keyword]);

  const handlePageChange = (newPage: number) => {
    if (data && newPage >= 1 && newPage <= data.totalPages) {
      setQueryParams(prev => ({ ...prev, page: newPage }));
    }
  };

  const handleFilterKeyword = (keyword?: string) => {
    setQueryParams(prev => ({ ...prev, page: 1, keyword: keyword || undefined }));
  };

  const refreshPosts = () => {
    fetchPosts(queryParams);
  };

  const deletePostById = async (id: number) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      await deleteAdminPost(id);
      refreshPosts(); // Reload data cleanly
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message || 'Failed to delete post');
      } else {
        setErrorMsg('Failed to delete post');
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
    handleFilterKeyword,
    refreshPosts,
    deletePostById
  };
};
