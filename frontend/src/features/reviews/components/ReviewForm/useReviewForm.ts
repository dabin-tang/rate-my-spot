export const useReviewForm = (spotId: number, onSuccess: () => void) => {
  console.log('useReviewForm init', spotId, onSuccess);
  return {
    isSubmitting: false,
    onSubmit: (values: any) => { console.log('submitting', values); }
  };
};
