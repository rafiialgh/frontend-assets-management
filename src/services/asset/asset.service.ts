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

export const AssetSchema = z
  .object({
    kategoriAset: z.string().nonempty({ message: 'Kategori aset wajib diisi' }),
    subKategoriAset: z.string().optional(),
    merkDanTipe: z.string().min(1, 'Merk dan tipe wajib diisi'),
    statusKepemilikan: z
      .string()
      .nonempty({ message: 'Status kepemilikan wajib diisi' }),
    pic: z.string().optional(),

    // Aset fisik
    lokasiId: z.string().optional(),
    tahun: z
    .number({ error: 'Tahun pembuatan wajib diisi' })
    .int('Tahun harus berupa angka')
    .min(1900, 'Minimal tahun 1900')
    .max(currentYear, `Maksimal tahun ${currentYear}`).optional(),
    statusAset: z.string().optional(),
    kondisiAset: z.string().optional(),
    nomorSeri: z.string().optional(),
    foto: z
      .array(z.instanceof(File))
      .optional()
      .refine(
        (files) => !files || files.every((file) => file.size <= MAX_FILE_SIZE),
        'Ukuran maksimal setiap file adalah 5MB.'
      )
      .refine(
        (files) =>
          !files ||
          files.every((file) => ACCEPTED_IMAGE_TYPES.includes(file.type)),
        'Hanya format .jpg, .jpeg, .png dan .webp yang didukung.'
      ),

    // Aset digital
    masaBerlaku: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // Cek kategori aset
    if (data.kategoriAset === 'Aset Fisik') {
      if (!data.subKategoriAset) {
        ctx.addIssue({
          path: ['subKategoriAset'],
          code: 'custom',
          message: 'Jenis aset wajib diisi',
        });
      }
      if (!data.lokasiId) {
        ctx.addIssue({
          path: ['lokasiId'],
          code: 'custom',
          message: 'Lokasi wajib diisi',
        });
      }
      if (!data.tahun) {
        ctx.addIssue({
          path: ['tahun'],
          code: 'custom',
          message: 'Tahun wajib diisi',
        });
      }
      if (!data.statusAset) {
        ctx.addIssue({
          path: ['statusAset'],
          code: 'custom',
          message: 'Status aset wajib diisi',
        });
      }
      if (!data.kondisiAset) {
        ctx.addIssue({
          path: ['kondisiAset'],
          code: 'custom',
          message: 'Kondisi aset wajib diisi',
        });
      }
      if (!data.nomorSeri) {
        ctx.addIssue({
          path: ['nomorSeri'],
          code: 'custom',
          message: 'Nomor seri wajib diisi',
        });
      }
      if (!data.foto || data.foto.length === 0) {
        ctx.addIssue({
          path: ['foto'],
          code: 'custom',
          message: 'Minimal 1 foto wajib diupload',
        });
      }
    }

    if (data.kategoriAset === 'Aset Digital') {
      if (!data.masaBerlaku) {
        ctx.addIssue({
          path: ['masaBerlaku'],
          code: 'custom',
          message: 'Masa berlaku wajib diisi',
        });
      }
    }

    // Cek status kepemilikan
    if (data.statusKepemilikan === 'Pribadi' && !data.pic) {
      ctx.addIssue({
        path: ['pic'],
        code: 'custom',
        message: 'PIC wajib diisi jika hak milik pribadi',
      });
    }
  });

// export const AssetSchema = z.object({
//   lokasiId: z.string().nonempty({ error: 'Lokasi wajib diisi' }),
//   kategoriAset: z.string().nonempty({ error: 'Kategori aset wajib diisi' }),
//   subKategoriAset: z.string().nonempty({ error: 'Jenis aset wajib diisi'}),
//   merkDanTipe: z.string().min(1, 'Nama aset wajib diisi'),
//   tahun: z
//     .number({ error: 'Tahun pembuatan wajib diisi' })
//     .int('Tahun harus berupa angka')
//     .min(1900, 'Minimal tahun 1900')
//     .max(currentYear, `Maksimal tahun ${currentYear}`),
//   kondisiAset: z.string().nonempty({ error: 'Kondisi aset wajib diisi' }),
//   statusAset: z.string().nonempty({ error: 'Status aset wajib diisi' }),
//   nomorSeri: z.string().nonempty({ error: 'Nomor seri wajib diisi' }),
//   masaBerlaku: z.string().nonempty({ error: 'Masa berlaku wajib diisi' }),
//   pic: z.string().nonempty({ error: 'PIC wajib diisi' }),
//   statusKepemilikan: z
//     .string()
//     .nonempty({ error: 'Status kepemilikan wajib diisi' }),
//   foto: z
//     .array(z.instanceof(File))
//     .min(1, { error: 'Upload foto minimal 1' })
//     .refine(
//       (files) => files.every((file) => file.size <= MAX_FILE_SIZE),
//       `Ukuran maksimal setiap file adalah 5MB.`
//     )
//     .refine(
//       (files) =>
//         files.every((file) => ACCEPTED_IMAGE_TYPES.includes(file.type)),
//       'Hanya format .jpg, .jpeg, .png dan .webp yang didukung.'
//     ),
// });

export type AssetValues = z.infer<typeof AssetSchema>;

export const getAssets = async (
  params: GetAssetParams
): Promise<AssetResponse<Asset[]>> =>
  privateInstance.get('/aset', { params }).then((res) => res.data);

export const addAsset = (data: FormData) =>
  privateInstance
    .post('/aset/add', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((res) => res.data);
