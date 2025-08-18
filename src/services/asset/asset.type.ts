export interface Asset {
  asetId: string
  lokasiId: string
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