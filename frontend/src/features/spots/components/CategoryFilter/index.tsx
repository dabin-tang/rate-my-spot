import React from 'react';
import { Flex, Skeleton } from 'antd';
import { useCategoryFilter, getCategoryColor } from './useCategoryFilter';
import styles from './CategoryFilter.module.scss';
import type { SpotCategory } from '../../types';

interface CategoryFilterProps {
  value?: number;
  onChange: (categoryId?: number) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({ value, onChange }) => {
  const { categories, isLoading } = useCategoryFilter();

  if (isLoading) {
    return (
      <Flex gap={12} style={{ padding: '16px 24px', overflowX: 'auto' }}>
        <Skeleton.Button active shape="round" style={{ width: 100, height: 38 }} />
        <Skeleton.Button active shape="round" style={{ width: 120, height: 38 }} />
        <Skeleton.Button active shape="round" style={{ width: 110, height: 38 }} />
      </Flex>
    );
  }

  return (
    <div className={styles.container}>
      <div
        className={`${styles.item} ${!value ? styles.active : styles.inactive}`}
        onClick={() => onChange(undefined)}
      >
        Recommend
      </div>

      {categories.map((category: SpotCategory) => (
        <div
          key={category.id}
          className={`${styles.item} ${value === category.id ? styles.active : styles.inactive}`}
          onClick={() => onChange(category.id)}
        >
          {category.name}
          {category.icon && (
            <span
              className={styles.icon}
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
  );
};
