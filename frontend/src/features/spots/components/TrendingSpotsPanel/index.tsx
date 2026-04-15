import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Flex, Skeleton } from 'antd';
import { FireFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getTrendingSpots } from '../../api/getTrendingSpots';
import { useUIStore } from '../../../../shared/stores/useUIStore';
import styles from './TrendingSpotsPanel.module.scss';
import type { SpotResponse } from '../../types';

interface TrendingSpotsPanelProps {
  isLoggedIn?: boolean;
  onLoginRequest?: () => void;
}

export const TrendingSpotsPanel: React.FC<TrendingSpotsPanelProps> = ({ 
  isLoggedIn = true, 
  onLoginRequest 
}) => {
  const setSelectedSpotId = useUIStore((state) => state.setSelectedSpotId);
  const setDrawerOpen = useUIStore((state) => state.setDrawerOpen);

  const { data: trendingRes, isLoading, isError } = useQuery({
    queryKey: ['trendingSpots'],
    queryFn: getTrendingSpots,
    staleTime: 5 * 60 * 1000, 
  });

  let spots: SpotResponse[] = trendingRes?.data || [];
  
  if (!isLoggedIn) {
    spots = spots.slice(0, 2);
  }

  const navigate = useNavigate();

  const handleSpotClick = (spotId: number) => {
    // Jump to the root layout where Spot Details are deeply contextualized
    navigate('/');
    // Open the detail card implicitly triggering global overlay
    setSelectedSpotId(spotId);
    setDrawerOpen(true); // Open the category drawer to provide layout foundations
  };

  return (
    <div className={styles.trendingPanel}>
      <div className={styles.panelHeader}>
        <FireFilled className={styles.fireIcon} /> Trending Spots
      </div>
      
      <div className={styles.spotListContainer}>
        {isLoading ? (
          <Flex vertical gap={12} className={styles.loadingSkeleton}>
            <Skeleton active avatar={{ shape: 'square', size: 40 }} title={false} paragraph={{ rows: 2, width: ['100%', '60%'] }} />
            <Skeleton active avatar={{ shape: 'square', size: 40 }} title={false} paragraph={{ rows: 2, width: ['100%', '60%'] }} />
            <Skeleton active avatar={{ shape: 'square', size: 40 }} title={false} paragraph={{ rows: 2, width: ['100%', '60%'] }} />
          </Flex>
        ) : isError || spots.length === 0 ? (
          <div className={styles.emptyState}>No trending spots yet</div>
        ) : (
          spots.map((spot) => (
            <div 
              key={spot.id} 
              className={styles.spotItem}
              onClick={() => handleSpotClick(spot.id)}
            >
              <img 
                src={(Array.isArray(spot.images) ? spot.images[0] : spot.images?.split(',')[0]) || 'https://via.placeholder.com/40'} 
                alt={spot.name} 
                className={styles.spotThumbnail} 
                loading="lazy"
              />
              <div className={styles.spotInfo}>
                <div className={styles.spotName} title={spot.name}>{spot.name}</div>
                <div className={styles.spotMeta}>
                  <div className={styles.spotDesc} title={spot.description}>{spot.description || 'Very popular place'}</div>
                  <div className={styles.spotScore}>{spot.score.toFixed(1)} ★</div>
                </div>
              </div>
            </div>
          ))
        )}

        {!isLoggedIn && !isLoading && !isError && (trendingRes?.data?.length || 0) > 0 && (
          <div className={styles.loginCardPrompt} onClick={onLoginRequest}>
            Log in to explore more spots
          </div>
        )}
      </div>
    </div>
  );
};
