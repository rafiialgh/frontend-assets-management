export interface Location {
  idLokasi: string;
  lokasi: string;
  kategoriAset: string[];
  totalAset: number;
}

export type Pagination = {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
};

export type LocationResponse<T> = {
  data: T;
  totalLokasi: string;
  pagination: Pagination;
  message: string;
  success: boolean;
};
