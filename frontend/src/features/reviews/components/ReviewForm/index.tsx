import React, { useState } from 'react';
import { Input, Button, Rate, message } from 'antd';
import { useCreateSpotReview } from '../../hooks/useSpotReviews';
import styles from './ReviewForm.module.scss';

const { TextArea } = Input;

interface ReviewFormProps {
  spotId: number;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ spotId }) => {
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  
  const createReviewMutation = useCreateSpotReview(spotId);

  const handleSubmit = () => {
    if (!content.trim()) {
      message.warning('Please enter your review content');
      return;
    }

    createReviewMutation.mutate(
      { spotId, rating, content },
      {
        onSuccess: () => {
          message.success('Review submitted successfully!');
          setContent('');
          setRating(5);
        },
        onError: () => {
          message.error('Failed to submit review');
        }
      }
    );
  };

  return (
    <div className={styles.reviewForm}>
      <h3 className={styles.title}>Write a Review</h3>
      
      <div className={styles.ratingRow}>
        <span className={styles.label}>Your Rating:</span>
        <Rate 
          value={rating} 
          onChange={setRating} 
          className={styles.stars}
          style={{ color: '#fa8c16' }}
        />
      </div>
      
      <TextArea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Share your experience about this spot..."
        autoSize={{ minRows: 3, maxRows: 6 }}
        className={styles.textArea}
        maxLength={500}
        showCount
      />
      
      <div className={styles.actionRow}>
        <Button 
          onClick={handleSubmit} 
          loading={createReviewMutation.isPending}
          className={styles.submitButton}
        >
          Submit Review
        </Button>
      </div>
    </div>
  );
};
