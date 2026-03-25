import { useQuery } from '@tanstack/react-query';
import { getUserProfile } from '../api/getUserProfile';
import { useAuthStore } from '../../auth/stores/useAuthStore';

export const useCurrentUserProfile = () => {
  const { user, token } = useAuthStore();
  const isLoggedIn = !!token && !!user;

  return useQuery({
    queryKey: ['currentUserProfile', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error("User ID is required");
      // Fetch full profile stats from the correctly mapped server endpoint
      const response = await getUserProfile(user.id);
      return response.data;
    },
    enabled: isLoggedIn && !!user?.id, // Only run the query if the user is logged in

    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};
