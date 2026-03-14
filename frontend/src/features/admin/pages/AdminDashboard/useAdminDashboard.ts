import { useState } from 'react';

export const useAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return {
    activeTab,
    setActiveTab,
    stats: {
      users: 0,
      posts: 0,
      reports: 0
    }
  };
};
