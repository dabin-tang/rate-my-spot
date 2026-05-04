export interface AdminLoginRequest {
  username: string;
  password?: string;
}

export interface AdminUser {
  id: number;
  username: string;
  role: string | number;
}

export interface AdminStatsResponse {
  totalUsers: number;
  totalPosts: number;
  todayPosts: number;
  totalSpots: number;
}

export interface PageResult<T> {
  page: number;
  size: number;
  total: number;
  totalPages: number;
  list: T[];
}

export interface AdminUserQueryDTO {
  nickname?: string;
  email?: string;
  page?: number;
  size?: number;
}

export interface AdminUserResponse {
  id: number;
  email: string;
  nickname: string;
  icon: string;
  city: string;
  credit: number;
  status: number;
  createTime: string;
}

export interface AdminSpotQueryDTO {
  categoryId?: number;
  page?: number;
  size?: number;
}

export interface SpotCreateDTO {
  name: string;
  categoryId: number;
  description?: string;
  address: string;
  images?: string;
  x: number;
  y: number;
}

export interface AdminCategoryResponse {
  id: number;
  name: string;
  icon: string | null;
  sort: number;
}

export interface SpotCategoryUpdateDTO {
  name?: string;
  icon?: string;
  sort?: number;
}

export interface AdminPostQueryDTO {
  page?: number;
  size?: number;
}

export interface AdminCommentQueryDTO {
  postId?: number;
  keyword?: string;
  page?: number;
  size?: number;
}

export interface AdminCommentResponse {
  id: number;
  postId: number;
  userId: number;
  parentId?: number;
  content: string;
  image?: string;
  liked: number;
  createTime: string;
}

export interface SpotReviewResponse {
  id: number;
  userId: number;
  userNickname: string;
  userIcon: string;
  rating: number;
  content: string;
  images: string[];
  createTime: string;
}

export interface AdminReviewQueryDTO {
  spotReviewId?: number;
  page?: number;
  size?: number;
}

export interface ReportResponse {
  id: number;
  userId: number;
  targetType: string;
  targetId: number;
  reason: string;
  status: number;
  adminRemark: string | null;
  createTime: string;
  updateTime: string;
}

export interface AdminReportQueryDTO {
  status?: number;
  page?: number;
  size?: number;
}








