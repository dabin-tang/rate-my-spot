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
