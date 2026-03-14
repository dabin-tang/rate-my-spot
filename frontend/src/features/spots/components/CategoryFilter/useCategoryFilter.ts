import { useQuery } from '@tanstack/react-query';
import { getSpotCategories } from '../../api/getSpotCategories';
import type { SpotCategory } from '../../types';

export const getCategoryColor = (name: string) => {
  const colorMap: Record<string, string> = {
    'Study & Grind': '#c2884a',
    'Chill & Vibe': '#6366f1',
    'Restaurant': '#f43f5e',
    'Photo Ops': '#ec4899',
    'Nightlife': '#8b5cf6',
    'Fun & Play': '#f97316',
    'Nature & Zen': '#10b981',
    'Hidden Gem': '#0ea5e9',
    'Clean Restroom': '#06b6d4',
  };
  return colorMap[name] || '#666'; // fallback to gray
};

export const useCategoryFilter = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['spotCategories'],
    queryFn: getSpotCategories,
    staleTime: 5 * 60 * 1000,
  });

  const categories: SpotCategory[] = (data as any)?.data || [];

  return {
    categories,
    isLoading
  };
};
