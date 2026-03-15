import React, { useState } from 'react';
import { CloseOutlined, LeftOutlined, EnvironmentOutlined, StarFilled } from '@ant-design/icons';
import { useSpotListDrawer } from './useSpotListDrawer';
import styles from './SpotListDrawer.module.scss';

interface SpotListDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSpotSelect?: (spotId: number) => void;
}

export const SpotListDrawer: React.FC<SpotListDrawerProps> = ({ isOpen, onClose, onSpotSelect }) => {
  const [isRendered, setIsRendered] = useState(isOpen);

  if (isOpen && !isRendered) {
    setIsRendered(true);
  }

  const onAnimationEnd = () => {
    if (!isOpen) setIsRendered(false);
  };

  const {
    categories,
    selectedCategory,
    spots,
    isSpotsLoading,
    sortMethod,
    handleCategorySelect,
    handleBackToCategories,
    handleSortChange,
  } = useSpotListDrawer(isOpen);

  if (!isRendered) return null;

  return (
    <div 
      className={`${styles.drawerContainer} ${isOpen ? styles.open : styles.close}`} 
      onAnimationEnd={onAnimationEnd}
    >
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          {selectedCategory ? (
            <button className={styles.backButton} onClick={handleBackToCategories}>
              <LeftOutlined style={{ fontSize: '14px', marginRight: '8px' }} />
              Back to Categories
            </button>
          ) : (
            <h2 className={styles.title}>Spot Categories</h2>
          )}
        </div>
        <button className={styles.closeButton} onClick={onClose} aria-label="Close drawer">
          <CloseOutlined />
        </button>
      </div>

      <div className={styles.content}>
        {!selectedCategory ? (
          <ul className={styles.categoryList}>
            {categories.map((category) => (
              <li 
                key={category.id} 
                className={styles.categoryItem}
                onClick={() => handleCategorySelect(category)}
              >
                <div className={styles.categoryInfo}>
                  <span className={styles.categoryName}>{category.name}</span>
                  {category.icon && <span className={styles.categoryIcon}>{category.icon}</span>}
                </div>
                <LeftOutlined style={{ transform: 'rotate(180deg)', fontSize: '12px', color: '#999' }} />
              </li>
            ))}
          </ul>
        ) : (
          <div className={styles.spotListContainer}>
            <div className={styles.spotListHeader}>
              <h3 className={styles.categoryTitle}>{selectedCategory.name}</h3>
              <div className={styles.sortControls}>
                <span className={styles.sortLabel}>Sort by:</span>
                <select 
                  className={styles.sortSelect} 
                  value={sortMethod}
                  onChange={(e) => handleSortChange(e.target.value as 'distance' | 'score')}
                >
                  <option value="score">Score</option>
                  <option value="distance">Distance</option>
                </select>
              </div>
            </div>

            {isSpotsLoading ? (
              <div className={styles.loadingState}>Loading spots...</div>
            ) : spots.length > 0 ? (
              <ul className={styles.spotList}>
                {spots.map((spot) => (
                  <li 
                    key={spot.id} 
                    className={styles.spotItem}
                    onClick={() => onSpotSelect?.(spot.id)}
                  >
                    <div className={styles.spotTitleRow}>
                      <span className={styles.spotName}>{spot.name}</span>
                      <div className={styles.spotScore}>
                        <StarFilled style={{ color: '#fa8c16', marginRight: '4px' }} />
                        {spot.score.toFixed(1)}
                      </div>
                    </div>
                    <div className={styles.spotMetaRow}>
                      <span className={styles.spotDistance}>1.2 mi</span>
                      <span className={styles.spotAddress}>
                         <EnvironmentOutlined style={{ marginRight: '4px'}} />
                         {spot.address}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className={styles.emptyState}>No spots found in this category.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
