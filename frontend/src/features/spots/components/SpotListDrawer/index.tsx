import React, { useState } from 'react';
import { CloseOutlined, LeftOutlined } from '@ant-design/icons';
import { useSpotListDrawer } from './useSpotListDrawer';
import { useLocationStore } from '../../../../shared/stores/useLocationStore';
import { calculateDistance } from '../../../../shared/utils/distance';
import styles from './SpotListDrawer.module.scss';

interface SpotListDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSpotSelect?: (spotId: number) => void;
}

export const SpotListDrawer: React.FC<SpotListDrawerProps> = ({ isOpen, onClose, onSpotSelect }) => {
  const [isRendered, setIsRendered] = useState(isOpen);
  const scrollRef = React.useRef<any>(null);
  const { latitude, longitude } = useLocationStore();

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
    hasMore,
    loadMore,
    handleCategorySelect,
    handleBackToCategories,
    handleSortChange,
    keyword,
    setKeyword,
  } = useSpotListDrawer();

  React.useEffect(() => {
    if (!isOpen) {
      setKeyword('');
      // This resets the state back to categories view and clears loaded spots/page
      handleBackToCategories();
    } else {
      // Re-opening: reset scroll position to top
      if (scrollRef.current) {
        scrollRef.current.scrollTop = 0;
      }
    }
  }, [isOpen, handleBackToCategories, setKeyword]);

  if (!isRendered) return null;

  return (
    <div 
      className={`${styles.drawerContainer} ${isOpen ? styles.open : styles.close}`} 
      onAnimationEnd={onAnimationEnd}
    >
      <div className={styles.drawerHeader}>
        {selectedCategory ? (
          <span className={styles.categoryTitleText}>{selectedCategory.name}</span>
        ) : (
          <span className={styles.categoryTitleText}>Spot Categories</span>
        )}
        <CloseOutlined className={styles.closeBtnIcon} onClick={onClose} />
      </div>

      <div className={styles.content}>
        {!selectedCategory ? (
          <div className={styles.viewCategories}>
            <ul className={styles.categoryList} ref={scrollRef}>
              {categories.map((category) => (
                <li 
                  key={category.id} 
                  className={styles.catItem}
                  onClick={() => handleCategorySelect(category)}
                >
                  <div className={styles.categoryInfo}>
                    <span className={styles.categoryName}>{category.name}</span>
                    {category.icon && (
                      <span 
                        className={styles.categoryIcon}
                        style={{
                          WebkitMaskImage: `url(${category.icon})`,
                          WebkitMaskSize: 'contain',
                          WebkitMaskRepeat: 'no-repeat',
                          WebkitMaskPosition: 'center',
                          maskImage: `url(${category.icon})`,
                          maskSize: 'contain',
                          maskRepeat: 'no-repeat',
                          maskPosition: 'center',
                        }}
                      />
                    )}
                  </div>
                  <span className={styles.catArrow}>›</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className={styles.viewSpotList}>
            <div className={styles.backRow} onClick={() => { setKeyword(''); handleBackToCategories(); }}>
              <LeftOutlined style={{ fontSize: '12px' }} /> <span style={{ marginLeft: 4 }}>Back to Categories</span>
            </div>
            <div className={styles.spotListControls}>
              <input 
                type="text" 
                className={styles.miniSearch} 
                placeholder="Search..." 
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
              />
              <div className={styles.sortRow}>
                <span>Sort by:</span>
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

            <div className={styles.categoryList} ref={scrollRef}>
              {isSpotsLoading && spots.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>Loading spots...</div>
              ) : spots.length > 0 ? (
                <>
                  {spots.map((spot) => (
                    <div key={spot.id} className={styles.spotListItem} onClick={() => onSpotSelect?.(spot.id)}>
                      <div className={styles.spotItemName}>{spot.name}</div>
                      <div className={styles.spotItemMeta}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span className={styles.spotDistance}>{calculateDistance(latitude, longitude, spot.y, spot.x)}</span>
                          {spot.address}
                        </span>
                        <span style={{ color: 'orange', fontWeight: 'bold' }}>{spot.score?.toFixed(1) || '0.0'} ★</span>
                      </div>
                    </div>
                  ))}
                  {hasMore && (
                    <div 
                      onClick={loadMore} 
                      style={{ padding: '12px', textAlign: 'center', color: '#0066ff', cursor: 'pointer', fontSize: '13px' }}
                    >
                      {isSpotsLoading ? 'Loading...' : 'Load More'}
                    </div>
                  )}
                </>
              ) : (
                <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>No spots found.</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
