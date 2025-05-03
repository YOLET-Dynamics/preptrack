export interface PageInfo {
  page_number: number;
  page_size: number;
  total_pages: number;
}

export interface PaginationRes<T> {
  limit: number;
  page: number;
  totalPages: number;
  rows: T[];
}
