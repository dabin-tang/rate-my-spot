import { useQuery } from '@tanstack/react-query';
import { getUserProfile } from '../api/getUserProfile';
import { useAuthStore } from '../../auth/stores/useAuthStore';

export const useCurrentUserProfile = () => {
  const { user, token } = useAuthStore();
  const isLoggedIn = !!token && !!user;

  return useQuery({
    queryKey: ['currentUserProfile', user?.id],
    queryFn: async () => {
      // Fetch latest profile stats from the server
      const response = await getUserProfile();
      return response.data;
    },
    enabled: isLoggedIn, // Only run the query if the user is logged in
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};
