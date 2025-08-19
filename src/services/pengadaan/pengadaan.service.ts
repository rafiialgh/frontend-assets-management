import type { BaseResponse } from '@/types/response';
import { z } from 'zod';
import type { Procurement, ProcurementResponse } from './pengadaan.type';
import { privateInstance } from '@/lib/axios';

export const addProcurementSchema = z.object({
  tanggalBeli: z.string().nonempty('Tanggal beli wajib diisi'),
  lokasiId: z.string().nonempty('Lokasi wajib diisi'),
  kategoriAset: z.string().nonempty('Kategori wajib dipilih'),
  namaAset: z.string().nonempty('Nama aset wajib diisi'),
  jumlahAset: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'Jumlah aset minimum 1',
    }),
  hargaSatuan: z
    .string()
    .nonempty('Harga satuan wajib diisi')
    .refine((val) => {
      const numberVal = Number(val);
      return !isNaN(numberVal) && numberVal >= 1000;
  }, {
    message: 'Minimal harga 1000',
  }),

  vendor: z.string().nonempty('Vendor wajib diisi'),
});

export const editProcurementSchema = addProcurementSchema; 

export type ProcurementValues = z.infer<typeof addProcurementSchema>;

export const getProcurements = (): Promise<
  ProcurementResponse<Procurement[]>
> =>
  privateInstance.get('/pengadaan').then((res) => res.data);

export const getProcurementById = (
  id: string
): Promise<ProcurementResponse<Procurement>> =>
  privateInstance.get(`/pengadaan/${id}`).then((res) => res.data);

export const addProcurement = (data: ProcurementValues) =>
  privateInstance.post('/pengadaan', data).then((res) => res.data);

export const getAssetCategories = (): Promise<{ kategoriAset: string[] }> => {
  return privateInstance.get('/aset/get').then(res => res.data);
};

export const updateProcurement = (data: ProcurementValues, id: string) =>
  privateInstance.put(`/pengadaan/${id}`, data).then((res) => res.data);

export const deleteProcurement = (id: string) =>
  privateInstance.delete(`/pengadaan/${id}`).then((res) => res.data);
