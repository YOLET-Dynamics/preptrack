export interface Pagination<T> {
  totalPages: number;
  limit: number;
  page: number;
  rows: T[];
}
