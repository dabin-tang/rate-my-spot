import { useQuery } from '@tanstack/react-query';
import { getUserProfile } from '../api/getUserProfile';

export const useUserProfile = (userId?: number) => {
  return useQuery({
    queryKey: ['userProfile', userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID is required");
      const response = await getUserProfile(userId);
      return response.data;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};
