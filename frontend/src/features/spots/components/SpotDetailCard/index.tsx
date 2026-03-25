import React, { useState } from 'react';
import { CloseOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { useSpotDetail } from './useSpotDetail';
import { ReviewList } from '../../../reviews/components/ReviewList';
import { ReviewForm } from '../../../reviews/components/ReviewForm';
import styles from './SpotDetailCard.module.scss';
import { useUIStore } from '../../../../shared/stores/useUIStore';

export interface SpotDetailCardProps {
  spotId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SpotDetailCard: React.FC<SpotDetailCardProps> = ({ spotId, isOpen, onClose }) => {
  const [isRendered, setIsRendered] = useState(isOpen);
  const setSelectedPostId = useUIStore((state) => state.setSelectedPostId);

  if (isOpen && !isRendered) {
    setIsRendered(true);
  }

  const onAnimationEnd = () => {
    if (!isOpen) setIsRendered(false);
  };

  const { spot, recentPosts, isLoading, error } = useSpotDetail(isOpen ? spotId : null);

  if (!isRendered || !spotId) return null;

  return (
    <>
      <div 
        className={`${styles.backdrop} ${isOpen ? styles.fadeIn : styles.fadeOut}`} 
        onClick={onClose} 
      />
      <div className={styles.panelStack}>
        <div 
          className={`${styles.panelContainer} ${isOpen ? styles.slideIn : styles.slideOut}`}
          onAnimationEnd={onAnimationEnd}
        >
          <div className={styles.panelHeader}>
            <span>{spot?.name || 'Loading Spot...'}</span>
            <CloseOutlined className={styles.closeBtn} onClick={onClose} />
          </div>

          <div className={styles.panelBody}>
            {isLoading ? (
              <div className={styles.loadingContainer}>
                <Spin size="large" />
                <p>Loading spot details...</p>
              </div>
            ) : error ? (
              <div className={styles.errorContainer}>
                <p>Failed to load spot details.</p>
              </div>
            ) : spot ? (
              <>
                <div 
                  className={styles.spotHero}
                  style={{ backgroundImage: `url(${(Array.isArray(spot.images) ? spot.images[0] : spot.images?.split(',')[0]) || 'https://via.placeholder.com/500x300'})` }}
                >
                  <div className={styles.heroScoreBadge}>
                    {spot.score?.toFixed(1) || '0.0'} ★
                  </div>
                </div>
                
                <p className={styles.spotAddressInfo}>
                  <EnvironmentOutlined />
                  {spot.address} • 1.2 mi away
                </p>

                <button className={styles.quickPostBtn} onClick={() => console.log('post')}>
                  <span role="img" aria-label="camera">📷</span> Post Here
                </button>

                <div className={styles.recentPostsList}>
                  <div className={styles.sectionTitle}>Recent Posts</div>
                  
                  {recentPosts && recentPosts.length > 0 ? (
                    recentPosts.map(post => (
                      <div key={post.id} className={styles.miniPostItem} onClick={() => setSelectedPostId(post.id)}>
                        <div 
                          className={styles.postImgPlaceholder} 
                          style={{ backgroundImage: `url(${(Array.isArray(post.images) ? post.images[0] : post.images?.split(',')[0]) || 'https://via.placeholder.com/40'})` }}
                        />
                        <div className={styles.postItemInfo}>
                          <div className={styles.postTitle}>{post.title}</div>
                          <div className={styles.postMeta}>
                            By {post.userNickname} • {post.liked} Likes
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className={styles.emptyPosts}>No recent posts for this spot yet.</div>
                  )}
                </div>

                {/* Review Section */}
                <div className={styles.spotReviewsSection}>
                  <div className={styles.sectionTitle}>Reviews</div>
                  <ReviewForm spotId={spotId} />
                  <ReviewList spotId={spotId} />
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};
