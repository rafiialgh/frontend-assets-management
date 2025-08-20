import type { BaseResponse } from '@/types/response';
import z from 'zod';
import type { Asset, AssetResponse, GetAssetParams } from './asset.type';
import { privateInstance } from '@/lib/axios';

const currentYear = new Date().getFullYear();

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

export const AssetSchema = z.object({
  lokasiId: z.string().nonempty({ error: 'Lokasi wajib diisi' }),
  kategoriAset: z.string().nonempty({ error: 'Kategori aset wajib diisi' }),
  merkDanTipe: z.string().min(1, 'Merk & Tipe wajib diisi'),
  tahun: z
    .number({ error: 'Tahun pembuatan wajib diisi' })
    .int('Tahun harus berupa angka')
    .min(1900, 'Minimal tahun 1900')
    .max(currentYear, `Maksimal tahun ${currentYear}`),
  kondisiAset: z.string().nonempty({ error: 'Kondisi aset wajib diisi' }),
  statusAset: z.string().nonempty({ error: 'Status aset wajib diisi' }),
  nomorSeri: z.string().nonempty({ error: 'Nomor seri wajib diisi' }),
  masaBerlaku: z.string().nonempty({ error: 'Masa berlaku wajib diisi' }),
  statusKepemilikan: z
    .string()
    .nonempty({ error: 'Status kepemilikan wajib diisi' }),
  foto: z
    .array(z.instanceof(File))
    .min(1, { error: 'Upload foto minimal 1' }) // Validasi jumlah minimal
    .refine(
      (files) => files.every((file) => file.size <= MAX_FILE_SIZE),
      `Ukuran maksimal setiap file adalah 5MB.`
    )
    .refine(
      (files) =>
        files.every((file) => ACCEPTED_IMAGE_TYPES.includes(file.type)),
      'Hanya format .jpg, .jpeg, .png dan .webp yang didukung.'
    ),
});

export type AssetValues = z.infer<typeof AssetSchema>;

export const getAssets = async (
  params: GetAssetParams
): Promise<AssetResponse<Asset[]>> =>
  privateInstance.get('/aset', { params }).then((res) => res.data);
