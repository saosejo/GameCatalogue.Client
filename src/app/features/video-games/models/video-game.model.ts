export interface VideoGame {
  id: number;
  title: string;
  publisher?: string;
  releaseDate?: Date;
  genre?: string;
  rating?: number;
  description?: string;
  platform?: string;
  price?: number;
  isActive: boolean;
}

export interface PaginatedResult<T> {
  items: T[];
  pageIndex: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface UpdateVideoGameVm {
  id: number;
  title: string;
  publisher?: string;
  releaseDate?: Date;
  genre?: string;
  rating?: number;
  description?: string;
  platform?: string;
  price?: number;
}