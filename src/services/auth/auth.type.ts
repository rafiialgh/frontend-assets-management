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


