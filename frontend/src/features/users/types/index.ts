// Type definitions for user module
export interface UserProfileDTO {
  id: number;
  phone?: string;
  email?: string;
  password?: string;
  nickname: string;
  icon?: string;
  intro?: string;
  credit?: number;
  status?: number;
  createTime?: string;
  updateTime?: string;
  fans?: number;
  followee?: number;
  gender?: number;
  birthday?: string;
  city?: string;
  introduce?: string;
  likesPrivate?: boolean;
}

export interface UserLoginDTO {
  email?: string;
  password?: string;
  code?: string;
}

export interface UserRegisterDTO {
  email?: string;
  password?: string;
  code?: string;
}

export interface User {
  id: number;
  phone?: string;
  email?: string;
  password?: string;
  nickname: string;
  icon?: string;
  intro?: string;
  credit?: number;
  status?: number;
  createTime?: string;
  updateTime?: string;
  fans?: number;
  followee?: number;
  gender?: number;
  birthday?: string;
  city?: string;
}

export interface UserUpdateDTO {
  nickname?: string;
  icon?: string;
  intro?: string;
  gender?: number;
  birthday?: string;
  city?: string;
}

export interface UserResponse {
  id: number;
  nickname: string;
  icon?: string;
  city?: string;
  intro?: string;
  isFollow?: boolean;
}

export interface PageResult<T> {
  pageNum: number;
  pageSize: number;
  total: number;
  totalPages: number;
  list: T[];
}
