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

export const getLocation = (): Promise<LocationResponse<Location[]>> =>
  privateInstance.get('/lokasi').then((res) => res.data);

export const getLocationById = (id: string): Promise<BaseResponse<Location>> =>
  privateInstance.get(`/lokasi/${id}`).then((res) => res.data);

export const createLocation = (data: LocationValues) =>
  privateInstance.post('/lokasi', data).then((res) => res.data);

export const deleteLocation = (id: string) =>
  privateInstance.delete(`/lokasi/${id}`).then((res) => res.data);

export const updateLocation = (data: LocationValues, id: string) =>
  privateInstance.put(`/lokasi/${id}`, data).then((res) => res.data);
