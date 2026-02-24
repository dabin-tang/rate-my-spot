// src/features/posts/types/index.ts
export interface PostCreateDTO {
  spotId: number;
  title: string;
  content: string;
  images: string;
  rating: number;
}

export interface PostResponse {
  id: number;
  title: string;
  content: string;
  images: string;
  spotId: number;
  spotName?: string;
  userId: number;
  spotScore: number;
  userNickname: string;
  userIcon: string;
  liked: number;
  isLiked: boolean;
  createTime: string;
  updateTime: string;
}

export interface PostFeedRequestDTO {
  categoryId?: number;
  sort?: string;
  page?: number;
  size?: number;
}
