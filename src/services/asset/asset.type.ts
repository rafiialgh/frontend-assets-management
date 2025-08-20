import type { Location } from "../location/location.type"

export interface Asset {
  asetId: string
  lokasi: Pick<Location, 'lokasi'>
  kategoriAset: string
  merkDanTipe: string
  tahun: number
  kondisiAset: string
  statusAset: string
  nomorSeri?: string
  masaBerlaku?: string
  statusKepemilikan?: string
  urlFoto?: string[]
  urlQR?: string
}

export type Pagination = {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
};

export type Summary = {
  totalAset: number;
  totalKategori: number;
  totalStatusAktif: number
  totalStatusMaintenance: number
  totalStatusNonaktif: number
}

export type AssetResponse<T> = {
  data: T;
  summary: Summary;
  pagination: Pagination;
  message: string;
  success: boolean;
};

export interface GetAssetParams {
  kategori?: string;
  status?: string;
  kondisi?: string;
  recent?: string;
  lokasi?: string;
  search?: string;
  page?: number;
  limit?: number;
}