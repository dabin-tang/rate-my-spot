import React from 'react';
import { useReviewList } from './useReviewList';
import styles from './ReviewList.module.scss';
import type { SpotReviewResponse } from '../../types';

interface ReviewListProps {
  spotId: number;
}

export const ReviewList: React.FC<ReviewListProps> = ({ spotId }) => {
  const { reviews, isLoading } = useReviewList(spotId);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <p>Review list for spot {spotId} goes here... {reviews.length} reviews.</p>
      {reviews.map((review: SpotReviewResponse) => <div key={review.id}>{review.content}</div>)}
    </div>
  );
};
