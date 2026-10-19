export interface PaginatedResponse<T> {
  products: T[];
  total: number;
  skip: number;
  limit: number;
}
