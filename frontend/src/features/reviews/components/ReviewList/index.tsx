import React from 'react';
import { Spin } from 'antd';
import { StarFilled, HeartOutlined } from '@ant-design/icons';
import { useSpotReviews } from '../../hooks/useSpotReviews';
import styles from './ReviewList.module.scss';
import type { SpotReviewResponse } from '../../types';

interface ReviewListProps {
  spotId: number;
}

export const ReviewList: React.FC<ReviewListProps> = ({ spotId }) => {
  const { data: pageData, isLoading, isError } = useSpotReviews(spotId);
  const reviews: SpotReviewResponse[] = pageData?.list || [];

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin />
        <p>Loading reviews...</p>
      </div>
    );
  }

  if (isError) {
    return <div className={styles.errorText}>Failed to load reviews.</div>;
  }

  return (
    <div className={styles.reviewList}>
      <h3 className={styles.title}>Reviews ({pageData?.total || 0})</h3>
      
      {reviews.length > 0 ? (
        <div className={styles.listContainer}>
          {reviews.map((review) => (
            <div key={review.id} className={styles.reviewCard}>
              <div className={styles.header}>
                <div className={styles.userInfo}>
                  <img src={review.userIcon || `https://api.dicebear.com/7.x/avataaars/svg?seed=${review.userId}`} alt="avatar" className={styles.avatar} />
                  <span className={styles.userName}>{review.userNickname}</span>
                </div>
                <div className={styles.rating}>
                  <StarFilled /> {review.rating.toFixed(1)}
                </div>
              </div>
              
              <p className={styles.content}>{review.content}</p>
              
              {review.images && (
                <div className={styles.imageGrid}>
                  {review.images.split(',').map((imgUrl, idx) => (
                    <div 
                      key={idx} 
                      className={styles.reviewImage}
                      style={{ backgroundImage: `url(${imgUrl})` }}
                    />
                  ))}
                </div>
              )}
              
              <div className={styles.footer}>
                <span className={styles.date}>{new Date(review.createTime).toLocaleDateString()}</span>
                <span className={styles.likes}>
                  <HeartOutlined /> {review.liked || 0}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>No reviews yet. Be the first to review!</div>
      )}
    </div>
  );
};
