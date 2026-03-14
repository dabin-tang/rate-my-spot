import React from 'react';
import { useReviewForm } from './useReviewForm';
import styles from './ReviewForm.module.scss';

interface ReviewFormProps {
  spotId: number;
  onSuccess: () => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ spotId, onSuccess }) => {
  const { isSubmitting, onSubmit } = useReviewForm(spotId, onSuccess);

  return (
    <div className={styles.container}>
      <p>Review form goes here...</p>
      <button disabled={isSubmitting} onClick={() => onSubmit({ spotId })}>Submit dummy</button>
    </div>
  );
};
