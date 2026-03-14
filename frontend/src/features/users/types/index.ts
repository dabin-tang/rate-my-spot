// Type definitions for user module
export interface UserProfileDTO {
  id: number;
  phone?: string;
  password?: string;
  nickname: string;
  icon?: string;
  userInfo?: string;
  createTime?: string;
  updateTime?: string;
  fans?: number;
  followee?: number;
  gender?: number;
  birthday?: string;
  city?: string;
  introduce?: string;
}

export interface UserLoginDTO {
  phone?: string;
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
  password?: string;
  nickname: string;
  icon?: string;
  userInfo?: string;
  createTime?: string;
  updateTime?: string;
  fans?: number;
  followee?: number;
  gender?: number;
  birthday?: string;
  city?: string;
  introduce?: string;
}

export interface UserUpdateDTO {
  nickname?: string;
  icon?: string;
  userInfo?: string;
  gender?: number;
  birthday?: string;
  city?: string;
  introduce?: string;
}
