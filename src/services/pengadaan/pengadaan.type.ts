export interface Procurement {
  idPengadaan: number;
  tanggalBeli: string;
  lokasiId: string;
  kategoriAset: string;
  namaAset: string;
  jumlahAset: number;
  hargaSatuan: number;
  vendor: string;
  totalHarga?: number;
}

export type Pagination = {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
};

export type ProcurementResponse<T> = {
  data: T;
  totalPengadaan: number;
  pagination: Pagination;
  message: string;
  success: boolean;
  highestCost?: Procurement;
  lowestCost?: Procurement;
};
