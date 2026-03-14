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

export interface SpotReviewResponse {
  id: number;
  userId: number;
  spotId: number;
  rating: number;
  content: string;
  images?: string;
  liked: number;
  createTime: string;
  userNickname: string;
  userIcon: string;
}
