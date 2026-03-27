import { useState, useEffect, useRef } from 'react';
import { searchPosts } from '../../../features/posts/api/searchPosts';
import type { PostResponse } from '../../../features/posts/types';
import { useUIStore } from '../../stores/useUIStore';

export const useGlobalSearch = () => {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState<PostResponse[]>([]);
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
        const response = await searchPosts(keyword.trim());
        // The cast in searchPosts api defines this is returning Result<PostResponse[]>
        setResults(response.data || []);
      } catch (error) {
        console.error('Failed to search posts:', error);
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

  const handleResultClick = (postId: number) => {
    setIsDropdownVisible(false);
    setKeyword('');
    const { setSelectedPostId } = useUIStore.getState();
    setSelectedPostId(postId);
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
