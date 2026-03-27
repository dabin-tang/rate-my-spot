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
  rating: number;
  userNickname: string;
  userIcon: string;
  liked: number;
  isLiked: boolean;
  isFollow?: boolean;
  commentCount?: number;
  createTime: string;
  updateTime: string;
}

export interface PostFeedRequestDTO {
  categoryId?: number;
  sort?: string;
  page?: number;
  size?: number;
}

export interface PostCommentCreateDTO {
  postId: number;
  userId: number;
  parentId?: number;
  replyToUserId?: number;
  content: string;
  image?: string;
}

export interface PostCommentResponse {
  id: number;
  postId: number;
  userId: number;
  parentId?: number;
  replyToUserId?: number;
  content: string;
  image?: string;
  liked: number;
  isLiked: boolean;
  createTime: string;
  children: PostCommentResponse[];
  // Assuming backend join or frontend population might add these:
  userNickname?: string;
  userIcon?: string;
  replyToUserNickname?: string;
}
