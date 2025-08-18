export interface LoginResponse {
  email: string
  name: string
  role: string
  token: string
}

export type Pagination = {
  totalItems: number
  totalPages: number
  currentPage: number
  pageSize: number
}

export type Summary = {
  totalUsers: number
  totalSuperAdmin: number
  totalAdmin: number
  totalMaintenance: number
  totalAktifUser: number
}

export type UsersResponse<T> = {
  data: T
  summary: Summary
  pagination: Pagination
  message: string
  success: boolean
}

export interface UserType {
  id: string;
  email: string;
  name: string;
  password?: string;
  role: string;
  lastLogin: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

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