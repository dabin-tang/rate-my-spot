import { useState, useEffect, useCallback } from 'react';
import { getUserList } from '../../api/getUserList';
import { updateUserStatus } from '../../api/updateUserStatus';
import type { AdminUserQueryDTO, AdminUserResponse, PageResult } from '../../types';

export const useAdminUserList = () => {
  const [data, setData] = useState<PageResult<AdminUserResponse> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [queryParams, setQueryParams] = useState<AdminUserQueryDTO>({
    page: 1,
    size: 10,
    nickname: '',
    email: ''
  });

  const fetchUsers = useCallback(async (params: AdminUserQueryDTO) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const result = await getUserList(params);
      setData(result.data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message || 'Failed to fetch user list');
      } else {
        setErrorMsg('Failed to fetch user list');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Only fetch automatically when page changes (not search value changes)
    fetchUsers(queryParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams.page]); 

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedParams = { ...queryParams, page: 1 };
    setQueryParams(updatedParams);
    fetchUsers(updatedParams); // Trigger immediately using explicit param clone
  };

  const handlePageChange = (newPage: number) => {
    if (data && newPage >= 1 && newPage <= data.totalPages) {
      setQueryParams(prev => ({ ...prev, page: newPage }));
    }
  };

  const toggleUserStatus = async (userId: number, currentStatus: number) => {
    const newStatus = currentStatus === 0 ? 1 : 0;
    
    // Optimistic Update
    setData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        list: prev.list.map(u => u.id === userId ? { ...u, status: newStatus } : u)
      };
    });

    try {
      await updateUserStatus(userId, newStatus);
    } catch (err: unknown) {
      console.error('Failed to update status', err);
      // Rollback
      setData(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          list: prev.list.map(u => u.id === userId ? { ...u, status: currentStatus } : u)
        };
      });
    }
  };

  return {
    data,
    loading,
    errorMsg,
    queryParams,
    setQueryParams,
    handleSearch,
    handlePageChange,
    toggleUserStatus
  };
};
