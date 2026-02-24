import React from 'react';
import { Flex, Skeleton } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { getSpotCategories } from '../api/getSpotCategories';

const getCategoryColor = (name: string) => {
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

interface CategoryFilterProps {
  value?: number;
  onChange: (categoryId?: number) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({ value, onChange }) => {
  const { data, isLoading } = useQuery({
    queryKey: ['spotCategories'],
    queryFn: getSpotCategories,
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <Flex gap={12} style={{ padding: '16px 24px', overflowX: 'auto' }}>
        <Skeleton.Button active shape="round" style={{ width: 100, height: 38 }} />
        <Skeleton.Button active shape="round" style={{ width: 120, height: 38 }} />
        <Skeleton.Button active shape="round" style={{ width: 110, height: 38 }} />
      </Flex>
    );
  }

  const categories = data?.data || [];

  return (
    <>
      <style>
        {`
          @keyframes iconPop {
            0% { transform: scale(1); filter: drop-shadow(0 0 0 rgba(0,0,0,0)); }
            40% { transform: scale(1.2) translateY(-2px); filter: drop-shadow(0 4px 8px rgba(0,0,0,0.1)); }
            70% { transform: scale(1.1) translateY(0); filter: drop-shadow(0 2px 4px rgba(0,0,0,0.05)); }
            100% { transform: scale(1.15) translateY(-1px); filter: drop-shadow(0 3px 6px rgba(0,0,0,0.08)); }
          }
          .cat-container {
            padding: 8px 0;
            width: 100%;
            display: flex;
            align-items: center;
            gap: 4px;
            flex-wrap: nowrap;
            overflow-x: auto;
            overflow-y: hidden;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          .cat-container::-webkit-scrollbar {
            display: none;
          }
          .cat-item {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2px 8px;
            border-radius: 20px;
            cursor: pointer;
            white-space: nowrap;
            font-size: 12px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            user-select: none;
          }
          .cat-inactive {
            background: transparent;
            color: #666;
            font-weight: 500;
          }
          .cat-inactive:hover {
            background: #f0f2f5;
            color: #111;
          }
          .cat-inactive .cat-icon {
            background-color: #666; /* Keep original color but not active */
          }
          .cat-inactive:hover .cat-icon {
            background-color: #111;
          }
          .cat-active {
            background: #f5f5f5;
            color: #000;
            font-weight: 700;
          }
          .cat-active:active {
            transform: translateY(0);
          }
          .cat-active .cat-icon {
            background-color: #000; /* Active uses high contrast color */
            animation: iconPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          }
          .cat-icon {
            width: 14px;
            height: 14px;
            margin-left: 4px;
            display: inline-block;
            transition: background-color 0.3s ease;
          }
        `}
      </style>
      <div className="cat-container">
        <div
          className={`cat-item ${!value ? 'cat-active' : 'cat-inactive'}`}
          onClick={() => onChange(undefined)}
        >
          Recommend
        </div>

        {categories.map((category) => (
          <div
            key={category.id}
            className={`cat-item ${value === category.id ? 'cat-active' : 'cat-inactive'}`}
            onClick={() => onChange(category.id)}
          >
            {category.name}
            {category.icon && (
              <span
                className="cat-icon"
                style={{
                  ...((value === category.id) ? { backgroundColor: getCategoryColor(category.name) } : {}),
                  maskImage: `url(${category.icon})`,
                  maskSize: 'contain',
                  maskRepeat: 'no-repeat',
                  maskPosition: 'center',
                  WebkitMaskImage: `url(${category.icon})`,
                  WebkitMaskSize: 'contain',
                  WebkitMaskRepeat: 'no-repeat',
                  WebkitMaskPosition: 'center',
                }}
              />
            )}
          </div>
        ))}
      </div>
    </>
  );
};
