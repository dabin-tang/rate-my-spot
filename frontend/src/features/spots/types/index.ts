// src/features/spots/types/index.ts
export interface SpotCategory {
  id: number;
  name: string;
  icon?: string;
  createTime?: string;
  updateTime?: string;
}

export interface SpotResponse {
  id: number;
  name: string;
  categoryId: number;
  description: string;
  address: string;
  images: string;
  x: number;
  y: number;
  score: number;
  reviewCount: number;
  createTime: string;
  updateTime: string;
}

export interface SpotPageReq {
  categoryId?: number;
  sort?: string;
  latitude: number;
  longitude: number;
  page?: number;
}
