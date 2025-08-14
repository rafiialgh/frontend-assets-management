import type { BaseResponse } from '@/types/response';
import { z } from 'zod';
import type { Location, LocationResponse } from './location.type';
import { privateInstance } from '@/lib/axios';

export const locationSchema = z.object({
  lokasi: z
    .string()
    .min(3, { message: 'Location must be at least 3 characters' }),
  kategori: z.array(z.string()).nonempty('Pilih minimal satu kategori'),
});

export type LocationValues = z.infer<typeof locationSchema>;

export const getLocation = (): Promise<BaseResponse<Location[]>> =>
  privateInstance.get('/lokasi').then((res) => res.data);

export const createLocation = (data: Location) =>
  privateInstance.post('/lokasi', data).then((res) => res.data);
