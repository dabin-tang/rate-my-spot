import { useState, useEffect, useCallback } from 'react';
import { useCategoryFilter } from '../CategoryFilter/useCategoryFilter';
import { getSpots } from '../../api/getSpots';
import type { SpotCategory, SpotResponse, SpotPageReq } from '../../types';
import { useLocationStore } from '../../../../shared/stores/useLocationStore';

export const useSpotListDrawer = () => {
  const { categories } = useCategoryFilter();
  const [selectedCategory, setSelectedCategory] = useState<SpotCategory | null>(null);
  
  const { latitude, longitude, fetchLocation } = useLocationStore();

  // Try fetching location when this hook mounts
  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);
  
  const [spots, setSpots] = useState<SpotResponse[]>([]);
  const [isSpotsLoading, setIsSpotsLoading] = useState(false);
  const [sortMethod, setSortMethod] = useState<'distance' | 'score'>('score');
  
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [debouncedKeyword, setDebouncedKeyword] = useState('');

  // Debounce keyword
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keyword);
    }, 400);
    return () => clearTimeout(timer);
  }, [keyword]);

  // Reset page when sorting or debounced keyword changes
  useEffect(() => {
    setPage(1);
  }, [sortMethod, debouncedKeyword]);

  // Fetch spots when category, sort, or page changes
  useEffect(() => {
    const fetchSpots = async () => {
      if (!selectedCategory || latitude === null || longitude === null) return;
      
      setIsSpotsLoading(true);
      try {
        const params: SpotPageReq = {
          categoryId: selectedCategory.id,
          sort: sortMethod,
          latitude: latitude,
          longitude: longitude,
          page: page,
          keyword: debouncedKeyword.trim() || undefined,
        };
        const res = await getSpots(params);
        
        const newSpots = res.data?.list || [];
        const total = res.data?.total || 0;
        
        if (page === 1) {
          setSpots(newSpots);
        } else {
          setSpots(prev => [...prev, ...newSpots]);
        }
        
        setHasMore((page * 10) < total); // assuming size=10 default
      } catch (error) {
        console.error('Failed to fetch spots:', error);
      } finally {
        setIsSpotsLoading(false);
      }
    };

    fetchSpots();
  }, [selectedCategory, sortMethod, page, debouncedKeyword, latitude, longitude]);

  const loadMore = useCallback(() => {
    if (!isSpotsLoading && hasMore) {
      setPage(prev => prev + 1);
    }
  }, [isSpotsLoading, hasMore]);

  const handleCategorySelect = useCallback((category: SpotCategory) => {
    setSelectedCategory(category);
  }, []);

  const handleBackToCategories = useCallback(() => {
    setSelectedCategory(null);
    setSpots([]);
    setPage(1);
  }, []);

  const handleSortChange = useCallback((method: 'distance' | 'score') => {
    setSortMethod(method);
    // page 1 reset handled by useEffect
  }, []);

  return {
    categories,
    selectedCategory,
    spots,
    isSpotsLoading,
    sortMethod,
    hasMore,
    loadMore,
    handleCategorySelect,
    handleBackToCategories,
    handleSortChange,
    keyword,
    setKeyword,
  };
};
