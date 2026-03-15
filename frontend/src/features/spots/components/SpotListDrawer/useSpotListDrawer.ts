import { useState, useEffect, useCallback } from 'react';
import { getSpotCategories } from '../../api/getSpotCategories';
import { getSpots } from '../../api/getSpots';
import type { SpotCategory, SpotResponse, SpotPageReq } from '../../types';

// Assuming we have user location from elsewhere, or mocking it for now
// In a real app, you might use navigator.geolocation
const MOCK_LATITUDE = 40.7128;
const MOCK_LONGITUDE = -74.0060;

export const useSpotListDrawer = (isOpen: boolean) => {
  const [categories, setCategories] = useState<SpotCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<SpotCategory | null>(null);
  
  const [spots, setSpots] = useState<SpotResponse[]>([]);
  const [isSpotsLoading, setIsSpotsLoading] = useState(false);
  const [sortMethod, setSortMethod] = useState<'distance' | 'score'>('score');

  // Fetch categories when drawer opens
  useEffect(() => {
    const fetchCategories = async () => {
      if (isOpen && categories.length === 0) {
        try {
          const res = await getSpotCategories();
          // The axios interceptor handles 'data', but our mocked type might be returning directly
          // We assume res.data is the list of categories based on previous Result structure
          setCategories(res.data || []);
        } catch (error) {
          console.error('Failed to fetch categories:', error);
        }
      }
    };
    fetchCategories();
  }, [isOpen, categories.length]);

  // Fetch spots when category or sort changes
  useEffect(() => {
    const fetchSpots = async () => {
      if (!selectedCategory) return;
      
      setIsSpotsLoading(true);
      try {
        const params: SpotPageReq = {
          categoryId: selectedCategory.id,
          sort: sortMethod,
          latitude: MOCK_LATITUDE,
          longitude: MOCK_LONGITUDE,
          page: 1, // Reset to page 1 for now, implement pagination later if needed
        };
        const res = await getSpots(params);
        setSpots(res.data?.list || []);
      } catch (error) {
        console.error('Failed to fetch spots:', error);
      } finally {
        setIsSpotsLoading(false);
      }
    };

    fetchSpots();
  }, [selectedCategory, sortMethod]);

  const handleCategorySelect = useCallback((category: SpotCategory) => {
    setSelectedCategory(category);
  }, []);

  const handleBackToCategories = useCallback(() => {
    setSelectedCategory(null);
    setSpots([]);
  }, []);

  const handleSortChange = useCallback((method: 'distance' | 'score') => {
    setSortMethod(method);
  }, []);

  return {
    categories,
    selectedCategory,
    spots,
    isSpotsLoading,
    sortMethod,
    handleCategorySelect,
    handleBackToCategories,
    handleSortChange,
  };
};
