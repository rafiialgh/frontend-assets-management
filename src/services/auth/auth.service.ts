import type { BaseResponse } from '@/types/response';
import { z } from 'zod';
import type {
  LoginResponse,
  Pagination,
  Summary,
  UsersResponse,
  UserType,
} from './auth.type';
import { globalInstance, privateInstance } from '@/lib/axios';

export interface GetUsersParams {
  role?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface GetUsersResponse {
  data: UserType[];
  pagination: Pagination;
  summary: Summary;
}

export const roles = ['admin', 'superadmin', 'maintenance'] as const;

export const authSchema = z.object({
  name: z.string().min(5, { message: 'Name must be at least 5 characters' }),
  email: z.email({ message: 'Invalid email address' }),
  role: z.enum(roles, { message: 'Invalid option' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
});

export const editUserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  role: z.enum(["admin", "superadmin", "maintenance"]),
  password: z.string().optional(),
});

export const registerSchema = authSchema;

export const loginSchema = authSchema.omit({ name: true, role: true });

export type LoginValues = z.infer<typeof loginSchema>;

export type RegisterValues = z.infer<typeof registerSchema>;

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

export const updateUsers = (data: RegisterValues, id: string) =>
  privateInstance.put(`/auth/users/${id}`, data).then((res) => res.data);

export const deleteUsers = (id: string) =>
  privateInstance.delete(`/auth/users/${id}`).then((res) => res.data);
