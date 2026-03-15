import { useState, useEffect } from 'react';
import { getSpotById } from '../../api/getSpotById';
import { getSpotPosts } from '../../../posts/api/getSpotPosts';
import type { SpotResponse } from '../../types';
import type { PostResponse } from '../../../posts/types';

export const useSpotDetail = (spotId: number | null) => {
  const [spot, setSpot] = useState<SpotResponse | null>(null);
  const [recentPosts, setRecentPosts] = useState<PostResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchDetailData = async () => {
      if (!spotId) {
        setSpot(null);
        setRecentPosts([]);
        return;
      }

      setIsLoading(true);
      setError(null);
      
      try {
        const [spotRes, postsRes] = await Promise.all([
          getSpotById(spotId),
          getSpotPosts(spotId)
        ]);
        
        if (isMounted) {
          setSpot(spotRes.data || null);
          setRecentPosts(postsRes.data || []);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Failed to fetch spot details:', err);
          setError(err instanceof Error ? err : new Error('Unknown error'));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchDetailData();

    return () => {
      isMounted = false;
    };
  }, [spotId]);

  return {
    spot,
    recentPosts,
    isLoading,
    error
  };
};
