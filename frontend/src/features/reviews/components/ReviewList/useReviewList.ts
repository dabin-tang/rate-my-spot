export const useReviewList = (spotId: number) => {
  console.log('useReviewList init', spotId);
  return {
    reviews: [],
    isLoading: false,
    fetchNextPage: () => {},
    hasNextPage: false,
    isFetchingNextPage: false
  };
};
