import { useState, useEffect } from 'react';
import { getStats } from '../../api/getStats';
import type { AdminStatsResponse } from '../../types';

export const useAdminDashboard = () => {
  const [stats, setStats] = useState<AdminStatsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const result = await getStats();
      setStats(result.data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message || 'Failed to fetch statistics');
      } else {
        setErrorMsg('Failed to fetch statistics');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    errorMsg,
    refetch: fetchStats
  };
};
