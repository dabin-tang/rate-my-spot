import React from 'react';
import { StarFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { SpotResponse } from '../../types';
import styles from './SpotCard.module.scss';

interface SpotCardProps {
  spot: SpotResponse;
}

export const SpotCard: React.FC<SpotCardProps> = ({ spot }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/spot/${spot.id}`);
  };

  // Safe fallback for image parsing
  let imageUrl = '';
  try {
    if (spot.images) {
      if (spot.images.startsWith('[')) {
          const parsed = JSON.parse(spot.images);
          imageUrl = Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : '';
      } else {
        imageUrl = spot.images.split(',')[0];
      }
    }
  } catch (e) {
    imageUrl = spot.images?.split(',')[0] || '';
  }

  return (
    <div className={styles.card} onClick={handleCardClick}>
      <img 
        src={imageUrl || 'https://via.placeholder.com/400x300?text=No+Image'} 
        alt={spot.name} 
        className={styles.image} 
      />
      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.name}>{spot.name}</h3>
          <div className={styles.score}>
            <StarFilled />
            <span>{spot.score?.toFixed(1) || '0.0'}</span>
          </div>
        </div>
        <p className={styles.description}>{spot.description}</p>
        <div className={styles.footer}>
          <span>{spot.address || 'Unknown Location'}</span>
          <span>{spot.reviewCount || 0} reviews</span>
        </div>
      </div>
    </div>
  );
};
