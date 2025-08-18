import type { BaseResponse } from '@/types/response';
import { z } from 'zod';
import type {
  GetUsersParams,
  GetUsersResponse,
  LoginResponse,
  Pagination,
  Summary,
  UsersResponse,
  UserType,
} from './auth.type';
import { globalInstance, privateInstance } from '@/lib/axios';



export const roles = ['admin', 'superadmin', 'maintenance'] as const;

export const authSchema = z.object({
  name: z.string().min(5, { message: 'Name must be at least 5 characters' }),
  email: z.email({ message: 'Invalid email address' }),
  role: z.enum(roles, { message: 'Invalid option' }),
});

export const addUserSchema = authSchema.extend({
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
});

export const editUserSchema = authSchema.extend({
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' })
    .or(z.literal('')) // Izinkan string kosong
    .optional(), // Jadikan opsional
});

export const loginSchema = authSchema.omit({ role: true, name: true }).extend({
  password: z
  .string()
  .min(6, { message: 'Password must be at least 6 characters' }),
});

export type LoginValues = z.infer<typeof loginSchema>;

export type RegisterValues = z.infer<typeof addUserSchema>;

export type UpdateUserValues = z.infer<typeof editUserSchema>; 

export const login = async (
  data: LoginValues
): Promise<BaseResponse<LoginResponse>> =>
  globalInstance.post('/auth/login', data).then((res) => res.data);

export const signUp = async (data: RegisterValues) =>
  privateInstance.post('/auth/register', data).then((res) => res.data);

export const getAllUser = (): Promise<UsersResponse<UserType[]>> =>
  privateInstance.get('/auth/users').then((res) => res.data);

export const getUsers = async (
  params: GetUsersParams
): Promise<GetUsersResponse> => {
  const { data } = await privateInstance.get<GetUsersResponse>('/auth/users', {
    params,
  });
  return data;
};

export const getUserById = (id: string): Promise<BaseResponse<UserType>> =>
  privateInstance.get(`/auth/users/${id}`).then((res) => res.data);

export const updateUsers = (data: UpdateUserValues, id: string) =>
  privateInstance.put(`/auth/users/${id}`, data).then((res) => res.data);

export const deleteUsers = (id: string) =>
  privateInstance.delete(`/auth/users/${id}`).then((res) => res.data);
