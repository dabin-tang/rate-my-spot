import { useState, useEffect, useRef } from 'react';
import { searchSpots } from '../../../features/spots/api/searchSpots';
import type { SpotResponse } from '../../../features/spots/types';
import { useUIStore } from '../../stores/useUIStore';

export const useGlobalSearch = () => {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState<SpotResponse[]>([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!keyword.trim()) {
        setResults([]);
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      try {
        const response = await searchSpots(keyword.trim());
        // The cast in searchSpots api defines this is returning Result<SpotResponse[]>
        setResults(response.data || []);
      } catch (error) {
        console.error('Failed to search spots:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [keyword]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
    setIsDropdownVisible(true);
    setIsLoading(true);
  };

  const handleFocus = () => {
    if (keyword.trim()) {
      setIsDropdownVisible(true);
    }
  };

  const handleResultClick = (spotId: number) => {
    setIsDropdownVisible(false);
    setKeyword('');
    const { setDrawerOpen, setSelectedSpotId } = useUIStore.getState();
    setDrawerOpen(true);
    setSelectedSpotId(spotId);
  };

  return {
    keyword,
    results,
    isDropdownVisible,
    isLoading,
    dropdownRef,
    handleInputChange,
    handleFocus,
    handleResultClick
  };
};
