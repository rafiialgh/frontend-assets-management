import type { BaseResponse } from '@/types/response';
import { z } from 'zod';
import type { LoginResponse, UsersResponse } from './auth.type';
import { globalInstance, privateInstance } from '@/lib/axios';
import type { UserType } from '../user/user.type';

export const roles = ['admin', 'superadmin', 'maintenance'] as const;

export const authSchema = z.object({
  name: z.string().min(5),
  email: z.email({ message: 'Invalid email address' }),
  role: z.enum(roles, { message: 'Invalid option' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
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
