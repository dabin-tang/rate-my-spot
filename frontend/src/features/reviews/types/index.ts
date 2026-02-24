// src/features/reviews/types/index.ts
export interface SpotReviewCreateDTO {
  spotId: number;
  rating: number;
  content?: string;
  images?: string[];
}

export interface SpotReviewPageReq {
  spotId: number;
  page?: number;
  size?: number;
}
